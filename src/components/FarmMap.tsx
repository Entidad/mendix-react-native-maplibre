import { Component, ReactNode, createElement } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MapView, MarkerView } from "@maplibre/maplibre-react-native";

interface Farm {
    name: string;
    lat: number;
    lng: number;
}

interface FarmData {
    farms?: Farm[];
}

interface FarmMapProps {
    farmDataJson: string;
    style?: any[];
    onClick?: () => void;
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
        backgroundColor: "#D9534F",
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

export class FarmMap extends Component<FarmMapProps> {
    private parseFarmData(): Farm[] {
        try {
            const data: FarmData = JSON.parse(this.props.farmDataJson);
            return data.farms || [];
        } catch (error) {
            console.warn("Failed to parse farm data JSON:", error);
            return [];
        }
    }

    render(): ReactNode {
        const farms = this.parseFarmData();
        const isEmptyData = farms.length === 0;

        return (
            <View style={styles.container}>
                <MapView style={styles.map} scrollEnabled pitchEnabled={false} rotateEnabled={false}>
                    {!isEmptyData &&
                        farms.map((farm, index) => (
                            <MarkerView key={`farm-${index}`} coordinate={[farm.lng, farm.lat]}>
                                <View style={styles.markerContainer}>
                                    <View style={styles.markerLabel}>
                                        <Text style={styles.markerText}>{farm.name}</Text>
                                    </View>
                                    <View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 6,
                                            backgroundColor: "#D9534F"
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
