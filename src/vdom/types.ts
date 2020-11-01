import { VDOMComponent } from "./VDOMComponent";

interface PropertyObject {
  [index: string]: any;
}

type VDOMGenerator = new (props: any) => VDOMComponent;

type Styles = { [index: string]: string | number };

interface BasicStructureBase {
  type: string;
  htmlAttributes?: { [index: string]: string };
  style?: Styles;
  events?: { [index: string]: Function };
  nodeProperties?: { [index: string]: string };
}

interface BasicContentStructure extends BasicStructureBase {
  content?: string;
}

interface BasicChildStructure extends BasicStructureBase {
  childs?: Structure[];
}

type BasicStructure = BasicChildStructure | BasicContentStructure;

interface ComponentStructure {
  type: string | VDOMGenerator;
  props?: PropertyObject;
}

type Structure = ComponentStructure | BasicStructure;

// interface Structure {
// 	type: string | VDOMGenerator;
// 	content?: string;
// 	htmlAttributes?: { [index: string]: string };
// 	style?: Styles;
// 	childs?: Structure[];
// 	props?: PropertyObject;
// 	events?: { [index: string]: Function };
// }

// interface BasicStructure extends Structure {
// 	type: string;
// }

interface Component {
  render(props: PropertyObject): Structure;
}

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
  Component,
  State,
  contextExtractorFn,
  contextSetterFn,
};
