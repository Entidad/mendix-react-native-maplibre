import { createElement } from "react";
const React = { createElement };

import { ActionProperty } from "mendix/ActionProperty";
import { ExpressionProperty } from "mendix/ExpressionProperty";
import { NativeStyleProperty } from "mendix/NativeStyleProperty";

import { Button } from "mendix/widgets/native/Button";
import { Container } from "mendix/widgets/native/Container";
import { Text } from "mendix/widgets/native/Text";
import { addEnumerations, asPluginWidgets, t } from "mendix/native";

import { mainContent, sidebar } from "C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/native/layouts/Atlas_Core.NativePhone_Default.js";

import * as styles from "../styles.js";

const { $Container, $Text, $Button } = asPluginWidgets({ Container, Text, Button });

const placeholder$Main = () => [
    <$Container key="p1.NativeMobile.Home_Native.container5"
        $widgetId="p1.NativeMobile.Home_Native.container5"
        style={NativeStyleProperty({
            "styles": [ styles.Container, styles.flexMain, styles.alignChildrenCenter, styles.justifyContentCenter, styles.spacingInnerLeftMedium, styles.spacingInnerRightMedium, styles.backgroundPrimary ]
        })}
        content={[
            <$Container key="p1.NativeMobile.Home_Native.container6"
                $widgetId="p1.NativeMobile.Home_Native.container6"
                style={NativeStyleProperty({
                    "styles": [ styles.Container, styles.spacingOuterBottomSmaller ]
                })}
                content={[
                    <$Text key="p1.NativeMobile.Home_Native.text7"
                        $widgetId="p1.NativeMobile.Home_Native.text7"
                        style={NativeStyleProperty({
                            "styles": [ styles.Text, styles.TextHeading1, styles.h1 ]
                        })}
                        text={ExpressionProperty({
                            "expression": { "expr": { "type": "literal", "value": "MapLibre widget" }, "args": {} }
                        })}
                        accessible={false} />
                ]}
                accessible={false} />,
            <$Container key="p1.NativeMobile.Home_Native.container7"
                $widgetId="p1.NativeMobile.Home_Native.container7"
                style={NativeStyleProperty({
                    "styles": [ styles.Container, styles.flexRow ]
                })}
                content={[
                    <$Text key="p1.NativeMobile.Home_Native.text11"
                        $widgetId="p1.NativeMobile.Home_Native.text11"
                        style={NativeStyleProperty({
                            "styles": [ styles.Text, styles.h1, styles.textLarge, styles.textCenter ]
                        })}
                        text={ExpressionProperty({
                            "expression": { "expr": { "type": "literal", "value": "Make changes, run locally, preview." }, "args": {} }
                        })}
                        accessible={false} />
                ]}
                accessible={false} />,
            <$Button key="p1.NativeMobile.Home_Native.actionButton1"
                $widgetId="p1.NativeMobile.Home_Native.actionButton1"
                style={NativeStyleProperty({
                    "styles": [ styles.ActionButton, styles.spacingOuterTopMedium ]
                })}
                caption={ExpressionProperty({
                    "expression": { "expr": { "type": "literal", "value": "Test MapLibre widget" }, "args": {} }
                })}
                onClick={ActionProperty({
                    "action": { "type": "callNanoflow", "argMap": {}, "config": { "nanoflow": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/native/nanoflows/NativeMobile.ACT_MapLibre_loadTest").ACT_MapLibre_loadTest }, "disabledDuringExecution": true }
                })}
                screenReaderCaption={ExpressionProperty({
                    "expression": { "expr": { "type": "literal", "value": "" }, "args": {} }
                })}
                screenReaderHint={ExpressionProperty({
                    "expression": { "expr": { "type": "literal", "value": "" }, "args": {} }
                })}
                accessible={true} />
        ]}
        accessible={false} />
];

export const placeholder$Header = () => null;

export const $$title = t([
    "Home"
]);

export const $$style = [ styles.Layout, styles.Page ];

export const $$parameters = [];
export const $$page = () => mainContent(placeholder$Main);

export const $$sidebar = () => sidebar();

