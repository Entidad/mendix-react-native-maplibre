/**
 * This file was generated from MapLibre.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import {
    ActionValue,
    DynamicValue,
    EditableValue,
    ListActionValue,
    ListAttributeValue,
    ListExpressionValue,
    ListValue,
    ListWidgetValue,
    NativeImage
} from "mendix";
import { ComponentType, CSSProperties, ReactNode } from "react";
import { Big } from "big.js";

export type AttributionPositionEnum = "bottomRight" | "bottomLeft" | "topRight" | "topLeft";

export type IconAnchorEnum = "bottom" | "center";

export interface MarkerLayersType {
    markers: ListValue;
    latitude: ListAttributeValue<Big | string>;
    longitude: ListAttributeValue<Big | string>;
    visible?: DynamicValue<boolean>;
    markerCount?: EditableValue<Big>;
    searchText?: ListExpressionValue<string>;
    legendLabel?: DynamicValue<string>;
    markerIcon?: DynamicValue<NativeImage>;
    iconSize: number;
    iconAnchor: IconAnchorEnum;
    cluster: boolean;
    clusterRadius: number;
    clusterColor: string;
    spreadOverlapping: boolean;
    popupHeader?: ListWidgetValue;
    popupContent?: ListWidgetValue;
    onMarkerClick?: ListActionValue;
}

export interface MarkerLayersPreviewType {
    markers: {} | { caption: string } | { type: string } | null;
    latitude: string;
    longitude: string;
    visible: string;
    markerCount: string;
    searchText: string;
    legendLabel: string;
    markerIcon: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
    iconSize: number | null;
    iconAnchor: IconAnchorEnum;
    cluster: boolean;
    clusterRadius: number | null;
    clusterColor: string;
    spreadOverlapping: boolean;
    popupHeader: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    popupContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    onMarkerClick: {} | null;
}

export interface MapLibreProps<Style> {
    name: string;
    style: Style[];
    mapStyle?: EditableValue<string>;
    defaultLatitude: Big;
    defaultLongitude: Big;
    defaultZoom: Big;
    clusterFont: string;
    showClusterToggle: boolean;
    popupVisible?: EditableValue<boolean>;
    showAttribution: boolean;
    attributionPosition: AttributionPositionEnum;
    attributionText?: DynamicValue<string>;
    tintColor: string;
    markerLayers: MarkerLayersType[];
    buttonColor: string;
    onLocationClick?: ActionValue;
    locationLatitude?: EditableValue<Big | string>;
    locationLongitude?: EditableValue<Big | string>;
    locationZoom: number;
    showLegend: boolean;
    legendInitiallyOpen: boolean;
    legendTitle?: DynamicValue<string>;
    legendHeader?: ReactNode;
    legendContent?: ReactNode;
    legendVisible?: EditableValue<boolean>;
    legendShowCounts: boolean;
    legendToggleLayers: boolean;
    showSearch: boolean;
    searchPlaceholder?: DynamicValue<string>;
    searchNoResults?: DynamicValue<string>;
    onClose?: ActionValue;
}

export interface MapLibrePreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    mapStyle: string;
    defaultLatitude: number | null;
    defaultLongitude: number | null;
    defaultZoom: number | null;
    clusterFont: string;
    showClusterToggle: boolean;
    popupVisible: string;
    showAttribution: boolean;
    attributionPosition: AttributionPositionEnum;
    attributionText: string;
    tintColor: string;
    markerLayers: MarkerLayersPreviewType[];
    buttonColor: string;
    onLocationClick: {} | null;
    locationLatitude: string;
    locationLongitude: string;
    locationZoom: number | null;
    showLegend: boolean;
    legendInitiallyOpen: boolean;
    legendTitle: string;
    legendHeader: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    legendContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    legendVisible: string;
    legendShowCounts: boolean;
    legendToggleLayers: boolean;
    showSearch: boolean;
    searchPlaceholder: string;
    searchNoResults: string;
    onClose: {} | null;
}
