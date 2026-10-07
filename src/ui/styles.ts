import { TextStyle, ViewStyle, StyleSheet } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";

export interface BadgeStyle extends Style {
    container: ViewStyle;
    badge: ViewStyle;
    label: TextStyle;
}

export interface MapDataStyle {
    container: ViewStyle;
    map: ViewStyle;
    popupOverlay: ViewStyle;
    popupBackdrop: ViewStyle;
    annotationContainer: ViewStyle;
    popupHeader: ViewStyle;
    popupScroll: ViewStyle;
    popupScrollContent: ViewStyle;
    attributionText: ViewStyle;
    attributionTextLabel: TextStyle;
    mapButton: ViewStyle;
    closeButtonIcon: TextStyle;
    scatterIcon: ViewStyle;
    scatterDot: ViewStyle;
    scatterDotTop: ViewStyle;
    scatterDotLeft: ViewStyle;
    scatterDotRight: ViewStyle;
    clusterIcon: ViewStyle;
    clusterIconCore: ViewStyle;
}

const ICON_COLOR = "#1C7D77";

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
        // Horizontal padding lives on the header and scroll content instead, so the scroll
        // view spans the full card width and its scroll bar sits against the card's edge.
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
        paddingHorizontal: 12,
        paddingBottom: 4
    },
    // Lets the scroll area shrink inside the height-capped card, so the header stays visible.
    popupScroll: {
        flexShrink: 1
    },
    popupScrollContent: {
        paddingHorizontal: 12
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
    // Round floating button shared by the close and clustering toggle buttons.
    mapButton: {
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
        color: ICON_COLOR
    },
    // "Show all markers": three separate dots.
    scatterIcon: {
        width: 22,
        height: 20
    },
    scatterDot: {
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ICON_COLOR
    },
    scatterDotTop: {
        top: 0,
        left: 7
    },
    scatterDotLeft: {
        bottom: 0,
        left: 0
    },
    scatterDotRight: {
        bottom: 0,
        right: 0
    },
    // "Group markers": a single cluster bubble with a ring.
    clusterIcon: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: ICON_COLOR,
        justifyContent: "center",
        alignItems: "center"
    },
    clusterIconCore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: ICON_COLOR
    }
}) as MapDataStyle;
