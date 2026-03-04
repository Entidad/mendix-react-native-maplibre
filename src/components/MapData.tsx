import { Component, ReactNode, createElement } from "react";
import { View, Text, Pressable, Modal, Image } from "react-native";
import { MapView, MarkerView, Camera } from "@maplibre/maplibre-react-native";
import { mapDataStyles as styles } from "../ui/styles";

interface MapMarker {
    name: string;
    lat: number;
    lng: number;
    crop?: string;
    salary?: string;
    role?: string;
    iconUrl?: string;
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
                <MapView style={styles.map} scrollEnabled pitchEnabled={false} rotateEnabled={false} mapStyle={this.props.mapStyle} logoEnabled logoPosition={{ bottom: 10, left: 10 }}>
                    <Camera centerCoordinate={[-119.126, 34.3575]} zoomLevel={5} />
                    {!isEmptyData &&
                        mapMarkers.map((mapMarker, index) => (
                            <MarkerView key={`mapMarker-${index}`} coordinate={[mapMarker.lng, mapMarker.lat]}>
                                <Pressable onPress={() => this.handleMarkerPress(index)}>
                                    {mapMarker.iconUrl ? (
                                        <Image source={{ uri: mapMarker.iconUrl }} style={styles.markerIcon} />
                                    ) : (
                                        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#1C7D77", justifyContent: "center", alignItems: "center" }}>
                                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FFFFFF" }} />
                                        </View>
                                    )}
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
