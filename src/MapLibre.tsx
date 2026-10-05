import { Component, ReactNode } from "react";

import { MapData } from "./components/MapData";
import { MapLibreProps } from "../typings/MapLibreProps";

export class MapLibre extends Component<MapLibreProps<any>> {
    private readonly onClickHandler = this.onClick.bind(this);
    private readonly onCloseHandler = this.onClose.bind(this);

    render(): ReactNode {
        const jsonData = this.props.mapData?.displayValue || "{}";
        const styleUrl = this.props.mapStyle?.displayValue || "https://demotiles.maplibre.org/style.json";

        return (
            <MapData
                style={this.props.style}
                onClick={this.onClickHandler}
                mapMarkerDataJson={jsonData}
                mapStyle={styleUrl}
                onClose={this.props.onClose ? this.onCloseHandler : undefined}
            />
        );
    }

    private onClick(): void {
        const { onClick } = this.props;

        if (onClick && onClick.canExecute && !onClick.isExecuting) {
            onClick.execute();
        }
    }

    private onClose(): void {
        const { onClose } = this.props;

        if (onClose && onClose.canExecute && !onClose.isExecuting) {
            onClose.execute();
        }
    }
}
