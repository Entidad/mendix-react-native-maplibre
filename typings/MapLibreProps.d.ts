/**
 * This file was generated from MapLibre.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface MapLibreProps<Style> {
    name: string;
    style: Style[];
    mapData?: EditableValue<string | Big>;
    mapStyle?: EditableValue<string>;
    onClick?: ActionValue;
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
    mapData: string;
    mapStyle: string;
    onClick: {} | null;
}
