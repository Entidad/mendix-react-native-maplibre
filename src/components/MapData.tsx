import { Component, ReactNode, createElement } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { MapView, MarkerView, Camera } from "@maplibre/maplibre-react-native";

interface MapMarker {
    name: string;
    lat: number;
    lng: number;
    crop?: string;
    salary?: string;
    role?: string;
}

interface MapMarkerData {
    mapMarkers?: MapMarker[];
}

interface MapDataProps {
    mapMarkerDataJson: string;
    style?: any[];
    onClick?: () => void;
    mapStyle?: string;
}

interface MapDataState {
    selectedMarkerIndex: number | null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    markerIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#1C7D77",
        justifyContent: "center",
        alignItems: "center"
    },
    markerIconInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FFFFFF"
    },
    annotationContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 150,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    annotationTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1C7D77",
        marginBottom: 8
    },
    annotationItem: {
        fontSize: 12,
        color: "#333333",
        marginBottom: 4
    },
    annotationLabel: {
        fontWeight: "600",
        color: "#1C7D77"
    }
});

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
            return data.mapMarkers || [];
        } catch (error) {
            console.warn("Failed to parse map marker data JSON:", error);
            return [];
        }
    }

    private handleMarkerPress = (index: number) => {
        this.setState({ selectedMarkerIndex: this.state.selectedMarkerIndex === index ? null : index });
    };

    render(): ReactNode {
        const mapMarkers = this.parseMapMarkerData();
        const isEmptyData = mapMarkers.length === 0;
        const selectedMarker = this.state.selectedMarkerIndex !== null ? mapMarkers[this.state.selectedMarkerIndex] : null;

        return (
            <View style={styles.container}>
                <MapView style={styles.map} scrollEnabled pitchEnabled={false} rotateEnabled={false} mapStyle={this.props.mapStyle}>
                    <Camera centerCoordinate={[-119.126, 34.3575]} zoomLevel={7} />
                    {!isEmptyData &&
                        mapMarkers.map((mapMarker, index) => (
                            <MarkerView key={`mapMarker-${index}`} coordinate={[mapMarker.lng, mapMarker.lat]}>
                                <Pressable onPress={() => this.handleMarkerPress(index)}>
                                    <View style={styles.markerIcon}>
                                        <View style={styles.markerIconInner} />
                                    </View>
                                </Pressable>
                            </MarkerView>
                        ))}
                </MapView>
                {selectedMarker && (
                    <Modal
                        visible={!!selectedMarker}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => this.setState({ selectedMarkerIndex: null })}
                    >
                        <Pressable
                            style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                            onPress={() => this.setState({ selectedMarkerIndex: null })}
                        >
                            <View style={styles.annotationContainer}>
                                <Text style={styles.annotationTitle}>{selectedMarker.name}</Text>
                                {selectedMarker.crop && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Crop: </Text>
                                        {selectedMarker.crop}
                                    </Text>
                                )}
                                {selectedMarker.salary && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Salary: </Text>
                                        {selectedMarker.salary}
                                    </Text>
                                )}
                                {selectedMarker.role && (
                                    <Text style={styles.annotationItem}>
                                        <Text style={styles.annotationLabel}>Role: </Text>
                                        {selectedMarker.role}
                                    </Text>
                                )}
                            </View>
                        </Pressable>
                    </Modal>
                )}
            </View>
        );
    }
}
