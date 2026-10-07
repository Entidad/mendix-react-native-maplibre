import { Component, ReactNode, createRef } from "react";
import { View, Text, Pressable, Modal, Image, ScrollView } from "react-native";
import {
    Map,
    Camera,
    CameraRef,
    GeoJSONSource,
    GeoJSONSourceRef,
    Layer,
    Images,
    ImageEntry,
    FilterSpecification
} from "@maplibre/maplibre-react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { EditableValue, ObjectItem } from "mendix";
import { Big } from "big.js";
import type { Feature, FeatureCollection, Point } from "geojson";
import { MarkerLayersType } from "../../typings/MapLibreProps";
import { mapDataStyles as styles } from "../ui/styles";

interface SelectedMarker {
    layerIndex: number;
    itemId: string;
}

// Coordinates may come from Decimal (Big), Integer/Long (Big) or String attributes.
function toCoordinate(value: Big | string | undefined, limit: number): number | undefined {
    if (value === undefined || value === "") {
        return undefined;
    }
    const coordinate = Number(value.toString());
    return Number.isFinite(coordinate) && Math.abs(coordinate) <= limit ? coordinate : undefined;
}

// A static image from an image collection resolves to a bundled asset (number); a dynamic
// image resolves to a URI source. SVG markup (string) can't be used as a map icon.
function toImageEntry(layer: MarkerLayersType): ImageEntry | undefined {
    const image = layer.markerIcon?.status === "available" ? layer.markerIcon.value : undefined;
    if (typeof image === "number") {
        return image;
    }
    return typeof image === "object" && image !== null ? { source: image } : undefined;
}

// Symbol icons are scaled relative to the image's own size; fit its largest side to "Icon size".
function toIconScale(entry: ImageEntry, iconSize: number): number {
    const size =
        typeof entry === "number"
            ? Image.resolveAssetSource(entry)
            : typeof entry === "object" && !Array.isArray(entry.source) && typeof entry.source === "object"
            ? entry.source
            : undefined;
    const largestSide = Math.max(size?.width ?? 0, size?.height ?? 0);
    return largestSide > 0 ? iconSize / largestSide : 1;
}

interface LayerFeatures {
    items: ObjectItem[] | undefined;
    latitude: MarkerLayersType["latitude"];
    longitude: MarkerLayersType["longitude"];
    spread: boolean;
    collection: FeatureCollection<Point>;
    itemsById: Record<string, ObjectItem>;
}

const METERS_PER_DEGREE_LAT = 111320;
// Spacing between markers spread out from a shared coordinate; they separate around zoom 15.
const SPREAD_METERS = 90;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
// Never zoom into a cluster further than street level, where many styles have no more detail.
const MAX_CLUSTER_ZOOM = 16;

// Markers at exactly the same coordinate (e.g. geocoded to the same town) can never be told
// apart by zooming. Fan them out on a small sunflower spiral around the shared point instead.
function spreadOverlapping(features: Array<Feature<Point>>): void {
    const groups: Record<string, Array<Feature<Point>>> = {};
    for (const feature of features) {
        const key = feature.geometry.coordinates.join(",");
        (groups[key] ??= []).push(feature);
    }

    for (const group of Object.values(groups)) {
        if (group.length < 2) {
            continue;
        }
        const [lng, lat] = group[0].geometry.coordinates;
        const metersPerDegreeLng = METERS_PER_DEGREE_LAT * Math.max(Math.cos((lat * Math.PI) / 180), 0.01);

        group.forEach((feature, index) => {
            const radius = SPREAD_METERS * Math.sqrt(index + 0.5);
            const angle = index * GOLDEN_ANGLE;
            feature.geometry.coordinates = [
                lng + (radius * Math.cos(angle)) / metersPerDegreeLng,
                lat + (radius * Math.sin(angle)) / METERS_PER_DEGREE_LAT
            ];
        });
    }
}

const iconImageName = (layerIndex: number): string => `mx-markers-${layerIndex}-icon`;

// Clustered sources mark cluster features with a point_count property.
const IS_CLUSTER: FilterSpecification = ["has", "point_count"];
const IS_NOT_CLUSTER: FilterSpecification = ["!", ["has", "point_count"]];

// The default marker when no icon is set: a white dot with a teal ring.
const DEFAULT_MARKER_PAINT = {
    "circle-radius": 6,
    "circle-color": "#FFFFFF",
    "circle-stroke-width": 6,
    "circle-stroke-color": "#1C7D77"
};

