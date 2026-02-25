import { createElement } from "react";
const React = { createElement };

import { AssociationObjectProperty } from "mendix/AssociationObjectProperty";
import { AttributeProperty } from "mendix/AttributeProperty";
import { NativeStyleProperty } from "mendix/NativeStyleProperty";

import { DataView } from "mendix/widgets/native/DataView";
import { MapLibre as entidad_io_native_maplibre_MapLibre } from "../widgets/entidad/io/native/maplibre/MapLibre";
import { addEnumerations, asPluginWidgets, t } from "mendix/native";

import { mainContent, sidebar } from "C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/native/layouts/Atlas_Core.NativePhone_Default.js";

import * as styles from "../styles.js";

const { $DataView, $entidad_io_native_maplibre_MapLibre } = asPluginWidgets({ DataView, entidad_io_native_maplibre_MapLibre });

const placeholder$Main = () => [
    <$DataView key="p5.NativeMobile.MapLibre_Test.dataView1"
        $widgetId="p5.NativeMobile.MapLibre_Test.dataView1"
        style={NativeStyleProperty({
            "styles": [ styles.DataView ]
        })}
        object={AssociationObjectProperty({
            "dataSourceId": "p5.2",
            "scope": "$MapLibre",
            "editable": true
        })}
        content={[
            <$entidad_io_native_maplibre_MapLibre key="p5.NativeMobile.MapLibre_Test.mapLibre1"
                $widgetId="p5.NativeMobile.MapLibre_Test.mapLibre1"
                value={AttributeProperty({
                    "scope": "p5.NativeMobile.MapLibre_Test.dataView1",
                    "path": "",
                    "entity": "NativeMobile.MapLibre",
                    "attribute": "Value",
                    "onChange": { "type": "doNothing", "argMap": {}, "config": {}, "disabledDuringExecution": false },
                    "isList": false
                })}
                style={NativeStyleProperty({
                    "styles": [ styles.entidad_io_native_maplibre_MapLibre ]
                })} />
        ]} />
];

export const placeholder$Header = () => null;

export const $$title = t([
    "MapLibre Test"
]);

export const $$style = [ styles.Layout, styles.Page, styles.spacingInnerTopLarger, styles.spacingInnerBottomLarger, styles.spacingInnerLeftMedium, styles.spacingInnerRightMedium, styles.backgroundPrimary ];

export const $$parameters = ["MapLibre"];
export const $$page = () => mainContent(placeholder$Main);

export const $$sidebar = () => sidebar();

