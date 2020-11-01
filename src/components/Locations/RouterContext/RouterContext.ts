import { trackedRef } from "../../../general/trackedRef.js";
import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { PropertyObject, Structure } from "../../../vdom/types.js";
import { CONTEXT_PARENT_PATH, CONTEXT_PATH_NAME } from "../constants.js";
import { Onpopstate } from "../Onpopstate/Onpopstate.js";
import { RouterContextProps } from "./RouterContext.types.js";

export default class RouterContext extends VDC {
  protected listener: number;

  constructor(props: any) {
    super(props);
    const ref = trackedRef(window.location.pathname);

    this.setContext(CONTEXT_PATH_NAME, ref);
    this.listener = Onpopstate.addListener(() => {
      ref.current = window.location.pathname;
    });

    this.setContext(CONTEXT_PARENT_PATH, "/");
  }

  componentWillUnmount() {
    Onpopstate.removeListener(this.listener);
  }

  render(props: RouterContextProps): Structure {
    return {
      type: "div",
      htmlAttributes: { class: "router_context" },
      childs: props.childs,
    };
  }
}