type Corner = "bottomRight" | "bottomLeft" | "topRight" | "topLeft";

export interface AttributionOptions {
    showButton: boolean;
    position: Corner;
    text?: string;
    tintColor?: string;
}

const ORNAMENT_MARGIN = 8;
// Room for the (i) button when the credit text sits beside it.
const ATTRIBUTION_BUTTON_SPACE = 32;
// The MapLibre logo occupies the bottom-left corner, so bottom-left attribution sits above it.
const LOGO_CLEARANCE = 40;

type CornerPosition =
    | { bottom: number; right: number }
    | { bottom: number; left: number }
    | { top: number; right: number }
    | { top: number; left: number };

// Map ornaments and our own overlays take the same { top|bottom, left|right } position shape.
function cornerPosition(corner: Corner, inset: number): CornerPosition {
    switch (corner) {
        case "bottomLeft":
            return { bottom: LOGO_CLEARANCE, left: inset };
        case "topRight":
            return { top: ORNAMENT_MARGIN, right: inset };
        case "topLeft":
            return { top: ORNAMENT_MARGIN, left: inset };
        default:
            return { bottom: ORNAMENT_MARGIN, right: inset };
    }
}

interface MapDataProps {
    layers: MarkerLayersType[];
    onClose?: () => void;
    mapStyle?: string;
    popupVisible?: EditableValue<boolean>;
    attribution: AttributionOptions;
    clusterFont: string;
    showClusterToggle: boolean;
}

function hasPopup(layer: MarkerLayersType): boolean {
    return !!(layer.popupHeader || layer.popupContent);
}

interface MapDataState {
    selected: SelectedMarker | null;
    // Session toggle for layers with "Cluster markers" on; off shows every marker.
    clustering: boolean;
}

export class MapData extends Component<MapDataProps, MapDataState> {
    private readonly layerFeatures: Array<LayerFeatures | undefined> = [];
    private readonly cameraRef = createRef<CameraRef>();
    private readonly sourceRefs: Array<GeoJSONSourceRef | null> = [];

    constructor(props: MapDataProps) {
        super(props);
        this.state = {
            selected: null,
            clustering: true
        };
    }

    private readonly toggleClustering = (): void => {
        this.setState(prevState => ({ clustering: !prevState.clustering }));
    };

    private renderClusterToggle(): ReactNode {
        if (!this.props.showClusterToggle || !this.props.layers.some(layer => layer.cluster)) {
            return null;
        }

        const { clustering } = this.state;

        return (
            // Mirrors the close button in the top right corner, below the status bar / notch.
            <SafeAreaInsetsContext.Consumer>
                {insets => (
                    <Pressable
                        style={[styles.mapButton, { top: (insets?.top ?? 0) + 12, right: (insets?.right ?? 0) + 12 }]}
                        onPress={this.toggleClustering}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={clustering ? "Show all markers" : "Group markers"}
                    >
                        {/* The icon shows what tapping does: scattered dots ungroup, one bubble groups. */}
                        {clustering ? (
                            <View style={styles.scatterIcon}>
                                <View style={[styles.scatterDot, styles.scatterDotTop]} />
                                <View style={[styles.scatterDot, styles.scatterDotLeft]} />
                                <View style={[styles.scatterDot, styles.scatterDotRight]} />
                            </View>
                        ) : (
                            <View style={styles.clusterIcon}>
                                <View style={styles.clusterIconCore} />
                            </View>
                        )}
                    </Pressable>
                )}
            </SafeAreaInsetsContext.Consumer>
        );
    }

    private handleMarkerPress(layerIndex: number, item: ObjectItem): void {
        const layer = this.props.layers[layerIndex];
        const action = layer.onMarkerClick?.get(item);

        if (action?.canExecute && !action.isExecuting) {
            action.execute();
        }
        if (hasPopup(layer)) {
            this.setState({ selected: { layerIndex, itemId: item.id } });
            this.setPopupVisible(true);
        }
    }

    private readonly closePopup = (): void => {
        this.setState({ selected: null });
        this.setPopupVisible(false);
    };

    // Mirrors the popup state into the optional "Popup visible" attribute, so the app can close it.
    private setPopupVisible(visible: boolean): void {
        const { popupVisible } = this.props;

        if (popupVisible?.status === "available" && !popupVisible.readOnly && popupVisible.value !== visible) {
            popupVisible.setValue(visible);
        }
    }

