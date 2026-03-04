import { TextStyle, ViewStyle, ImageStyle, StyleSheet } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";

export interface BadgeStyle extends Style {
    container: ViewStyle;
    badge: ViewStyle;
    label: TextStyle;
}

export interface MapDataStyle {
    container: ViewStyle;
    map: ViewStyle;
    markerIcon: ImageStyle;
    annotationContainer: ViewStyle;
    annotationTitle: TextStyle;
    annotationItem: TextStyle;
    annotationLabel: TextStyle;
}

export const defaultBadgeStyle: BadgeStyle = {
    container: {
        flexDirection: "row",
        borderRadius: 30,
        overflow: "hidden"
    },
    badge: {
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "#D9534F",
        overflow: "hidden"
    },
    label: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
        color: "#FFFFFF"
    }
};

export const mapDataStyles: MapDataStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    markerIcon: {
        width: 32,
        height: 32,
        resizeMode: "contain"
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
}) as MapDataStyle;
