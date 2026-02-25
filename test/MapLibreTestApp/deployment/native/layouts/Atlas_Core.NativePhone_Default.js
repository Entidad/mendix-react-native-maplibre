import { createElement } from "react";
const React = { createElement };


import { Placeholder } from "mendix/widgets/native/Placeholder";
import { addEnumerations, asPluginWidgets, t } from "mendix/native";

import * as styles from "../styles.js";

const { $Placeholder } = asPluginWidgets({ Placeholder });

export const mainContent = (placeholder$Main) => [
    <$Placeholder key="l2.Atlas_Core.NativePhone_Default.Main"
        $widgetId="l2.Atlas_Core.NativePhone_Default.Main"
        content={placeholder$Main()} />
];

export const sidebar = () => null;

