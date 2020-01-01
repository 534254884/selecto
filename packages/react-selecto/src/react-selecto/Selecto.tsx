import * as React from "react";
import VanillaSelecto, {
    CLASS_NAME,
    OPTIONS,
    SelectoOptions,
    PROPERTIES,
    SelectoProperties,
    EVENTS,
} from "selecto";
import { ref } from "framework-utils";
import { IObject } from "@daybrush/utils";
import { SelectoProps } from "./types";
import { REACT_EVENTS } from "./consts";

export default class Selecto extends React.PureComponent<Partial<SelectoProps>> {
    private selecto!: VanillaSelecto;
    private selectionElement!: HTMLElement;
    public render() {
        return <div className={CLASS_NAME} ref={ref(this, "selectionElement")}></div>;
    }
    public componentDidMount() {
        const props = this.props;
        const options: Partial<SelectoOptions> = {};

        OPTIONS.forEach(name => {
            if (name in props) {
                (options as any)[name] = props[name];
            }
        });
        this.selecto = new VanillaSelecto({
            ...options,
            target: this.selectionElement,
        });

        EVENTS.forEach((name, i) => {
            this.selecto.on(name, (e: any) => {
                const selfProps = this.props as any;
                const result = selfProps[REACT_EVENTS[i]] && selfProps[REACT_EVENTS[i]](e);

                if (result === false) {
                    e.stop();
                }
            });
        });
    }
    public componentDidUpdate(prevProps: Partial<SelectoProperties>) {
        const props = this.props;
        const selecto = this.selecto;

        PROPERTIES.forEach(name => {
            if (prevProps[name] !== props[name]) {
                (selecto as any)[name] = props[name];
            }
        });
    }
    public componentWillUnmount() {
        this.selecto.destroy();
    }
}
