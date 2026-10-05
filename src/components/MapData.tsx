import { Component, ReactNode } from "react";
import { View, Text, Pressable, Modal, Image } from "react-native";
import { Map, Marker, Camera } from "@maplibre/maplibre-react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { mapDataStyles as styles } from "../ui/styles";

interface MapMarker {
    name: string;
    lat: number;
    lng: number;
    employer?: string;
    crop?: string;
    salary?: string;
    role?: string;
    iconUrl?: string;
    source?: string;
}

interface MapMarkerData {
    mapMarkers?: Array<Record<string, unknown>>;
}

// Accepts both the widget's own keys (lat, lng, name, ...) and Mendix export-mapping
// attribute names (Latitude, Longitude, Name, ...), with coordinates as number or string.
function toMapMarker(raw: Record<string, unknown>): MapMarker | null {
    const pick = (...keys: string[]): unknown => keys.map(key => raw[key]).find(value => value != null && value !== "");
    const text = (...keys: string[]): string | undefined => {
        const value = pick(...keys);
        return value === undefined ? undefined : String(value);
    };
    const lat = Number(pick("lat", "Latitude", "latitude"));
    const lng = Number(pick("lng", "Longitude", "longitude"));

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        return null;
    }

    return {
        name: text("name", "Name") ?? "",
        lat,
        lng,
        employer: text("employer", "Employer"),
        crop: text("crop", "Crop"),
        salary: text("salary", "Salary"),
        role: text("role", "Role"),
        iconUrl: text("iconUrl", "IconURL", "iconURL"),
        source: text("source", "Source")
    };
}

interface MapDataProps {
    mapMarkerDataJson: string;
    style?: any[];
    onClick?: () => void;
    onClose?: () => void;
    mapStyle?: string;
}

interface MapDataState {
    selectedMarkerIndex: number | null;
}

export class MapData extends Component<MapDataProps, MapDataState> {
    constructor(props: MapDataProps) {
        super(props);
        this.state = {
            selectedMarkerIndex: null
        };
    }

    private parseMapMarkerData(): MapMarker[] {
        try {
            const data: MapMarkerData = JSON.parse(this.props.mapMarkerDataJson);
            if (!Array.isArray(data.mapMarkers)) {
                return [];
            }
            return data.mapMarkers
                .map(raw => (raw && typeof raw === "object" ? toMapMarker(raw) : null))
                .filter((marker): marker is MapMarker => marker !== null);
        } catch (error) {
            console.warn("Failed to parse map marker data JSON:", error);
            return [];
        }
    }

    private handleMarkerPress = (index: number): void => {
        this.setState(prevState => ({
            selectedMarkerIndex: prevState.selectedMarkerIndex === index ? null : index
        }));
    };

    render(): ReactNode {
        const mapMarkers = this.parseMapMarkerData();
        const isEmptyData = mapMarkers.length === 0;
        const selectedMarker =
            this.state.selectedMarkerIndex !== null ? mapMarkers[this.state.selectedMarkerIndex] : null;

        return (
            <View style={styles.container}>
                <Map
                    style={styles.map}
                    touchPitch={false}
                    touchRotate={false}
                    mapStyle={this.props.mapStyle ?? "https://demotiles.maplibre.org/style.json"}
                    logo
                    logoPosition={{ bottom: 10, left: 10 }}
                >
                    <Camera initialViewState={{ center: [-119.126, 34.3575], zoom: 5 }} />
                    {!isEmptyData &&
                        mapMarkers.map((mapMarker, index) => (
                            <Marker key={`mapMarker-${index}`} lngLat={[mapMarker.lng, mapMarker.lat]}>
                                <Pressable onPress={() => this.handleMarkerPress(index)}>
                                    {mapMarker.iconUrl ? (
                                        <Image source={{ uri: mapMarker.iconUrl }} style={styles.markerIcon} />
                                    ) : (
                                        <View
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 12,
                                                backgroundColor: "#1C7D77",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: "#FFFFFF"
                                                }}
                                            />
                                        </View>
                                    )}
                                </Pressable>
                            </Marker>
                        ))}
                </Map>
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
                {selectedMarker && (
                    <Modal
                        visible={!!selectedMarker}
                        transparent
                        animationType="fade"
                        onRequestClose={() => this.setState({ selectedMarkerIndex: null })}
                    >
                        <Pressable
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)"
                            }}
                            onPress={() => this.setState({ selectedMarkerIndex: null })}
                        >
                            <View style={styles.annotationContainer}>
                                <Text style={styles.annotationTitle}>{selectedMarker.name}</Text>
                                {!!selectedMarker.employer && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Employer: </Text>
                                        {selectedMarker.employer}
                                    </Text>
                                )}
                                {!!selectedMarker.crop && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Crop: </Text>
                                        {selectedMarker.crop}
                                    </Text>
                                )}
                                {!!selectedMarker.salary && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Salary: </Text>
                                        {selectedMarker.salary}
                                    </Text>
                                )}
                                {!!selectedMarker.role && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Role: </Text>
                                        {selectedMarker.role}
                                    </Text>
                                )}
                                {!!selectedMarker.source && (
                                    <Text style={styles.annotationSource}>Source: {selectedMarker.source}</Text>
                                )}
                            </View>
                        </Pressable>
                    </Modal>
                )}
            </View>
        );
    }
}
