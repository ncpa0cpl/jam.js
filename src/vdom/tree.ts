import {
  VDOMGenerator,
  Structure,
  PropertyObject,
  Styles,
  ComponentStructure,
  BasicContentStructure,
  BasicChildStructure,
  BasicStructure,
  contextExtractorFn,
} from "./types.js";
import VDOM from "./VDOM.js";
import { VDOMComponent } from "./VDOMComponent.js";
import { EventHandler } from "./EventHandler.js";
import isEqual from "../general/isEqual.js";
import { objectCopy } from "../general/objectCopy.js";
import { HTMLDomInterface as DI } from "./domInteracts.js";

class Tree {
  static createVDOM(structure: BasicStructure) {
    let vd = new VDOM(structure.type);
    if (structure.htmlAttributes)
      for (const att in structure.htmlAttributes) {
        vd.setAttribute(att, structure.htmlAttributes[att]);
      }
    if (structure.style)
      for (const property in structure.style) {
        vd.setStyle(property, structure.style[property]);
      }
    if (structure.nodeProperties)
      for (const property in structure.nodeProperties) {
        vd.setNodeProperty(property, structure.nodeProperties[property]);
      }
    if (structure.hasOwnProperty("content")) vd.appendText((<BasicContentStructure>structure).content!);
    return vd;
  }
}

class TreeBranch {
  protected id: number;
  protected vdom: VDOM | null = null;
  protected isDestroyed: boolean = false;
  protected lastStructure: Structure = { type: "div" };
  protected externalStruct: Structure;
  protected childs: TreeBranch[] = [];
  protected singleDescendant: TreeBranch | null = null;
  protected eventHandler: EventHandler | null = null;
  protected context: { [index: string]: any } = {};
  protected parentContextExtractor: contextExtractorFn;
  protected propsRef?: PropertyObject;

  component: VDOMComponent | null = null;

  constructor(struct: Structure, parentContextExtractor: contextExtractorFn) {
    this.id = Math.round(Math.random() * 1000);
    this.parentContextExtractor = parentContextExtractor;
    this.externalStruct = <Structure>objectCopy(struct);
    this.initiate(struct);
  }

  extractContextVariable(name: string) {
    if (this.context.hasOwnProperty(name)) return this.context[name];
    return this.parentContextExtractor(name);
  }

  setContextVariable(name: string, value: any): void {
    this.context[name] = value;
  }

  getType() {
    return this.externalStruct.type;
  }

  initiate(struct: Structure) {
    this.createFromStruct(struct);

    if (this.vdom) {
      this.eventHandler = new EventHandler(this.vdom);
      if (struct.hasOwnProperty("events")) {
        const self = this;
        Object.keys((<BasicStructure>struct).events!).forEach(e => {
          self.newEvent(e, (<BasicStructure>struct).events![e]);
        });
      }
    }
  }

  newEvent(event: string, callback: Function) {
    this.eventHandler?.new(event, callback);
  }

  removeEvent(e: { event: string; callback: Function }) {
    this.eventHandler?.remove(e.event);
  }

  setComponent(parentComponent: VDOMComponent) {
    this.component = parentComponent;
    this.component.onComponentUpdate(() => this.checkForStateUpdates());
  }

  createFromStruct(struct: Structure) {
    if (typeof struct.type !== "string") {
      const props: { [index: string]: any } = struct.hasOwnProperty("props")
        ? objectCopy((<ComponentStructure>struct).props!)
        : {};
      props["__context__methods__"] = [this.extractContextVariable.bind(this), this.setContextVariable.bind(this)];

      this.propsRef = props;
      const newComponent = new struct.type(props);
      this.setComponent(newComponent);
      const newStruct = this.component!.render(props);
      this.generateContent(newStruct);
      this.lastStructure = <Structure>objectCopy(newStruct);
    } else {
      this.generateBasicVDOM(struct);
    }
  }

  generateContent(struct: Structure) {
    if (typeof struct.type !== "string") {
      const props = struct.hasOwnProperty("props") ? objectCopy((<ComponentStructure>struct).props!) : {};
      const newComponent = new struct.type(props);

      this.singleDescendant = new TreeBranch(newComponent.render(props), this.extractContextVariable.bind(this));
    } else {
      this.generateBasicVDOM(struct);
    }
  }

