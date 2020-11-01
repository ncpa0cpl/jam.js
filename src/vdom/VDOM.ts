import {HTMLDomInterface as DI} from "./domInteracts.js";

interface HTMLElem extends HTMLElement {
    [key: string]: any;
}

export default class VDOM {
    private realDOM: HTMLElement;
    //private childs: {vdom: VDOM, structure: PropertyObject}[];
    // private childsAllowed: boolean = true;

    constructor(type: string | HTMLElement) {
        this.realDOM = typeof(type) === "string" ? DI.create(type) : type;
        //this.childs = [];
    }

    // allowChilds(val: boolean) {
    //     this.childsAllowed = val;
    // }

    listenFor(event: string, callback: Function) {
        this.realDOM.addEventListener(event, e => callback(e));
    }

    setStyle(property: string, value: string | number) {
        DI.setStyle(this.realDOM, property, value);
    }

    setAttribute(name: string, value: string) {
        this.realDOM.setAttribute(name, value);
    }

    removeAttribute(name: string) {
        this.realDOM.removeAttribute(name);
    }

    setNodeProperty(name: string, value: any) {
        const e = <HTMLElem>this.realDOM;
        e[name] = value;
    }

    setText(str: string) {
        DI.clear(this.realDOM);
        this.appendText(str);
    }

    appendText(str: string) {
        DI.appendTextNode(this.realDOM, str);
    }

    replace(newVdom: VDOM) {
        DI.replace(this.realDOM, newVdom.generateElement());
    }

    append(newChild: VDOM | string) {
        // if(!this.childsAllowed) throw Error("You can not append objects to text elements! Did you wanted to use appendText()?");

        let newChildVDOM: VDOM;
        if(newChild instanceof VDOM) newChildVDOM = newChild;
        else {
            newChildVDOM = new VDOM("p");
            newChildVDOM.appendText(newChild);
        }
        DI.append(this.realDOM, newChildVDOM);
        //this.childs.push({vdom: newChildVDOM, structure: childStructure});

        return this;
    }

    getParent() {
        if(this.realDOM.parentElement)
            return new VDOM(this.realDOM.parentElement);
        return null;
    }

    destroy() {
        DI.clear(this.realDOM);
        DI.remove(this.realDOM);
    }

    // didChildChange(index: number, structure: PropertyObject) {
    //     // console.group("child "+index);
    //     // console.log(structure);
    //     // console.log(this.childs[index].structure);
    //     // console.log(!isEqual(structure, this.childs[index].structure));
    //     // console.groupEnd();
        
    //     return !isEqual(structure, this.childs[index].structure);
    // }

    // updateChild(index: number, structure: PropertyObject) {
    // }

    generateElement(): HTMLElement {
        return this.realDOM;
    }
}