import { PropertyObject, Structure, State, contextExtractorFn, contextSetterFn } from "./types.js";
import { TreeBranch } from "./tree.js";
import isEqual from "../general/isEqual.js";
import { objectCopy } from "../general/objectCopy.js";

abstract class VDOMComponent<T extends Record<string, any>> {
  properties: T = {} as T;
  protected state: State = {};
  protected updateCallback: Function = () => {};
  protected contextMethods: [contextExtractorFn, contextSetterFn] = [() => {}, () => {}];

  constructor(props: T) {
    this.updateProps(props);
    this.contextMethods = props["__context__methods__"];
  }

  setContext(name: string, value: any) {
    this.contextMethods[1](name, value);
  }

  getContext(name: string) {
    return this.contextMethods[0](name);
  }

  updateProps(newProps: T) {
    if (isEqual(newProps, this.properties)) return;
    this.properties = newProps;
  }

  updateState() {
    this.updateCallback();
  }

  getProps(): T {
    return objectCopy(this.properties);
  }

  render(props: T): Structure {
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

    return tree;
  }
}

export { VDOMComponent };

interface VDC<T> {
  render(props: T): void;
}

interface testProps {
  prop1: string;
  prop2: number;
}

class Test extends VDOMComponent<testProps>{
  constructor(props: testProps) {
    super(props);
    const p = this.getProps();
  }
  render(props: testProps) {
    return { type: "div" };
  }
}

type ConstructorArgument<T extends new (k: any) => any> = T extends new (k: any) => infer I ? I : never;



function Struct<T extends new (props: any) => { properties: Record<string, any> }>(def: {type: T} & ComponentProps<ConstructorArgument<T>["properties"]>) {
  return def;
}

type ComponentProps<T extends Record<string, any>> = {
  props?: T;
  childs?: Array<Structure | 'string'>;
} & T;

const a = Struct({type: Test, prop1: '', prop2: 1, childs: [Struct({type: Test, prop1: '', prop2: 1})]});