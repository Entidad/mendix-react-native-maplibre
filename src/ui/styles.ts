import { ImageStyle, TextStyle, ViewStyle, StyleSheet } from "react-native";

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
    floating: ViewStyle;
    buttonColumn: ViewStyle;
    closeButtonIcon: TextStyle;
}

export interface MapIconStyle {
    scatterIcon: ViewStyle;
    scatterDot: ViewStyle;
    scatterDotTop: ViewStyle;
    scatterDotLeft: ViewStyle;
    scatterDotRight: ViewStyle;
    clusterIcon: ViewStyle;
    clusterIconCore: ViewStyle;
    locationIcon: ViewStyle;
    locationRing: ViewStyle;
    locationCore: ViewStyle;
    locationTick: ViewStyle;
    locationTickHorizontal: ViewStyle;
    locationTickTop: ViewStyle;
    locationTickBottom: ViewStyle;
    locationTickLeft: ViewStyle;
    locationTickRight: ViewStyle;
    legendIcon: ViewStyle;
    legendIconRow: ViewStyle;
    legendIconDot: ViewStyle;
    legendIconLine: ViewStyle;
    searchIcon: ViewStyle;
    searchIconLens: ViewStyle;
    searchIconHandle: ViewStyle;
    defaultMarker: ViewStyle;
}

export interface LegendStyle {
    panel: ViewStyle;
    title: TextStyle;
    list: ViewStyle;
    row: ViewStyle;
    rowHidden: ViewStyle;
    iconBox: ViewStyle;
    icon: ImageStyle;
    label: TextStyle;
    count: TextStyle;
}

export interface SearchStyle {
    panel: ViewStyle;
    bar: ViewStyle;
    input: TextStyle;
    closeButton: ViewStyle;
    closeIcon: TextStyle;
    results: ViewStyle;
    noResults: TextStyle;
    result: ViewStyle;
    resultLabel: TextStyle;
    resultLayer: TextStyle;
}

export const ICON_COLOR = "#1C7D77";

const cardShadow: ViewStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
};

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
    // Round button shared by the close button and the map controls.
    mapButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        ...cardShadow
    },
    floating: {
        position: "absolute"
    },
    // The map controls stack down the right edge.
    buttonColumn: {
        position: "absolute",
        gap: 12
    },
    closeButtonIcon: {
        fontSize: 18,
        fontWeight: "bold",
        color: ICON_COLOR
    }
}) as MapDataStyle;

export const mapIconStyles: MapIconStyle = StyleSheet.create({
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
    },
    locationIcon: {
        width: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center"
    },
    locationRing: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: ICON_COLOR,
        justifyContent: "center",
        alignItems: "center"
    },
    locationCore: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: ICON_COLOR
    },
    locationTick: {
        position: "absolute",
        width: 2,
        height: 4,
        backgroundColor: ICON_COLOR
    },
    locationTickHorizontal: {
        width: 4,
        height: 2,
        top: 10
    },
    locationTickTop: {
        top: 0,
        left: 10
    },
    locationTickBottom: {
        bottom: 0,
        left: 10
    },
    locationTickLeft: {
        left: 0
    },
    locationTickRight: {
        right: 0
    },
    legendIcon: {
        width: 20,
        gap: 3
    },
    legendIconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3
    },
    legendIconDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: ICON_COLOR
    },
    legendIconLine: {
        flex: 1,
        height: 2,
        borderRadius: 1,
        backgroundColor: ICON_COLOR
    },
    searchIcon: {
        width: 20,
        height: 20
    },
    searchIconLens: {
        position: "absolute",
        top: 1,
        left: 1,
        width: 13,
        height: 13,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: ICON_COLOR
    },
    searchIconHandle: {
        position: "absolute",
        top: 14,
        left: 11,
        width: 8,
        height: 2.5,
        borderRadius: 1.25,
        backgroundColor: ICON_COLOR,
        transform: [{ rotate: "45deg" }]
    },
    // Matches the map's default marker: white dot with a teal ring.
    defaultMarker: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 4,
        borderColor: ICON_COLOR,
        backgroundColor: "#FFFFFF"
    }
}) as MapIconStyle;

export const legendStyles: LegendStyle = StyleSheet.create({
    panel: {
        position: "absolute",
        width: 240,
        maxWidth: "70%",
        maxHeight: "60%",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingVertical: 8,
        ...cardShadow
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333333",
        paddingHorizontal: 12,
        paddingBottom: 4
    },
    // Lets the rows scroll inside the height-capped panel.
    list: {
        flexShrink: 1
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 40,
        paddingHorizontal: 12,
        gap: 10
    },
    rowHidden: {
        opacity: 0.4
    },
    iconBox: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        width: 24,
        height: 24
    },
    label: {
        flex: 1,
        fontSize: 14,
        color: "#333333"
    },
    count: {
        fontSize: 13,
        color: "#6B6B6B",
        fontVariant: ["tabular-nums"]
    }
}) as LegendStyle;

export const searchStyles: SearchStyle = StyleSheet.create({
    panel: {
        position: "absolute",
        gap: 8
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        borderRadius: 22,
        paddingLeft: 14,
        paddingRight: 6,
        gap: 8,
        backgroundColor: "#FFFFFF",
        ...cardShadow
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: "#333333",
        paddingVertical: 0
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center"
    },
    closeIcon: {
        fontSize: 16,
        fontWeight: "bold",
        color: ICON_COLOR
    },
    results: {
        maxHeight: 280,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        ...cardShadow
    },
    noResults: {
        padding: 14,
        fontSize: 14,
        color: "#6B6B6B"
    },
    result: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0"
    },
    resultLabel: {
        fontSize: 15,
        color: "#333333"
    },
    resultLayer: {
        fontSize: 12,
        color: "#6B6B6B",
        marginTop: 2
    }
}) as SearchStyle;
