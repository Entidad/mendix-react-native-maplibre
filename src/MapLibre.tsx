import { Component, ReactNode } from "react";

import { MapData } from "./components/MapData";
import { MapLibreProps } from "../typings/MapLibreProps";

export class MapLibre extends Component<MapLibreProps<any>> {
    private readonly onCloseHandler = this.onClose.bind(this);

    render(): ReactNode {
        const styleUrl = this.props.mapStyle?.displayValue || "https://demotiles.maplibre.org/style.json";

        return (
            <MapData
                layers={this.props.markerLayers}
                mapStyle={styleUrl}
                popupVisible={this.props.popupVisible}
                attribution={{
                    showButton: this.props.showAttribution,
                    position: this.props.attributionPosition,
                    text: this.props.attributionText?.value || undefined,
                    tintColor: this.props.tintColor || undefined
                }}
                onClose={this.props.onClose ? this.onCloseHandler : undefined}
            />
        );
    }

    private onClose(): void {
        const { onClose } = this.props;

        if (onClose && onClose.canExecute && !onClose.isExecuting) {
            onClose.execute();
        }
    }
}
