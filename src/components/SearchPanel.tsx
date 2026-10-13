import { ReactElement } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleProp, ViewStyle } from "react-native";

import { SearchIcon } from "./MapIcons";
import { searchStyles as styles } from "../ui/styles";

export interface SearchResult {
    key: string;
    layerIndex: number;
    itemId: string;
    label: string;
    layerLabel?: string;
    coordinates: [number, number];
}

interface SearchPanelProps {
    value: string;
    placeholder: string;
    noResults: string;
    results: SearchResult[];
    // The list collapses after picking a result, so the filtered map is visible.
    showResults: boolean;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onSubmit: () => void;
    onClose: () => void;
    onSelect: (result: SearchResult) => void;
    buttonColor: string;
    style: StyleProp<ViewStyle>;
}

export function SearchPanel(props: SearchPanelProps): ReactElement {
    const { results, showResults } = props;
    const hasQuery = props.value.trim().length > 0;

    return (
        <View style={[styles.panel, props.style]} pointerEvents="box-none">
            <View style={styles.bar}>
                <SearchIcon color={props.buttonColor} />
                <TextInput
                    style={styles.input}
                    value={props.value}
                    placeholder={props.placeholder}
                    placeholderTextColor="#8A8A8A"
                    onChangeText={props.onChangeText}
                    onFocus={props.onFocus}
                    onSubmitEditing={props.onSubmit}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoFocus
                    accessibilityLabel={props.placeholder}
                />
                <Pressable
                    style={styles.closeButton}
                    onPress={props.onClose}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Close search"
                >
                    <Text style={[styles.closeIcon, { color: props.buttonColor }]}>✕</Text>
                </Pressable>
            </View>
            {showResults && hasQuery && (
                <View style={styles.results}>
                    {results.length === 0 ? (
                        <Text style={styles.noResults}>{props.noResults}</Text>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={result => result.key}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.result}
                                    onPress={() => props.onSelect(item)}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.resultLabel} numberOfLines={1}>
                                        {item.label}
                                    </Text>
                                    {!!item.layerLabel && (
                                        <Text style={styles.resultLayer} numberOfLines={1}>
                                            {item.layerLabel}
                                        </Text>
                                    )}
                                </Pressable>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
}