    // The app closed the popup by setting the attribute to false.
    private isClosedByApp(): boolean {
        const { popupVisible } = this.props;
        // A read-only attribute can't be set to true on tap, so it must not keep the popup hidden.
        return popupVisible?.status === "available" && !popupVisible.readOnly && popupVisible.value === false;
    }

    // Rebuilds a layer's GeoJSON only when its data changes, so opening a popup doesn't
    // resend every marker to the native map.
    private getLayerFeatures(layer: MarkerLayersType, layerIndex: number): LayerFeatures {
        const cached = this.layerFeatures[layerIndex];
        if (
            cached &&
            cached.items === layer.markers.items &&
            cached.latitude === layer.latitude &&
            cached.longitude === layer.longitude &&
            cached.spread === layer.spreadOverlapping
        ) {
            return cached;
        }

        const features: Array<Feature<Point>> = [];
        const itemsById: Record<string, ObjectItem> = {};

        for (const item of layer.markers.items ?? []) {
            const lat = toCoordinate(layer.latitude.get(item).value, 90);
            const lng = toCoordinate(layer.longitude.get(item).value, 180);

            if (lat !== undefined && lng !== undefined) {
                itemsById[item.id] = item;
                features.push({
                    type: "Feature",
                    geometry: { type: "Point", coordinates: [lng, lat] },
                    properties: { itemId: item.id }
                });
            }
        }

        if (layer.spreadOverlapping) {
            spreadOverlapping(features);
        }

        const result: LayerFeatures = {
            items: layer.markers.items,
            latitude: layer.latitude,
            longitude: layer.longitude,
            spread: layer.spreadOverlapping,
            collection: { type: "FeatureCollection", features },
            itemsById
        };
        this.layerFeatures[layerIndex] = result;
        return result;
    }

    // Zooms in just far enough for the tapped cluster to break apart.
    private async zoomIntoCluster(layerIndex: number, cluster: Feature): Promise<void> {
        const source = this.sourceRefs[layerIndex];
        const clusterId = Number(cluster.properties?.cluster_id);

        if (!source || cluster.geometry.type !== "Point" || !Number.isFinite(clusterId)) {
            return;
        }

        try {
            const zoom = await source.getClusterExpansionZoom(clusterId);
            const [lng, lat] = cluster.geometry.coordinates;
            this.cameraRef.current?.easeTo({
                center: [lng, lat],
                zoom: Math.min(zoom, MAX_CLUSTER_ZOOM),
                duration: 500
            });
        } catch (error) {
            console.warn("Failed to expand map marker cluster:", error);
        }
    }

    private handleFeaturePress(layerIndex: number, features: Feature[], data: LayerFeatures): void {
        if (features[0]?.properties?.cluster) {
            this.zoomIntoCluster(layerIndex, features[0]);
            return;
        }

        const itemId = features[0]?.properties?.itemId;
        const item = typeof itemId === "string" ? data.itemsById[itemId] : undefined;

        if (item) {
            this.handleMarkerPress(layerIndex, item);
        }
    }

    private renderMarkerLayer(layer: MarkerLayersType, layerIndex: number, iconEntry?: ImageEntry): ReactNode {
        const data = this.getLayerFeatures(layer, layerIndex);
        const clustered = layer.cluster && this.state.clustering;
        // A native source can't switch clustering after creation, so each mode gets its own source id.
        const id = `mx-markers-${layerIndex}${clustered ? "-clustered" : ""}`;
        const markerFilter = clustered ? IS_NOT_CLUSTER : undefined;

        return (
            <GeoJSONSource
                key={id}
                id={id}
                ref={source => {
                    this.sourceRefs[layerIndex] = source;
                }}
                data={data.collection}
                cluster={clustered}
                clusterRadius={layer.clusterRadius}
                onPress={event => this.handleFeaturePress(layerIndex, event.nativeEvent.features, data)}
            >
                {clustered && (
                    <Layer
                        type="circle"
                        id={`${id}-clusters`}
                        filter={IS_CLUSTER}
                        paint={{
                            "circle-color": layer.clusterColor || "#1C7D77",
                            // Bubbles grow with the number of markers they hold.
                            "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 50, 26],
                            "circle-stroke-width": 2,
                            "circle-stroke-color": "#FFFFFF"
                        }}
                    />
                )}
                {clustered && (
                    <Layer
                        type="symbol"
                        id={`${id}-cluster-counts`}
                        filter={IS_CLUSTER}
                        layout={{
                            "text-field": ["get", "point_count_abbreviated"],
                            "text-font": [this.props.clusterFont],
                            "text-size": 13,
                            "text-allow-overlap": true,
                            "text-ignore-placement": true
                        }}
                        paint={{ "text-color": "#FFFFFF" }}
                    />
                )}
                {iconEntry ? (
                    <Layer
                        type="symbol"
                        id={`${id}-icons`}
                        filter={markerFilter}
                        layout={{
                            "icon-image": iconImageName(layerIndex),
                            "icon-size": toIconScale(iconEntry, layer.iconSize),
                            "icon-anchor": layer.iconAnchor,
                            // Show every marker, like the previous view-based markers did.
                            "icon-allow-overlap": true,
                            "icon-ignore-placement": true
                        }}
                    />
                ) : (
                    <Layer type="circle" id={`${id}-dots`} filter={markerFilter} paint={DEFAULT_MARKER_PAINT} />
                )}
            </GeoJSONSource>
        );
    }

