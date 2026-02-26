import { Component, ReactNode, createElement } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MapView, MarkerView, Camera } from "@maplibre/maplibre-react-native";

interface MapMarker {
    name: string;
    lat: number;
    lng: number;
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

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    markerContainer: {
        alignItems: "center"
    },
    markerLabel: {
        backgroundColor: "#1C7D77",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 4
    },
    markerText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold"
    }
});

export class MapData extends Component<MapDataProps> {
    private parseMapMarkerData(): MapMarker[] {
        try {
            const data: MapMarkerData = JSON.parse(this.props.mapMarkerDataJson);
            return data.mapMarkers || [];
        } catch (error) {
            console.warn("Failed to parse map marker data JSON:", error);
            return [];
        }
    }

    render(): ReactNode {
        const mapMarkers = this.parseMapMarkerData();
        const isEmptyData = mapMarkers.length === 0;

        return (
            <View style={styles.container}>
                <MapView style={styles.map} scrollEnabled pitchEnabled={false} rotateEnabled={false} mapStyle={this.props.mapStyle}>
                    <Camera centerCoordinate={[-119.126, 34.3575]} zoomLevel={7} />
                    {!isEmptyData &&
                        mapMarkers.map((mapMarker, index) => (
                            <MarkerView key={`mapMarker-${index}`} coordinate={[mapMarker.lng, mapMarker.lat]}>
                                <View style={styles.markerContainer}>
                                    <View style={styles.markerLabel}>
                                        <Text style={styles.markerText}>{mapMarker.name}</Text>
                                    </View>
                                    <View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 6,
                                            backgroundColor: "#1C7D77"
                                        }}
                                    />
                                </View>
                            </MarkerView>
                        ))}
                </MapView>
            </View>
        );
    }
}
