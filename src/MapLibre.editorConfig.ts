import { MapLibrePreviewProps } from "../typings/MapLibreProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
    placeholder: string; // text to be shown inside the dropzone when empty
    showDataSourceHeader?: boolean; // true by default. Toggles whether to show a header containing information about the datasource
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

function hasCustomLegend(values: MapLibrePreviewProps): boolean {
    return values.legendHeader.widgetCount > 0 || values.legendContent.widgetCount > 0;
}

// Removes widget-level properties by key, wherever they sit in the (nested) property groups.
function hideProperties(groups: PropertyGroup[], keys: string[]): void {
    for (const group of groups) {
        group.properties = group.properties?.filter(property => !keys.includes(property.key));
        if (group.propertyGroups) {
            hideProperties(group.propertyGroups, keys);
        }
    }
}

export function getProperties(
    values: MapLibrePreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    if (!values.showLegend) {
        hideProperties(defaultProperties, [
            "legendInitiallyOpen",
            "legendTitle",
            "legendHeader",
            "legendContent",
            "legendVisible",
            "legendShowCounts",
            "legendToggleLayers"
        ]);
    } else if (hasCustomLegend(values)) {
        // These only apply to the generated legend.
        hideProperties(defaultProperties, ["legendTitle", "legendShowCounts", "legendToggleLayers"]);
    }
    if (!values.showSearch) {
        hideProperties(defaultProperties, ["searchPlaceholder", "searchNoResults"]);
    }
    return defaultProperties;
}

export function check(values: MapLibrePreviewProps): Problem[] {
    const problems: Problem[] = [];

    if (values.defaultLatitude !== null && Math.abs(values.defaultLatitude) > 90) {
        problems.push({ property: "defaultLatitude", message: "Default latitude must be between -90 and 90." });
    }
    if (values.defaultLongitude !== null && Math.abs(values.defaultLongitude) > 180) {
        problems.push({ property: "defaultLongitude", message: "Default longitude must be between -180 and 180." });
    }
    if (values.defaultZoom !== null && (values.defaultZoom < 0 || values.defaultZoom > 22)) {
        problems.push({ property: "defaultZoom", message: "Default zoom must be between 0 and 22." });
    }

    if (!!values.locationLatitude !== !!values.locationLongitude) {
        problems.push({
            property: values.locationLatitude ? "locationLongitude" : "locationLatitude",
            message: "Set both Location latitude and Location longitude, or neither."
        });
    }
    if (values.onLocationClick && !values.locationLatitude && !values.locationLongitude) {
        problems.push({
            property: "locationLatitude",
            severity: "warning",
            message:
                "The location button can't center the map without Location latitude and longitude attributes for its action to fill."
        });
    }
    if (values.showLegend && !hasCustomLegend(values) && !values.markerLayers.some(layer => layer.legendLabel)) {
        problems.push({
            property: "showLegend",
            severity: "warning",
            message:
                "The legend is hidden until it has Legend header or content widgets, or a marker layer has a Legend label."
        });
    }
    if (values.showSearch && !values.markerLayers.some(layer => layer.searchText)) {
        problems.push({
            property: "showSearch",
            severity: "warning",
            message: "The search button is hidden until a marker layer has a Search text."
        });
    }
    return problems;
}

// export function getPreview(values: MapLibrePreviewProps, isDarkMode: boolean, version: number[]): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: MapLibrePreviewProps, platform: Platform): string {
//     return "MapLibre";
// }
