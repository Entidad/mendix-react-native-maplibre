import { createElement } from "react";
const React = { createElement };

import { ActionProperty } from "mendix/ActionProperty";
import { DatabaseObjectListProperty } from "mendix/DatabaseObjectListProperty";
import { ExpressionProperty } from "mendix/ExpressionProperty";
import { ListExpressionProperty } from "mendix/ListExpressionProperty";
import { PlaceholderProperty } from "mendix/PlaceholderProperty";
import { TextProperty } from "mendix/TextProperty";
import { WebIconProperty } from "mendix/WebIconProperty";
import { WebStaticImageProperty } from "mendix/WebStaticImageProperty";

import { Container } from "mendix/widgets/web/Container";
import { Div } from "mendix/widgets/web/Div";
import { Fragment } from "mendix/widgets/web/Fragment";
import * as ImageWidgetModule from "C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/web/widgets/com/mendix/widget/web/image/Image.mjs";
const Image = Object.getOwnPropertyDescriptor(ImageWidgetModule, "Image")?.value || Object.getOwnPropertyDescriptor(ImageWidgetModule, "default")?.value;   
import "C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/web/widgets/com/mendix/widget/web/image/Image.css";
import * as LanguageSelectorWidgetModule from "C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/web/widgets/com/mendix/widget/web/languageselector/LanguageSelector.mjs";
const LanguageSelector = Object.getOwnPropertyDescriptor(LanguageSelectorWidgetModule, "LanguageSelector")?.value || Object.getOwnPropertyDescriptor(LanguageSelectorWidgetModule, "default")?.value;   
import "C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/deployment/web/widgets/com/mendix/widget/web/languageselector/LanguageSelector.css";
import { MenuBar } from "mendix/widgets/web/MenuBar";
import { NavigationTree } from "mendix/widgets/web/NavigationTree";
import { Placeholder } from "mendix/widgets/web/Placeholder";
import { ScrollContainer } from "mendix/widgets/web/ScrollContainer";
import { SidebarToggle } from "mendix/widgets/web/SidebarToggle";
import { addEnumerations, asPluginWidgets, t } from "mendix";


const { $ScrollContainer, $Fragment, $Div, $Container, $SidebarToggle, $Image, $MenuBar, $LanguageSelector, $NavigationTree, $Placeholder } = asPluginWidgets({ ScrollContainer, Fragment, Div, Container, SidebarToggle, Image, MenuBar, LanguageSelector, NavigationTree, Placeholder });

