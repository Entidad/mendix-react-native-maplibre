import { createElement } from "react";
const React = { createElement };

import { PageFragment } from "mendix/PageFragment";
import { ExpressionProperty } from "mendix/ExpressionProperty";

import { Container } from "mendix/widgets/web/Container";
import { Div } from "mendix/widgets/web/Div";
import { Text } from "mendix/widgets/web/Text";
import { addEnumerations, asPluginWidgets, t } from "mendix";

import { content as parentContent } from "../layouts/Atlas_Core.Atlas_Default.js";

const { $Container, $Div, $Text } = asPluginWidgets({ Container, Div, Text });

const region$Main = (historyId) => (<PageFragment renderKey={historyId}>{[
    <$Container key="p.NativeMobile.Home_Web.container1"
        $widgetId="p.NativeMobile.Home_Web.container1"
        class={"mx-name-container1 pageheader"}
        renderMode={"div"}
        content={[
            <$Div key="p.NativeMobile.Home_Web.layoutGrid2"
                $widgetId="p.NativeMobile.Home_Web.layoutGrid2"
                class={"mx-name-layoutGrid2 mx-layoutgrid mx-layoutgrid-fluid container-fluid"}
                content={[
                    <$Div key="p.NativeMobile.Home_Web.layoutGrid2$row0"
                        $widgetId="p.NativeMobile.Home_Web.layoutGrid2$row0"
                        class={"row"}
                        content={[
                            <$Div key="p.NativeMobile.Home_Web.layoutGrid2$row0$column0"
                                $widgetId="p.NativeMobile.Home_Web.layoutGrid2$row0$column0"
                                class={"col-lg col-md col"}
                                content={[
                                    <$Text key="p.NativeMobile.Home_Web.text1"
                                        $widgetId="p.NativeMobile.Home_Web.text1"
                                        class={"mx-name-text1 pageheader-title spacing-outer-bottom"}
                                        caption={ExpressionProperty({
                                            "expression": { "expr": { "type": "literal", "value": "Home" }, "args": {} }
                                        })}
                                        renderMode={"h3"} />,
                                    <$Text key="p.NativeMobile.Home_Web.text2"
                                        $widgetId="p.NativeMobile.Home_Web.text2"
                                        class={"mx-name-text2 pageheader-subtitle text-detail"}
                                        caption={ExpressionProperty({
                                            "expression": { "expr": { "type": "literal", "value": "Welcome to your new app" }, "args": {} }
                                        })}
                                        renderMode={"p"} />
                                ]} />
                        ]} />
                ]} />
        ]}
        ariaHidden={false} />,
    <$Div key="p.NativeMobile.Home_Web.layoutGrid1"
        $widgetId="p.NativeMobile.Home_Web.layoutGrid1"
        class={"mx-name-layoutGrid1 mx-layoutgrid mx-layoutgrid-fluid container-fluid"}
        content={[
            <$Div key="p.NativeMobile.Home_Web.layoutGrid1$row0"
                $widgetId="p.NativeMobile.Home_Web.layoutGrid1$row0"
                class={"row"}
                content={[
                    <$Div key="p.NativeMobile.Home_Web.layoutGrid1$row0$column0"
                        $widgetId="p.NativeMobile.Home_Web.layoutGrid1$row0$column0"
                        class={"col-lg col-md col"} />
                ]} />
        ]} />
]}</PageFragment>);

export const title = t([
    "Homepage"
]);

export const classes = "layout-atlas layout-atlas-responsive-default page-dashboard page-dashboard-actions";

export const style = {};
export const content = { ...parentContent,
    "Atlas_Core.Atlas_Default.Main": region$Main,
};
