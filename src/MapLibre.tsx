import { Component, ReactNode, createElement } from "react";

import { FarmMap } from "./components/FarmMap";
import { MapLibreProps } from "../typings/MapLibreProps";

export class MapLibre extends Component<MapLibreProps<any>> {
    private readonly onClickHandler = this.onClick.bind(this);

    render(): ReactNode {
        const jsonData = this.props.value?.displayValue || "{}";

        return <FarmMap style={this.props.style} onClick={this.onClickHandler} farmDataJson={jsonData} />;
    }

    private onClick(): void {
        const { onClick } = this.props;

        if (onClick && onClick.canExecute && !onClick.isExecuting) {
            onClick.execute();
        }
    }
}