const region$Main = [
    <$ScrollContainer key="l.Atlas_Core.Atlas_TopBar.layoutContainer"
        $widgetId="l.Atlas_Core.Atlas_TopBar.layoutContainer"
        class={"mx-name-layoutContainer"}
        scrollPerRegion={true}
        layoutMode={"sidebar"}
        top={{
            "enabled": true,
            "content": [
                <$Fragment key="l.Atlas_Core.Atlas_TopBar.snippetCall1"
                    $widgetId="l.Atlas_Core.Atlas_TopBar.snippetCall1" />,
                <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid1"
                    $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid1"
                    class={"mx-name-layoutGrid1 mx-layoutgrid mx-layoutgrid-fluid container-fluid"}
                    content={[
                        <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid1$row0"
                            $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid1$row0"
                            class={"row"}
                            content={[
                                <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid1$row0$column0"
                                    $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid1$row0$column0"
                                    class={"col-lg-12 col-md-12 col-12"}
                                    content={[
                                        <$Container key="l.Atlas_Core.Atlas_TopBar.container2"
                                            $widgetId="l.Atlas_Core.Atlas_TopBar.container2"
                                            class={"mx-name-container2 topbar-content"}
                                            renderMode={"div"}
                                            content={[
                                                <$SidebarToggle key="l.Atlas_Core.Atlas_TopBar.sidebarToggle3"
                                                    $widgetId="l.Atlas_Core.Atlas_TopBar.sidebarToggle3"
                                                    buttonId={"l.Atlas_Core.Atlas_TopBar.sidebarToggle3"}
                                                    renderType={"button"}
                                                    buttonClass={"btn-primary"}
                                                    caption={ExpressionProperty({
                                                        "expression": { "expr": { "type": "literal", "value": "" }, "args": {} }
                                                    })}
                                                    tooltip={TextProperty({
                                                        "value": "Toggle Menu"
                                                    })}
                                                    icon={WebIconProperty({
                                                        "icon": { "type": "icon", "iconClass": "mx-icon-filled mx-icon-navigation-menu" }
                                                    })}
                                                    class={"mx-name-sidebarToggle3 toggle-btn"} />,
                                                <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid2"
                                                    $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid2"
                                                    class={"mx-name-layoutGrid2 mx-layoutgrid mx-layoutgrid-fluid navbar-brand"}
                                                    content={[
                                                        <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0"
                                                            $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0"
                                                            class={"row align-children-center"}
                                                            content={[
                                                                <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0$column0"
                                                                    $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0$column0"
                                                                    class={"col-lg-auto col-md-auto col-auto"}
                                                                    content={[
                                                                        <$Image key="l.Atlas_Core.Atlas_TopBar.staticImage1"
                                                                            $widgetId="l.Atlas_Core.Atlas_TopBar.staticImage1"
                                                                            datasource={"image"}
                                                                            imageObject={WebStaticImageProperty({
                                                                                "image": { "uri": "img/Atlas_Core$Layout$logo.svg" }
                                                                            })}
                                                                            imageUrl={ExpressionProperty({
                                                                                "expression": { "expr": { "type": "literal", "value": "" }, "args": {} }
                                                                            })}
                                                                            isBackgroundImage={false}
                                                                            onClickType={"action"}
                                                                            alternativeText={ExpressionProperty({
                                                                                "expression": { "expr": { "type": "literal", "value": "" }, "args": {} }
                                                                            })}
                                                                            widthUnit={"auto"}
                                                                            width={100}
                                                                            heightUnit={"auto"}
                                                                            height={100}
                                                                            iconSize={14}
                                                                            displayAs={"fullImage"}
                                                                            responsive={false}
                                                                            class={"mx-name-staticImage1"} />
                                                                    ]} />,
                                                                <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0$column1"
                                                                    $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0$column1"
                                                                    class={"col-lg col-md col"}
                                                                    content={[
                                                                        <$MenuBar key="l.Atlas_Core.Atlas_TopBar.menuBar1"
                                                                            $widgetId="l.Atlas_Core.Atlas_TopBar.menuBar1"
                                                                            class={"mx-name-menuBar1 hidden-xs hide-icons"}
                                                                            menu={[
                                                                                {
                                                                                    "caption": TextProperty({
                                                                                        "value": "Home"
                                                                                    }),
                                                                                    "icon": WebIconProperty({
                                                                                        "icon": { "type": "glyph", "iconClass": "glyphicon-home" }
                                                                                    }),
                                                                                    "action": ActionProperty({
                                                                                        "action": { "type": "openPage", "argMap": {}, "config": { "name": "NativeMobile/Home_Web.page.xml", "location": "content" }, "disabledDuringExecution": false },
                                                                                        "skipClientValidation": true
                                                                                    })
                                                                                }
                                                                            ]} />
                                                                    ]} />,
                                                                <$Div key="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0$column2"
                                                                    $widgetId="l.Atlas_Core.Atlas_TopBar.layoutGrid2$row0$column2"
                                                                    class={"col-lg-auto col-md-auto col-auto"}
                                                                    content={[
                                                                        <$Fragment key="l.Atlas_Core.Atlas_TopBar.snippetCall2"
                                                                            $widgetId="l.Atlas_Core.Atlas_TopBar.snippetCall2"
                                                                            content={[
                                                                                <$LanguageSelector key="l.Atlas_Core.LanguageSelectorWidget.languageSelector1"
                                                                                    $widgetId="l.Atlas_Core.LanguageSelectorWidget.languageSelector1"
                                                                                    languageOptions={DatabaseObjectListProperty({
                                                                                        "dataSourceId": "l.2",
                                                                                        "entity": "System.Language",
                                                                                        "operationId": "aarkvMhsRFKCHYgxrJwxag",
                                                                                        "sort": [
                                                                                            [
                                                                                                "Description",
                                                                                                "asc"
                                                                                            ]
                                                                                        ]
                                                                                    })}
                                                                                    languageCaption={ListExpressionProperty({
                                                                                        "expression": { "expr": { "type": "variable", "variable": "currentObject", "path": "Description" }, "args": { "currentObject": { "widget": "l.Atlas_Core.LanguageSelectorWidget.languageSelector1", "source": "object" } } },
                                                                                        "dataSourceId": "l.2"
                                                                                    })}
                                                                                    position={"bottom"}
                                                                                    trigger={"click"}
                                                                                    hideForSingle={false}
                                                                                    screenReaderLabelCaption={ExpressionProperty({
                                                                                        "expression": { "expr": { "type": "literal", "value": "" }, "args": {} }
                                                                                    })}
                                                                                    class={"mx-name-languageSelector1"} />
                                                                            ]} />
                                                                    ]} />
                                                            ]} />
                                                    ]} />
                                            ]}
                                            ariaHidden={false} />
                                    ]} />
                            ]} />
                    ]} />
            ],
            "sizeMode": "auto",
            "class": "region-topbar"
        }}
        bottom={{
            "enabled": false
        }}
        left={{
            "enabled": true,
            "content": [
                <$NavigationTree key="l.Atlas_Core.Atlas_TopBar.navigationTree1"
                    $widgetId="l.Atlas_Core.Atlas_TopBar.navigationTree1"
                    class={"mx-name-navigationTree1"}
                    menu={[
                        {
                            "caption": TextProperty({
                                "value": "Home"
                            }),
                            "icon": WebIconProperty({
                                "icon": { "type": "glyph", "iconClass": "glyphicon-home" }
                            }),
                            "action": ActionProperty({
                                "action": { "type": "openPage", "argMap": {}, "config": { "name": "NativeMobile/Home_Web.page.xml", "location": "content" }, "disabledDuringExecution": false },
                                "skipClientValidation": true
                            })
                        }
                    ]} />
            ],
            "sizeMode": "pixels",
            "sizeValue": 320,
            "class": "region-sidebar",
            "toggleMode": "push",
            "initiallyOpen": false
        }}
        right={{
            "enabled": false
        }}
        center={{
            "content": [
                <$Placeholder key="l.Atlas_Core.Atlas_TopBar.Main"
                    $widgetId="l.Atlas_Core.Atlas_TopBar.Main"
                    content={PlaceholderProperty({
                        "id": "Atlas_Core.Atlas_TopBar.Main"
                    })} />
            ],
            "class": "region-content"
        }} />
];

export const content = {
    "Main": region$Main,
};