    private renderMarkerLayers(): ReactNode {
        const iconEntries = this.props.layers.map(toImageEntry);
        const images: Record<string, ImageEntry> = {};

        iconEntries.forEach((entry, layerIndex) => {
            if (entry) {
                images[iconImageName(layerIndex)] = entry;
            }
        });

        return (
            <>
                {Object.keys(images).length > 0 && <Images images={images} />}
                {this.props.layers.map((layer, layerIndex) =>
                    this.renderMarkerLayer(layer, layerIndex, iconEntries[layerIndex])
                )}
            </>
        );
    }

    private renderPopup(): ReactNode {
        const { selected } = this.state;
        const layer = selected ? this.props.layers[selected.layerIndex] : undefined;
        const item = layer?.markers.items?.find(candidate => candidate.id === selected?.itemId);

        if (!layer || !hasPopup(layer) || !item || this.isClosedByApp()) {
            return null;
        }

        return (
            <Modal visible transparent animationType="fade" onRequestClose={this.closePopup}>
                <View style={styles.popupOverlay}>
                    {/* The backdrop is a sibling, not a parent, so it never competes with scrolling in the popup. */}
                    <Pressable
                        style={styles.popupBackdrop}
                        onPress={this.closePopup}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                    />
                    <View style={styles.annotationContainer}>
                        {layer.popupHeader && <View style={styles.popupHeader}>{layer.popupHeader.get(item)}</View>}
                        {layer.popupContent && (
                            <ScrollView
                                style={styles.popupScroll}
                                contentContainerStyle={styles.popupScrollContent}
                                bounces={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                {layer.popupContent.get(item)}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        );
    }

    private renderAttributionText(): ReactNode {
        const { text, position, showButton } = this.props.attribution;

        if (!text) {
            return null;
        }

        const inset = ORNAMENT_MARGIN + (showButton ? ATTRIBUTION_BUTTON_SPACE : 0);

        return (
            <View pointerEvents="none" style={[styles.attributionText, cornerPosition(position, inset)]}>
                <Text style={styles.attributionTextLabel} numberOfLines={2}>
                    {text}
                </Text>
            </View>
        );
    }

    render(): ReactNode {
        const { attribution } = this.props;

        return (
            <View style={styles.container}>
                <Map
                    style={styles.map}
                    touchPitch={false}
                    touchRotate={false}
                    mapStyle={this.props.mapStyle ?? "https://demotiles.maplibre.org/style.json"}
                    logo
                    logoPosition={{ bottom: 10, left: 10 }}
                    attribution={attribution.showButton}
                    attributionPosition={cornerPosition(attribution.position, ORNAMENT_MARGIN)}
                    tintColor={attribution.tintColor}
                >
                    <Camera ref={this.cameraRef} initialViewState={{ center: [-119.126, 34.3575], zoom: 5 }} />
                    {this.renderMarkerLayers()}
                </Map>
                {this.renderAttributionText()}
                {this.renderClusterToggle()}
                {this.props.onClose && (
                    // Full-page layouts have no header, so offset the button below the status bar / notch.
                    <SafeAreaInsetsContext.Consumer>
                        {insets => (
                            <Pressable
                                style={[
                                    styles.mapButton,
                                    { top: (insets?.top ?? 0) + 12, left: (insets?.left ?? 0) + 12 }
                                ]}
                                onPress={this.props.onClose}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Close"
                            >
                                <Text style={styles.closeButtonIcon}>✕</Text>
                            </Pressable>
                        )}
                    </SafeAreaInsetsContext.Consumer>
                )}
                {this.renderPopup()}
            </View>
        );
    }
}