  generateBasicVDOM(struct: Structure) {
    if (typeof struct.type === "string") {
      this.vdom = Tree.createVDOM({ ...struct, type: struct.type });
      if (struct.hasOwnProperty("childs"))
        for (const childStruct of (<BasicChildStructure>struct).childs!) {
          this.pushChild(childStruct);
        }
    }
  }

  checkForStateUpdates() {
    if (this.component && !this.isDestroyed) {
      const newStruct = this.component.render(this.propsRef || {});

      if (isEqual(newStruct, this.lastStructure)) return 0;

      this.checkForInternalChanges(newStruct);
    }
  }

  // checkForChanges:
  // returns -1 for different types,
  // 0 for no changes,
  // 1 for self change,
  // 2 for child change,
  // 3 for self and child changes

  checkForChanges(oldStruct: Structure, newStruct: Structure) {
    if (oldStruct.type !== newStruct.type) return -1;
    else {
      let c = 0;
      if (!isEqual({ ...newStruct, childs: [] }, { ...oldStruct, childs: [] })) {
        c += 1;
      }

      const newChilds = newStruct.hasOwnProperty("childs") ? (<BasicChildStructure>newStruct).childs! : [];
      if (!isEqual(newChilds, oldStruct.hasOwnProperty("childs") ? (<BasicChildStructure>oldStruct).childs! : [])) {
        c += 2;
      }
      return c;
    }
  }

  checkForInternalChanges(struct: Structure) {
    this.applyChanges(struct, this.lastStructure);
    this.lastStructure = <Structure>objectCopy(struct);
    return 1;
  }

  checkForExternalChanges(struct: Structure) {
    this.applyChanges(struct, this.externalStruct);
    this.externalStruct = <Structure>objectCopy(struct);
    return 1;
  }

  applyChanges(s1: Structure, s2: Structure) {
    switch (this.checkForChanges(s1, s2)) {
      case -1:
        return 0;
        break;
      case 1:
        this.updateSelf(s1);
        break;
      case 2:
        this.updateChilds(s1.hasOwnProperty("childs") ? (<BasicChildStructure>s1).childs! : []);
        break;
      case 3:
        this.updateSelf(s1);
        this.updateChilds(s1.hasOwnProperty("childs") ? (<BasicChildStructure>s1).childs! : []);
        break;
    }

    if (typeof s1.type === "string")
      this.updateSelfEvents(s1.hasOwnProperty("events") ? (<BasicStructure>s1).events! : {});
  }

  updateSelf(structure: Structure) {
    let oldStruct: Structure;
    if (this.component) oldStruct = this.lastStructure;
    else oldStruct = this.externalStruct;

    if (typeof structure.type === "string") {
      this.updateSelfAttributes(
        structure.hasOwnProperty("htmlAttributes") ? (<BasicStructure>structure).htmlAttributes! : {},
        oldStruct.hasOwnProperty("htmlAttributes") ? (<BasicStructure>oldStruct).htmlAttributes! : {}
      );

      if (oldStruct.hasOwnProperty("content") || structure.hasOwnProperty("content"))
        this.updateSelfContent(structure.hasOwnProperty("content") ? (<BasicContentStructure>structure).content! : "");

      this.updateSelfStyle(
        structure.hasOwnProperty("style") ? (<BasicStructure>structure).style! : {},
        oldStruct.hasOwnProperty("style") ? (<BasicStructure>oldStruct).style! : {}
      );

      this.updateSelfNodeProperties(
        structure.hasOwnProperty("nodeProperties") ? (<BasicStructure>structure).nodeProperties! : {},
        oldStruct.hasOwnProperty("nodeProperties") ? (<BasicStructure>oldStruct).nodeProperties! : {}
      );
    }
  }

  updateSelfNodeProperties(newProps: { [index: string]: any }, oldProps: { [index: string]: any }) {
    for (const p in newProps) {
      if (newProps[p] !== oldProps[p]) this.vdom?.setNodeProperty(p, newProps[p]);
    }
  }

