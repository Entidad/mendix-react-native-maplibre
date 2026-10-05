import { Component, ReactNode } from "react";
import { View, Text, Pressable, Modal, Image, ImageSourcePropType, ScrollView } from "react-native";
import { Map, Marker, Camera } from "@maplibre/maplibre-react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { EditableValue, ObjectItem } from "mendix";
import { Big } from "big.js";
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
// image resolves to a URI source. SVG markup (string) is not supported by <Image>.
function toImageSource(layer: MarkerLayersType): ImageSourcePropType | undefined {
    const image = layer.markerIcon?.status === "available" ? layer.markerIcon.value : undefined;
    return typeof image === "number" || (typeof image === "object" && image !== null) ? image : undefined;
}

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
}

function hasPopup(layer: MarkerLayersType): boolean {
    return !!(layer.popupHeader || layer.popupContent);
}

interface MapDataState {
    selected: SelectedMarker | null;
}

export class MapData extends Component<MapDataProps, MapDataState> {
    constructor(props: MapDataProps) {
        super(props);
        this.state = {
            selected: null
        };
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

    private renderLayerMarkers(layer: MarkerLayersType, layerIndex: number): ReactNode[] {
        const iconSource = toImageSource(layer);
        const iconStyle = { width: layer.iconSize, height: layer.iconSize };

        return (layer.markers.items ?? []).map(item => {
            const lat = toCoordinate(layer.latitude.get(item).value, 90);
            const lng = toCoordinate(layer.longitude.get(item).value, 180);

            if (lat === undefined || lng === undefined) {
                return null;
            }

            return (
                <Marker key={`${layerIndex}-${item.id}`} lngLat={[lng, lat]}>
                    <Pressable onPress={() => this.handleMarkerPress(layerIndex, item)}>
                        {iconSource ? (
                            <Image source={iconSource} style={[styles.markerIcon, iconStyle]} />
                        ) : (
                            <View style={styles.defaultMarker}>
                                <View style={styles.defaultMarkerDot} />
                            </View>
                        )}
                    </Pressable>
                </Marker>
            );
        });
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
                            <ScrollView style={styles.popupScroll} bounces={false} keyboardShouldPersistTaps="handled">
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
                    <Camera initialViewState={{ center: [-119.126, 34.3575], zoom: 5 }} />
                    {this.props.layers.flatMap((layer, layerIndex) => this.renderLayerMarkers(layer, layerIndex))}
                </Map>
                {this.renderAttributionText()}
                {this.props.onClose && (
                    // Full-page layouts have no header, so offset the button below the status bar / notch.
                    <SafeAreaInsetsContext.Consumer>
                        {insets => (
                            <Pressable
                                style={[
                                    styles.closeButton,
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
