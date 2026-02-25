import { Component, createElement } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MapView, MarkerView } from '@maplibre/maplibre-react-native';

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
class FarmMap extends Component {
    parseFarmData() {
        try {
            const data = JSON.parse(this.props.farmDataJson);
            return data.farms || [];
        }
        catch (error) {
            console.warn("Failed to parse farm data JSON:", error);
            return [];
        }
    }
    render() {
        const farms = this.parseFarmData();
        const isEmptyData = farms.length === 0;
        return (createElement(View, { style: styles.container },
            createElement(MapView, { style: styles.map, scrollEnabled: true, pitchEnabled: false, rotateEnabled: false }, !isEmptyData &&
                farms.map((farm, index) => (createElement(MarkerView, { key: `farm-${index}`, coordinate: [farm.lng, farm.lat] },
                    createElement(View, { style: styles.markerContainer },
                        createElement(View, { style: styles.markerLabel },
                            createElement(Text, { style: styles.markerText }, farm.name)),
                        createElement(View, { style: {
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: "#D9534F"
                            } }))))))));
    }
}

class MapLibre extends Component {
    onClickHandler = this.onClick.bind(this);
    render() {
        const jsonData = this.props.value?.displayValue || "{}";
        return createElement(FarmMap, { style: this.props.style, onClick: this.onClickHandler, farmDataJson: jsonData });
    }
    onClick() {
        const { onClick } = this.props;
        if (onClick && onClick.canExecute && !onClick.isExecuting) {
            onClick.execute();
        }
    }
}

export { MapLibre };
