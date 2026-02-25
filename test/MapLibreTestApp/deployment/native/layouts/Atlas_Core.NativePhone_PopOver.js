import { createElement } from "react";
const React = { createElement };


import { Placeholder } from "mendix/widgets/native/Placeholder";
import { addEnumerations, asPluginWidgets, t } from "mendix/native";

import * as styles from "../styles.js";

const { $Placeholder } = asPluginWidgets({ Placeholder });

export const mainContent = (placeholder$Main) => [
    <$Placeholder key="l4.Atlas_Core.NativePhone_PopOver.Main"
        $widgetId="l4.Atlas_Core.NativePhone_PopOver.Main"
        content={placeholder$Main()} />
];

export const sidebar = () => null;

