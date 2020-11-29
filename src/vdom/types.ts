import { VDOMComponent } from "./VDOMComponent";

interface PropertyObject {
  [index: string]: any;
}

type VDOMGenerator = new (props: any) => Object;

type Styles = { [index: string]: string | number };

interface BasicStructureBase {
  type: string;
  htmlAttributes?: { [index: string]: string };
  style?: Styles;
  events?: { [index: string]: Function };
  nodeProperties?: { [index: string]: string };
  key?: string;
}

interface BasicContentStructure extends BasicStructureBase {
  content?: string;
}

interface BasicChildStructure extends BasicStructureBase {
  childs?: Array<Structure | string>;
}

type BasicStructure = BasicChildStructure | BasicContentStructure;

interface ComponentStructure {
  type: string | VDOMGenerator;
  key?: string;
  props?: PropertyObject;
  [key: string]: any;
}

type Structure = ComponentStructure | BasicStructure;

// interface Component {
//   render(props: T): Structure;
//   getProps(): T;
// } 

interface State {
  [index: string]: any;
}

type contextExtractorFn = (name: string) => any;
type contextSetterFn = (name: string, value: any) => void;

export {
  PropertyObject,
  VDOMGenerator,
  Structure,
  BasicStructure,
  ComponentStructure,
  BasicContentStructure,
  BasicChildStructure,
  Styles,
  // Component,
  State,
  contextExtractorFn,
  contextSetterFn,
};
