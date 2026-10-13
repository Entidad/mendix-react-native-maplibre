import { Component, ReactNode } from "react";

import { MapData, LocationOptions, clampZoom, toCoordinate } from "./components/MapData";
import { ICON_COLOR } from "./ui/styles";
import { MapLibreProps } from "../typings/MapLibreProps";

export class MapLibre extends Component<MapLibreProps<any>> {
    private readonly onCloseHandler = this.onClose.bind(this);
    private readonly onLocationHandler = this.onLocation.bind(this);

    render(): ReactNode {
        const styleUrl = this.props.mapStyle?.displayValue || "https://demotiles.maplibre.org/style.json";

        return (
            <MapData
                layers={this.props.markerLayers}
                mapStyle={styleUrl}
                defaultView={{
                    // An out-of-range coordinate falls back to the property's own default.
                    center: [
                        toCoordinate(this.props.defaultLongitude, 180) ?? -119.126,
                        toCoordinate(this.props.defaultLatitude, 90) ?? 34.3575
                    ],
                    zoom: clampZoom(Number(this.props.defaultZoom))
                }}
                popupVisible={this.props.popupVisible}
                clusterFont={this.props.clusterFont || "Noto Sans Bold"}
                showClusterToggle={this.props.showClusterToggle}
                buttonColor={this.props.buttonColor || ICON_COLOR}
                attribution={{
                    showButton: this.props.showAttribution,
                    position: this.props.attributionPosition,
                    text: this.props.attributionText?.value || undefined,
                    tintColor: this.props.tintColor || undefined
                }}
                location={this.getLocationOptions()}
                legend={
                    this.props.showLegend
                        ? {
                              title: this.props.legendTitle?.value || "Legend",
                              header: this.props.legendHeader,
                              content: this.props.legendContent,
                              visible: this.props.legendVisible,
                              initiallyOpen: this.props.legendInitiallyOpen,
                              showCounts: this.props.legendShowCounts,
                              toggleLayers: this.props.legendToggleLayers
                          }
                        : undefined
                }
                search={
                    this.props.showSearch
                        ? {
                              placeholder: this.props.searchPlaceholder?.value || "Search markers",
                              noResults: this.props.searchNoResults?.value || "No matching markers"
                          }
                        : undefined
                }
                onClose={this.props.onClose ? this.onCloseHandler : undefined}
            />
        );
    }

    private getLocationOptions(): LocationOptions {
        const { onLocationClick, locationLatitude, locationLongitude } = this.props;
        const lat = locationLatitude?.status === "available" ? toCoordinate(locationLatitude.value, 90) : undefined;
        const lng = locationLongitude?.status === "available" ? toCoordinate(locationLongitude.value, 180) : undefined;
        // Numeric attributes can't be empty, so a location that was never set reads 0, 0 (in the Atlantic).
        const isSet = lat !== undefined && lng !== undefined && !(lat === 0 && lng === 0);

        return {
            onPress: onLocationClick ? this.onLocationHandler : undefined,
            executing: !!onLocationClick?.isExecuting,
            // Until the context object has loaded, a missing value doesn't mean "no location".
            ready: locationLatitude?.status !== "loading" && locationLongitude?.status !== "loading",
            coordinate: isSet ? [lng, lat] : undefined,
            zoom: this.props.locationZoom
        };
    }

    private onLocation(): void {
        const { onLocationClick } = this.props;

        if (onLocationClick && onLocationClick.canExecute && !onLocationClick.isExecuting) {
            onLocationClick.execute();
        }
    }

    private onClose(): void {
        const { onClose } = this.props;

        if (onClose && onClose.canExecute && !onClose.isExecuting) {
            onClose.execute();
        }
    }
}
