import { HTMLDomInterface as DI, VDOMComponent } from "../vdom/index";
import { Structure, Styles } from "../vdom/types";
import DOMChildController from "./DOMChildController";

interface DOMElementProps {
  htmlAttributes?: { [index: string]: string };
  style?: Styles;
  events?: { [index: string]: (...args: any[]) => void };
  nodeProperties?: { [index: string]: string };
  childs?: Array<Structure | string>;
}

export default class DOMElement extends VDOMComponent<DOMElementProps> {
    private defaultElementName = 'div';
    protected element: HTMLElement;
    protected childController: DOMChildController;
    constructor(props: DOMElementProps) {
        super(props);
        this.element = DI.create(this.defaultElementName);
        this.applyAttributes(props.htmlAttributes || {});
        this.applyStyle(props.style || {});
        this.applyEvents(props.events || {});
        this.applyProperties(props.nodeProperties || {});
        this.childController = new DOMChildController(props.childs || [], this.element);
    }

    applyAttributes(attributes: Record<string, string>) {
        for(const [key, value] of Object.entries(attributes)) {
            DI.setAttribute(this.element, key, value);
        }
    }

    applyStyle(style: Styles) {
        for(const [key, value] of Object.entries(style)) {
            DI.setStyle(this.element, key, value);
        }
    }

    applyEvents(events: Record<string, (...args: any[]) => void>) {
        for(const [key, value] of Object.entries(events)) {
            DI.setEvent(this.element, key, value);
        }
    }

    applyProperties(attributes: Record<string, string | number>) {
        for(const [key, value] of Object.entries(attributes)) {
            DI.setNodeProperty(this.element, key, value);
        }
    }

    mountTo(elem: HTMLElement) {
        DI.append(elem, this.element);
        return this.childController;
    }

    render() {
        return {type: DOMElement};
    }
}