  updateSelfAttributes(newAttribs: { [index: string]: string }, oldAttribs: { [index: string]: string }) {
    for (const attribName in oldAttribs) {
      if (!newAttribs.hasOwnProperty(attribName)) this.vdom?.removeAttribute(attribName);
    }
    for (const attribName in newAttribs) {
      if (oldAttribs[attribName] !== newAttribs[attribName])
        this.vdom?.setAttribute(attribName, newAttribs[attribName]);
    }
  }

  updateSelfStyle(style: Styles, oldStyles: Styles) {
    for (const prop in oldStyles) {
      if (!style.hasOwnProperty(prop)) this.vdom?.setStyle(prop, "");
    }
    for (const prop in style) {
      if (style[prop] !== oldStyles[prop]) this.vdom?.setStyle(prop, style[prop]);
    }
  }

  updateSelfContent(newContent: string) {
    this.vdom?.setText(newContent);
  }

  updateSelfEvents(events: PropertyObject) {
    const self = this;

    for (const e of Object.keys(events)) {
      if (!self.eventHandler?.exists(e)) {
        self.newEvent(e, events[e]);
      } else {
        self.eventHandler.update(e, events[e]);
      }
    }

    if (this.eventHandler !== null)
      for (const e of this.eventHandler.allActiveEvents()) {
        if (!Object.keys(events).includes(e)) this.eventHandler.remove(e);
      }
  }

  updateSelfProps(newProps: PropertyObject) {
    if (this.singleDescendant) {
      this.singleDescendant.updateSelfProps(newProps);
      this.singleDescendant.checkForStateUpdates();
    } else if (this.component) {
      this.propsRef = objectCopy(newProps);
      this.component.componentWillUpdate(newProps);
      this.component.updateProps(this.propsRef);
    }
  }

  updateChilds(childsStructures: Structure[]) {
    if (this.childs.length > childsStructures.length) {
      for (const child in this.childs) {
        const c = parseInt(child);
        if (childsStructures[c]) this.updateSingleChild(c, childsStructures[c]);
        else this.childs[c].destroy();
      }
      this.childs = this.childs.slice(0, childsStructures.length);
    } else {
      for (const child in childsStructures) {
        const c = parseInt(child);
        if (this.childs[c]) this.updateSingleChild(c, childsStructures[c]);
        else this.pushChildAndMount(childsStructures[c]);
      }
    }
  }

  externalStructUpdate(struct: Structure) {
    if (typeof this.getType() === "string") {
      this.checkForExternalChanges(struct);
    } else {
      this.updateSelfProps(struct.hasOwnProperty("props") ? (<ComponentStructure>struct).props! : {});
      this.checkForStateUpdates();
    }
  }

  updateSingleChild(index: number, struct: Structure) {
    if (this.childs[index].getType() !== struct.type) {
      let prev = <TreeBranch>this.childs[index];
      this.childs[index] = <TreeBranch>new TreeBranch(struct, this.extractContextVariable.bind(this));

      prev.getVDOM().replace(this.childs[index].getVDOM());

      this.childs[index].onMount();

      prev.destroy();
    } else {
      this.childs[index].externalStructUpdate(struct);
    }
  }

  destroy() {
    this.component?.componentWillUnmount();
    for (const c of this.childs) {
      c.destroy();
    }
    this.isDestroyed = true;
    this.vdom?.destroy();
    this.singleDescendant?.destroy();
    this.vdom = null;
    this.singleDescendant = null;
    this.childs = [];
  }

  mountTo(target: HTMLElement) {
    DI.append(target, this.getVDOM());
    this.onMount();
  }

  onMount() {
    if (this.vdom)
      for (const child of this.childs) {
        child.mountTo(this.vdom.generateElement());
      }
    this.component?.componentMount(this.getVDOM());
  }

  pushChild(structure: Structure) {
    const child = new TreeBranch(structure, this.extractContextVariable.bind(this));

    this.childs.push(child);
    return child;
  }

  pushChildAndMount(structure: Structure) {
    this.pushChild(structure).mountTo(this.vdom!.generateElement());
  }

  getVDOM(ommitDescendant: boolean = false): VDOM {
    if (this.vdom) return this.vdom;
    else if (this.singleDescendant && !ommitDescendant) return this.singleDescendant.getVDOM();
    else throw Error("Missing VDOM, some component render function may be invalid.");
  }
}

export { TreeBranch };
