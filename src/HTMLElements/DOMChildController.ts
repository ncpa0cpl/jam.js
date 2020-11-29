import { Structure } from "../vdom/types";

export default class DOMChildController {
    parent: HTMLElement;
    childList: Array<Structure | string>;
    constructor(initialChilds: Array<Structure | string>, parent: HTMLElement) {
        this.childList = initialChilds;
        this.parent = parent;
    }
}