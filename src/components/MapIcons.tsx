import { ReactElement } from "react";
import { View } from "react-native";

import { mapIconStyles as styles } from "../ui/styles";

// Button icons are drawn with views, so the widget needs no icon font or image assets.
// The stylesheet holds their shapes; the color comes from the widget's "Button color".

interface IconProps {
    color: string;
}

// "Show all markers": three separate dots.
export function ScatterIcon({ color }: IconProps): ReactElement {
    const fill = { backgroundColor: color };
    return (
        <View style={styles.scatterIcon}>
            <View style={[styles.scatterDot, styles.scatterDotTop, fill]} />
            <View style={[styles.scatterDot, styles.scatterDotLeft, fill]} />
            <View style={[styles.scatterDot, styles.scatterDotRight, fill]} />
        </View>
    );
}

// "Group markers": a single cluster bubble with a ring.
export function ClusterIcon({ color }: IconProps): ReactElement {
    return (
        <View style={[styles.clusterIcon, { borderColor: color }]}>
            <View style={[styles.clusterIconCore, { backgroundColor: color }]} />
        </View>
    );
}

// "My location": a crosshair.
export function LocationIcon({ color }: IconProps): ReactElement {
    const fill = { backgroundColor: color };
    return (
        <View style={styles.locationIcon}>
            <View style={[styles.locationTick, styles.locationTickTop, fill]} />
            <View style={[styles.locationTick, styles.locationTickBottom, fill]} />
            <View style={[styles.locationTick, styles.locationTickHorizontal, styles.locationTickLeft, fill]} />
            <View style={[styles.locationTick, styles.locationTickHorizontal, styles.locationTickRight, fill]} />
            <View style={[styles.locationRing, { borderColor: color }]}>
                <View style={[styles.locationCore, fill]} />
            </View>
        </View>
    );
}

// "Legend": a list of dots and lines.
export function LegendIcon({ color }: IconProps): ReactElement {
    const fill = { backgroundColor: color };
    return (
        <View style={styles.legendIcon}>
            {[0, 1, 2].map(row => (
                <View key={row} style={styles.legendIconRow}>
                    <View style={[styles.legendIconDot, fill]} />
                    <View style={[styles.legendIconLine, fill]} />
                </View>
            ))}
        </View>
    );
}

// "Search": a magnifying glass.
export function SearchIcon({ color }: IconProps): ReactElement {
    return (
        <View style={styles.searchIcon}>
            <View style={[styles.searchIconLens, { borderColor: color }]} />
            <View style={[styles.searchIconHandle, { backgroundColor: color }]} />
        </View>
    );
}

// The default marker (white dot, teal ring) at legend size; matches the map, not the buttons.
export function DefaultMarkerIcon(): ReactElement {
    return <View style={styles.defaultMarker} />;
}
