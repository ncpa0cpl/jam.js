import { PropertyObject, Structure, Component, State, contextExtractorFn, contextSetterFn } from "./types.js";
import { TreeBranch } from "./tree.js";
import isEqual from "../general/isEqual.js";
import { arrayCopy, objectCopy } from "../general/objectCopy.js";
import { KeyObject } from "../types/types.js";

class VDOMComponent implements Component {
  protected properties: PropertyObject = {};
  protected state: State = {};
  protected updateCallback: Function = () => {};
  protected contextMethods: [contextExtractorFn, contextSetterFn] = [() => {}, () => {}];

  constructor(props: PropertyObject) {
    this.updateProps(props);
    this.contextMethods = props["__context__methods__"];
  }

  setContext(name: string, value: any) {
    this.contextMethods[1](name, value);
  }

  getContext(name: string) {
    return this.contextMethods[0](name);
  }

  updateProps(newProps: PropertyObject) {
    if (isEqual(newProps, this.properties)) return;
    this.properties = newProps;
  }

  updateState() {
    this.updateCallback();
  }

  props(): PropertyObject {
    return objectCopy(this.properties);
  }

  render(props: PropertyObject): Structure {
    return { type: "div" };
  }

  onComponentUpdate(callback: Function) {
    this.updateCallback = callback;
  }

  componentMount(a?: any) {}

  componentWillUnmount() {}

  componentWillUpdate(newProps: PropertyObject) {}

  static initiate(structure: Structure) {
    let tree = new TreeBranch(structure, () => undefined);
    console.log(tree);

    return tree;
  }
}

export { VDOMComponent };
