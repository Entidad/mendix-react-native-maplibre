import { ReactElement } from "react";
import { View, Text, Pressable, Image, ScrollView, ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

import { DefaultMarkerIcon } from "./MapIcons";
import { legendStyles as styles } from "../ui/styles";

export interface LegendEntry {
    layerIndex: number;
    label: string;
    icon?: ImageSourcePropType;
    count: number;
    hidden: boolean;
}

interface LegendProps {
    title: string;
    entries: LegendEntry[];
    showCounts: boolean;
    toggleLayers: boolean;
    onToggleLayer: (layerIndex: number) => void;
    style: StyleProp<ViewStyle>;
}

// The generated legend, used when no custom legend content is designed in Studio Pro.
export function Legend(props: LegendProps): ReactElement {
    const { entries, showCounts, toggleLayers } = props;

    return (
        <View style={[styles.panel, props.style]}>
            {!!props.title && <Text style={styles.title}>{props.title}</Text>}
            <ScrollView style={styles.list} bounces={false}>
                {entries.map(entry => (
                    <Pressable
                        key={entry.layerIndex}
                        style={[styles.row, entry.hidden && styles.rowHidden]}
                        onPress={() => props.onToggleLayer(entry.layerIndex)}
                        disabled={!toggleLayers}
                        accessibilityRole={toggleLayers ? "switch" : "text"}
                        accessibilityState={toggleLayers ? { checked: !entry.hidden } : undefined}
                        accessibilityLabel={entry.label}
                    >
                        <View style={styles.iconBox}>
                            {entry.icon ? (
                                <Image source={entry.icon} style={styles.icon} resizeMode="contain" />
                            ) : (
                                <DefaultMarkerIcon />
                            )}
                        </View>
                        <Text style={styles.label} numberOfLines={2}>
                            {entry.label}
                        </Text>
                        {showCounts && <Text style={styles.count}>{entry.count}</Text>}
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
