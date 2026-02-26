import { createElement } from "react";
const React = { createElement };


import { Placeholder } from "mendix/widgets/native/Placeholder";
import { addEnumerations, asPluginWidgets, t } from "mendix/native";

import * as styles from "../styles.js";

const { $Placeholder } = asPluginWidgets({ Placeholder });

export const mainContent = (placeholder$Main) => [
    <$Placeholder key="l5.Atlas_Core.NativePhone_FullPage.Main"
        $widgetId="l5.Atlas_Core.NativePhone_FullPage.Main"
        content={placeholder$Main()} />
];

export const sidebar = () => null;

