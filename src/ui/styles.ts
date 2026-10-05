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
    defaultMarker: ViewStyle;
    defaultMarkerDot: ViewStyle;
    popupOverlay: ViewStyle;
    popupBackdrop: ViewStyle;
    annotationContainer: ViewStyle;
    popupHeader: ViewStyle;
    popupScroll: ViewStyle;
    attributionText: ViewStyle;
    attributionTextLabel: TextStyle;
    closeButton: ViewStyle;
    closeButtonIcon: TextStyle;
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
    defaultMarker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#1C7D77",
        justifyContent: "center",
        alignItems: "center"
    },
    defaultMarkerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FFFFFF"
    },
    popupOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    popupBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    annotationContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: "90%",
        maxWidth: 480,
        maxHeight: "85%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    popupHeader: {
        paddingBottom: 4
    },
    // Lets the scroll area shrink inside the height-capped card, so the header stays visible.
    popupScroll: {
        flexShrink: 1
    },
    attributionText: {
        position: "absolute",
        maxWidth: "70%",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2
    },
    attributionTextLabel: {
        fontSize: 10,
        color: "#333333"
    },
    closeButton: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    closeButtonIcon: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1C7D77"
    }
}) as MapDataStyle;
