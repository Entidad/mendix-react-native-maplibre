import { Component, ReactElement, ReactNode, createRef } from "react";
import {
    View,
    Text,
    Pressable,
    Modal,
    Image,
    ScrollView,
    ActivityIndicator,
    Keyboard,
    ImageSourcePropType
} from "react-native";
import {
    Map,
    Camera,
    CameraRef,
    InitialViewState,
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
import { Legend, LegendEntry } from "./Legend";
import { SearchPanel, SearchResult } from "./SearchPanel";
import { ClusterIcon, LegendIcon, LocationIcon, ScatterIcon, SearchIcon } from "./MapIcons";
import { mapDataStyles as styles } from "../ui/styles";

interface SelectedMarker {
    layerIndex: number;
    itemId: string;
}

type LngLatPair = [number, number];

// Coordinates may come from Decimal (Big), Integer/Long (Big) or String attributes.
export function toCoordinate(value: Big | string | undefined, limit: number): number | undefined {
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

// The same icon as an Image source, for the legend.
function toLegendIcon(layer: MarkerLayersType): ImageSourcePropType | undefined {
    const image = layer.markerIcon?.status === "available" ? layer.markerIcon.value : undefined;
    return typeof image === "number" || (typeof image === "object" && image !== null) ? image : undefined;
}

// Case- and accent-insensitive, so "sao" finds "São Paulo".
function normalizeText(text: string): string {
    let result = text;
    try {
        result = result.normalize("NFD").replace(/[̀-ͯ]/g, "");
    } catch {
        // Engines without Unicode normalization still get case-insensitive matching.
    }
    return result.toLowerCase();
}

function toSearchTerms(query: string): string[] {
    return normalizeText(query).split(/\s+/).filter(Boolean);
}

// Every term must appear somewhere in the text, in any order.
function matchesTerms(text: string | undefined, terms: string[]): boolean {
    if (!text) {
        return false;
    }
    const normalized = normalizeText(text);
    return terms.every(term => normalized.includes(term));
}

function sameCoordinate(a?: LngLatPair, b?: LngLatPair): boolean {
    return a?.[0] === b?.[0] && a?.[1] === b?.[1];
}

export function clampZoom(zoom: number): number {
    return Math.min(Math.max(zoom, 0), 22);
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
    searchText: MarkerLayersType["searchText"];
    collection: FeatureCollection<Point>;
    itemsById: Record<string, ObjectItem>;
    // Only set for searchable layers.
    searchTextById?: Record<string, string | undefined>;
}

interface FilteredFeatures {
    source: LayerFeatures;
    query: string;
    collection: FeatureCollection<Point>;
}

const METERS_PER_DEGREE_LAT = 111320;
// Spacing between markers spread out from a shared coordinate; they separate around zoom 15.
const SPREAD_METERS = 90;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
// Never zoom into a cluster further than street level, where many styles have no more detail.
const MAX_CLUSTER_ZOOM = 16;
// Zoom for a single search result; past the default cluster max zoom (14), so it's never hidden in a bubble.
const RESULT_ZOOM = 16;
const SEARCH_DEBOUNCE_MS = 250;
const BUTTON_SIZE = 40;
const BUTTON_MARGIN = 12;
// Matches the search bar's height in the stylesheet.
const SEARCH_BAR_HEIGHT = 44;

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

const USER_LOCATION_SOURCE = "mx-user-location";
const USER_LOCATION_COLOR = "#2578FF";

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

// The location button runs an app action (e.g. a nanoflow calling GetCurrentLocationMinimumAccuracy)
// that writes the position to the context object; the widget only centers on what it's given.
export interface LocationOptions {
    onPress?: () => void;
    executing: boolean;
    ready: boolean;
    coordinate?: LngLatPair;
    zoom: number;
}

export interface LegendOptions {
    title: string;
    // Widgets from Studio Pro for a custom legend, shown like the marker popup.
    header?: ReactNode;
    content?: ReactNode;
    visible?: EditableValue<boolean>;
    initiallyOpen: boolean;
    showCounts: boolean;
    toggleLayers: boolean;
}

function hasCustomLegend(legend: LegendOptions): boolean {
    return !!(legend.header || legend.content);
}

export interface SearchOptions {
    placeholder: string;
    noResults: string;
}

interface MapDataProps {
    layers: MarkerLayersType[];
    onClose?: () => void;
    mapStyle?: string;
    // Where the map opens when the app provides no location.
    defaultView: { center: LngLatPair; zoom: number };
    popupVisible?: EditableValue<boolean>;
    attribution: AttributionOptions;
    clusterFont: string;
    showClusterToggle: boolean;
    // Icon color of the close button and map controls.
    buttonColor: string;
    location: LocationOptions;
    legend?: LegendOptions;
    search?: SearchOptions;
}

function hasPopup(layer: MarkerLayersType): boolean {
    return !!(layer.popupHeader || layer.popupContent);
}

// Mirrors a popup's state into its optional "visible" attribute, so the app can close it.
function setVisibleAttribute(attribute: EditableValue<boolean> | undefined, visible: boolean): void {
    if (attribute?.status === "available" && !attribute.readOnly && attribute.value !== visible) {
        attribute.setValue(visible);
    }
}

// The app closed a popup by setting its attribute to false.
function isClosedByApp(attribute: EditableValue<boolean> | undefined): boolean {
    // A read-only attribute can't be set to true on open, so it must not keep the popup hidden.
    return attribute?.status === "available" && !attribute.readOnly && attribute.value === false;
}

interface MapDataState {
    selected: SelectedMarker | null;
    // Session toggle for layers with "Cluster markers" on; off shows every marker.
    clustering: boolean;
    legendOpen: boolean;
    hiddenLayers: number[];
    searchOpen: boolean;
    // What's typed, and the debounced query the map is filtered by.
    searchInput: string;
    searchQuery: string;
    searchResultsVisible: boolean;
}

export class MapData extends Component<MapDataProps, MapDataState> {
    private readonly layerFeatures: Array<LayerFeatures | undefined> = [];
    private readonly filteredFeatures: Array<FilteredFeatures | undefined> = [];
    private readonly cameraRef = createRef<CameraRef>();
    private readonly sourceRefs: Array<GeoJSONSourceRef | null> = [];
    private searchTimer: ReturnType<typeof setTimeout> | undefined;
    private userLocation: Point | undefined;
    private initialViewState: InitialViewState | undefined;
    // Set by a location tap, so a finished action re-centers even when the position didn't change.
    private locationRequested = false;
    private locationActionStarted = false;
    // A custom legend opened on start sets "Legend visible" once the attribute has loaded.
    private legendVisiblePending: boolean;

    constructor(props: MapDataProps) {
        super(props);
        this.state = {
            selected: null,
            clustering: true,
            legendOpen: !!props.legend?.initiallyOpen,
            hiddenLayers: [],
            searchOpen: false,
            searchInput: "",
            searchQuery: "",
            searchResultsVisible: true
        };
        this.legendVisiblePending = !!props.legend?.initiallyOpen && hasCustomLegend(props.legend);
    }

    componentDidMount(): void {
        this.syncInitialLegendVisible();
        this.syncMarkerCounts();
    }

    // Hidden by the layer's "Visible" expression or from the generated legend.
    private isLayerHidden(layerIndex: number): boolean {
        const { visible } = this.props.layers[layerIndex];
        // Hidden while the expression loads, so a layer the user switched off doesn't flash on.
        const shownByApp = !visible || (visible.status === "available" ? visible.value !== false : false);
        return !shownByApp || this.state.hiddenLayers.includes(layerIndex);
    }

    // Writes each layer's marker count to its optional "Marker count" attribute, for custom legends.
    // Counts include hidden layers, so a legend can show how many markers switching one on adds.
    private syncMarkerCounts(): void {
        this.props.layers.forEach((layer, layerIndex) => {
            const { markerCount } = layer;

            if (
                markerCount?.status !== "available" ||
                markerCount.readOnly ||
                // Don't report 0 before the markers have loaded.
                layer.markers.status !== "available"
            ) {
                return;
            }

            const count = this.getVisibleFeatures(layer, layerIndex).features.length;
            if (!markerCount.value?.eq(count)) {
                markerCount.setValue(new Big(count));
            }
        });
    }

    // Otherwise a "Legend visible" attribute that defaults to false would hide the legend right away.
    private syncInitialLegendVisible(): void {
        const visible = this.props.legend?.visible;

        if (this.legendVisiblePending && visible?.status !== "loading") {
            this.legendVisiblePending = false;
            setVisibleAttribute(visible, true);
        }
    }

    componentDidUpdate(prevProps: MapDataProps): void {
        this.syncInitialLegendVisible();
        this.syncMarkerCounts();

        const { location } = this.props;
        const previous = prevProps.location;

        // The app set a new location, e.g. from the location action or a page-load nanoflow.
        // Values that were already there when the page loaded don't move the map.
        if (location.coordinate && previous.ready && !sameCoordinate(location.coordinate, previous.coordinate)) {
            this.locationRequested = false;
            this.centerOnLocation();
            return;
        }

        if (this.locationRequested) {
            if (location.executing) {
                this.locationActionStarted = true;
            } else if (this.locationActionStarted) {
                // The action finished without changing the location: the user panned away and tapped again.
                this.locationRequested = false;
                this.centerOnLocation();
            }
        }
    }

    componentWillUnmount(): void {
        clearTimeout(this.searchTimer);
    }

    private centerOnLocation(): void {
        const { coordinate, zoom } = this.props.location;

        if (coordinate) {
            this.cameraRef.current?.flyTo({ center: coordinate, zoom: clampZoom(zoom), duration: 1000 });
        }
    }

    private readonly requestLocation = (): void => {
        const { onPress, executing } = this.props.location;

        if (onPress && !executing) {
            this.locationRequested = true;
            this.locationActionStarted = false;
            onPress();
        }
    };

    private readonly toggleClustering = (): void => {
        this.setState(prevState => ({ clustering: !prevState.clustering }));
    };

    private readonly toggleLegend = (): void => {
        const { legend } = this.props;

        // The search results and keyboard would cover the legend.
        Keyboard.dismiss();
        this.setState({ searchResultsVisible: false });

        // The custom legend covers its button, so the button only ever opens it.
        if (legend && hasCustomLegend(legend)) {
            this.setState({ legendOpen: true });
            setVisibleAttribute(legend.visible, true);
        } else {
            this.setState(prevState => ({ legendOpen: !prevState.legendOpen }));
        }
    };

    private readonly closeLegend = (): void => {
        this.setState({ legendOpen: false });
        setVisibleAttribute(this.props.legend?.visible, false);
    };

    private readonly toggleLayer = (layerIndex: number): void => {
        if (!this.props.legend?.toggleLayers) {
            return;
        }
        this.setState(prevState => ({
            hiddenLayers: prevState.hiddenLayers.includes(layerIndex)
                ? prevState.hiddenLayers.filter(index => index !== layerIndex)
                : [...prevState.hiddenLayers, layerIndex]
        }));
    };

    private readonly openSearch = (): void => {
        this.setState({ searchOpen: true, searchResultsVisible: true });
        this.closeLegend();
    };

    private readonly closeSearch = (): void => {
        clearTimeout(this.searchTimer);
        Keyboard.dismiss();
        this.setState({ searchOpen: false, searchInput: "", searchQuery: "", searchResultsVisible: true });
    };

    // Filtering resends marker data to the native map, so wait until typing pauses.
    private readonly changeSearchText = (text: string): void => {
        clearTimeout(this.searchTimer);
        this.setState({ searchInput: text, searchResultsVisible: true });
        this.searchTimer = setTimeout(() => this.setState({ searchQuery: text }), SEARCH_DEBOUNCE_MS);
    };

    // Back in the search field: the result list takes the legend's place below the bar.
    private readonly showSearchResults = (): void => {
        this.setState({ searchResultsVisible: true });
        this.closeLegend();
    };

    // The search key shows every match on the map.
    private readonly submitSearch = (): void => {
        clearTimeout(this.searchTimer);
        this.setState(
            prevState => ({ searchQuery: prevState.searchInput, searchResultsVisible: false }),
            () => this.fitToResults(this.getSearchResults())
        );
    };

    private readonly selectSearchResult = (result: SearchResult): void => {
        Keyboard.dismiss();
        this.setState({ searchResultsVisible: false });
        this.cameraRef.current?.flyTo({ center: result.coordinates, zoom: RESULT_ZOOM, duration: 800 });

        const item = this.layerFeatures[result.layerIndex]?.itemsById[result.itemId];
        if (item) {
            this.handleMarkerPress(result.layerIndex, item);
        }
    };

    private fitToResults(results: SearchResult[]): void {
        if (results.length === 0) {
            return;
        }

        const lngs = results.map(result => result.coordinates[0]);
        const lats = results.map(result => result.coordinates[1]);
        const [west, east] = [Math.min(...lngs), Math.max(...lngs)];
        const [south, north] = [Math.min(...lats), Math.max(...lats)];

        if (west === east && south === north) {
            this.cameraRef.current?.flyTo({ center: [west, south], zoom: RESULT_ZOOM, duration: 800 });
        } else {
            this.cameraRef.current?.fitBounds([west, south, east, north], {
                // Keeps markers clear of the search bar and the logo.
                padding: { top: 120, right: 48, bottom: 64, left: 48 },
                duration: 800
            });
        }
    }

    private handleMarkerPress(layerIndex: number, item: ObjectItem): void {
        const layer = this.props.layers[layerIndex];
        const action = layer.onMarkerClick?.get(item);

        if (action?.canExecute && !action.isExecuting) {
            action.execute();
        }
        if (hasPopup(layer)) {
            this.setState({ selected: { layerIndex, itemId: item.id } });
            setVisibleAttribute(this.props.popupVisible, true);
        }
    }

    private readonly closePopup = (): void => {
        this.setState({ selected: null });
        setVisibleAttribute(this.props.popupVisible, false);
    };

    // Rebuilds a layer's GeoJSON only when its data changes, so opening a popup doesn't
    // resend every marker to the native map.
    private getLayerFeatures(layer: MarkerLayersType, layerIndex: number): LayerFeatures {
        const cached = this.layerFeatures[layerIndex];
        if (
            cached &&
            cached.items === layer.markers.items &&
            cached.latitude === layer.latitude &&
            cached.longitude === layer.longitude &&
            cached.spread === layer.spreadOverlapping &&
            cached.searchText === layer.searchText
        ) {
            return cached;
        }

        const features: Array<Feature<Point>> = [];
        const itemsById: Record<string, ObjectItem> = {};
        const searchTextById: Record<string, string | undefined> | undefined = layer.searchText ? {} : undefined;

        for (const item of layer.markers.items ?? []) {
            const lat = toCoordinate(layer.latitude.get(item).value, 90);
            const lng = toCoordinate(layer.longitude.get(item).value, 180);

            if (lat !== undefined && lng !== undefined) {
                itemsById[item.id] = item;
                if (searchTextById && layer.searchText) {
                    searchTextById[item.id] = layer.searchText.get(item).value;
                }
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
            searchText: layer.searchText,
            collection: { type: "FeatureCollection", features },
            itemsById,
            searchTextById
        };
        this.layerFeatures[layerIndex] = result;
        return result;
    }

    // The markers a layer shows: all of them, or only the search matches of a searchable layer.
    // The data itself is filtered (not a layer filter), so cluster counts only include matches.
    private getVisibleFeatures(layer: MarkerLayersType, layerIndex: number): FeatureCollection<Point> {
        const data = this.getLayerFeatures(layer, layerIndex);
        const { searchTextById } = data;
        const query = this.state.searchQuery;
        const terms = toSearchTerms(query);

        if (!searchTextById || terms.length === 0) {
            return data.collection;
        }

        const cached = this.filteredFeatures[layerIndex];
        if (cached && cached.source === data && cached.query === query) {
            return cached.collection;
        }

        const features = data.collection.features.filter(feature =>
            matchesTerms(searchTextById[feature.properties?.itemId], terms)
        );
        const collection: FeatureCollection<Point> = { type: "FeatureCollection", features };
        this.filteredFeatures[layerIndex] = { source: data, query, collection };
        return collection;
    }

    private getSearchResults(): SearchResult[] {
        if (toSearchTerms(this.state.searchQuery).length === 0) {
            return [];
        }

        const results: SearchResult[] = [];

        this.props.layers.forEach((layer, layerIndex) => {
            if (!layer.searchText || this.isLayerHidden(layerIndex)) {
                return;
            }
            const { searchTextById } = this.getLayerFeatures(layer, layerIndex);
            const layerLabel = layer.legendLabel?.value || undefined;

            for (const feature of this.getVisibleFeatures(layer, layerIndex).features) {
                const itemId = String(feature.properties?.itemId);
                results.push({
                    key: `${layerIndex}-${itemId}`,
                    layerIndex,
                    itemId,
                    label: searchTextById?.[itemId] ?? "",
                    layerLabel,
                    // Spread markers are found where they're drawn, not at their shared coordinate.
                    coordinates: feature.geometry.coordinates as LngLatPair
                });
            }
        });

        return results.sort((a, b) => a.label.localeCompare(b.label));
    }

    private getLegendEntries(): LegendEntry[] {
        const entries: LegendEntry[] = [];

        this.props.layers.forEach((layer, layerIndex) => {
            const label = layer.legendLabel?.value;
            if (label) {
                entries.push({
                    layerIndex,
                    label,
                    icon: toLegendIcon(layer),
                    count: this.getVisibleFeatures(layer, layerIndex).features.length,
                    hidden: this.isLayerHidden(layerIndex)
                });
            }
        });

        return entries;
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
                data={this.getVisibleFeatures(layer, layerIndex)}
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
                    this.isLayerHidden(layerIndex)
                        ? null
                        : this.renderMarkerLayer(layer, layerIndex, iconEntries[layerIndex])
                )}
            </>
        );
    }

    // A "you are here" dot at the location the app provided, drawn above the markers.
    private renderUserLocation(): ReactNode {
        const { coordinate } = this.props.location;

        if (!coordinate) {
            return null;
        }
        // A new object resends the data to the native map, so only replace it when the location moves.
        if (!this.userLocation || !sameCoordinate(this.userLocation.coordinates as LngLatPair, coordinate)) {
            this.userLocation = { type: "Point", coordinates: coordinate };
        }

        return (
            <GeoJSONSource id={USER_LOCATION_SOURCE} data={this.userLocation}>
                <Layer
                    type="circle"
                    id={`${USER_LOCATION_SOURCE}-halo`}
                    paint={{ "circle-radius": 16, "circle-color": USER_LOCATION_COLOR, "circle-opacity": 0.2 }}
                />
                <Layer
                    type="circle"
                    id={`${USER_LOCATION_SOURCE}-dot`}
                    paint={{
                        "circle-radius": 7,
                        "circle-color": USER_LOCATION_COLOR,
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#FFFFFF"
                    }}
                />
            </GeoJSONSource>
        );
    }

    private renderMapButton(key: string, label: string, onPress: () => void, icon: ReactNode): ReactElement {
        return (
            <Pressable
                key={key}
                style={styles.mapButton}
                onPress={onPress}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={label}
            >
                {icon}
            </Pressable>
        );
    }

    // The search bar, or the button column down the right edge with the legend beside it.
    private renderControls(): ReactNode {
        const { layers, legend, search, location, showClusterToggle, buttonColor } = this.props;
        const { clustering, legendOpen, searchOpen } = this.state;
        const customLegend = !!legend && hasCustomLegend(legend);
        // The generated legend is only used when no custom legend is designed.
        const legendEntries = legend && !customLegend ? this.getLegendEntries() : [];
        const buttons: ReactElement[] = [];

        // While searching, the search bar takes the search button's place.
        if (search && !searchOpen && layers.some(layer => layer.searchText)) {
            buttons.push(
                this.renderMapButton("search", "Search markers", this.openSearch, <SearchIcon color={buttonColor} />)
            );
        }
        if (customLegend || legendEntries.length > 0) {
            buttons.push(
                this.renderMapButton("legend", "Legend", this.toggleLegend, <LegendIcon color={buttonColor} />)
            );
        }
        if (showClusterToggle && layers.some(layer => layer.cluster)) {
            // The icon shows what tapping does: scattered dots ungroup, one bubble groups.
            buttons.push(
                this.renderMapButton(
                    "cluster",
                    clustering ? "Show all markers" : "Group markers",
                    this.toggleClustering,
                    clustering ? <ScatterIcon color={buttonColor} /> : <ClusterIcon color={buttonColor} />
                )
            );
        }
        if (location.onPress) {
            buttons.push(
                this.renderMapButton(
                    "location",
                    "Show my location",
                    this.requestLocation,
                    location.executing ? (
                        <ActivityIndicator size="small" color={buttonColor} />
                    ) : (
                        <LocationIcon color={buttonColor} />
                    )
                )
            );
        }

        return (
            // Full-page layouts have no header, so keep controls below the status bar / notch.
            <SafeAreaInsetsContext.Consumer>
                {insets => {
                    const top = (insets?.top ?? 0) + BUTTON_MARGIN;
                    const right = (insets?.right ?? 0) + BUTTON_MARGIN;
                    const left = (insets?.left ?? 0) + BUTTON_MARGIN;

                    const searching = searchOpen && !!search;
                    const sideOffset = BUTTON_SIZE + 8;

                    return (
                        <>
                            {searching && (
                                <SearchPanel
                                    // Sits between the close button and the button column, leaving both uncovered.
                                    style={{
                                        top,
                                        left: left + (this.props.onClose ? sideOffset : 0),
                                        right: right + (buttons.length > 0 ? sideOffset : 0)
                                    }}
                                    value={this.state.searchInput}
                                    placeholder={search.placeholder}
                                    noResults={search.noResults}
                                    results={this.getSearchResults()}
                                    showResults={this.state.searchResultsVisible}
                                    onChangeText={this.changeSearchText}
                                    onFocus={this.showSearchResults}
                                    onSubmit={this.submitSearch}
                                    onClose={this.closeSearch}
                                    onSelect={this.selectSearchResult}
                                    buttonColor={buttonColor}
                                />
                            )}
                            {buttons.length > 0 && (
                                <View pointerEvents="box-none" style={[styles.buttonColumn, { top, right }]}>
                                    {buttons}
                                </View>
                            )}
                            {legend && legendOpen && legendEntries.length > 0 && (
                                <Legend
                                    // Below the search bar while searching, beside the buttons otherwise.
                                    style={{
                                        top: searching ? top + SEARCH_BAR_HEIGHT + 8 : top,
                                        right: right + sideOffset
                                    }}
                                    title={legend.title}
                                    entries={legendEntries}
                                    showCounts={legend.showCounts}
                                    toggleLayers={legend.toggleLayers}
                                    onToggleLayer={this.toggleLayer}
                                />
                            )}
                        </>
                    );
                }}
            </SafeAreaInsetsContext.Consumer>
        );
    }

    // A card over the dimmed map with a pinned header and scrolling content, designed in Studio Pro.
    private renderPopupCard(onClose: () => void, header: ReactNode, content: ReactNode): ReactNode {
        return (
            <Modal visible transparent animationType="fade" onRequestClose={onClose}>
                <View style={styles.popupOverlay}>
                    {/* The backdrop is a sibling, not a parent, so it never competes with scrolling in the popup. */}
                    <Pressable
                        style={styles.popupBackdrop}
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                    />
                    <View style={styles.annotationContainer}>
                        {header && <View style={styles.popupHeader}>{header}</View>}
                        {content && (
                            <ScrollView
                                style={styles.popupScroll}
                                contentContainerStyle={styles.popupScrollContent}
                                bounces={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                {content}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        );
    }

    private renderPopup(): ReactNode {
        const { selected } = this.state;
        const layer = selected ? this.props.layers[selected.layerIndex] : undefined;
        const item = layer?.markers.items?.find(candidate => candidate.id === selected?.itemId);

        if (!layer || !hasPopup(layer) || !item || isClosedByApp(this.props.popupVisible)) {
            return null;
        }

        return this.renderPopupCard(this.closePopup, layer.popupHeader?.get(item), layer.popupContent?.get(item));
    }

    private renderCustomLegend(): ReactNode {
        const { legend } = this.props;

        if (!legend || !hasCustomLegend(legend) || !this.state.legendOpen || isClosedByApp(legend.visible)) {
            return null;
        }

        return this.renderPopupCard(this.closeLegend, legend.header, legend.content);
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

    // Where the map opens: the app's location when it's known, otherwise the default view.
    // Fixed at first render, as the camera only reads its initial view state once.
    private getInitialViewState(): InitialViewState {
        if (!this.initialViewState) {
            const { coordinate, zoom } = this.props.location;
            this.initialViewState = coordinate
                ? { center: coordinate, zoom: clampZoom(zoom) }
                : { center: this.props.defaultView.center, zoom: this.props.defaultView.zoom };
        }
        return this.initialViewState;
    }

    render(): ReactNode {
        const { attribution } = this.props;

        // Wait for the context object, so a stored location doesn't load after the map opened elsewhere.
        if (!this.initialViewState && !this.props.location.ready) {
            return <View style={styles.container} />;
        }

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
                    <Camera ref={this.cameraRef} initialViewState={this.getInitialViewState()} />
                    {this.renderMarkerLayers()}
                    {this.renderUserLocation()}
                </Map>
                {this.renderAttributionText()}
                {this.renderControls()}
                {this.props.onClose && (
                    // Full-page layouts have no header, so offset the button below the status bar / notch.
                    <SafeAreaInsetsContext.Consumer>
                        {insets => (
                            <Pressable
                                style={[
                                    styles.mapButton,
                                    styles.floating,
                                    {
                                        top: (insets?.top ?? 0) + BUTTON_MARGIN,
                                        left: (insets?.left ?? 0) + BUTTON_MARGIN
                                    }
                                ]}
                                onPress={this.props.onClose}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Close"
                            >
                                <Text style={[styles.closeButtonIcon, { color: this.props.buttonColor }]}>✕</Text>
                            </Pressable>
                        )}
                    </SafeAreaInsetsContext.Consumer>
                )}
                {this.renderPopup()}
                {this.renderCustomLegend()}
            </View>
        );
    }
}
