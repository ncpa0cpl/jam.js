import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure, ComponentStructure } from "../../../vdom/types.js";
import { CONTEXT_PARENT_PATH, CONTEXT_PATH_NAME } from "../constants.js";
import { TrackedReference } from "../../../general/trackedRef.js";
import { DynamicRouterProps } from "./DynamicRouter.types.js";

export default class DynamicRouter extends VDC {
  protected listener: number;
  constructor(props: DynamicRouterProps) {
    super(props);

    const pathRef = this.retrieveLocation();
    this.listener = pathRef.addListener(() => {
      this.updateState();
    });
  }

  retrieveLocation(): TrackedReference {
    const loc = this.getContext(CONTEXT_PATH_NAME);
    if (loc === undefined) {
      throw Error("conext is undefined");
    }
    return loc;
  }

  componentWillUnmount() {
    const pathRef = this.retrieveLocation();
    pathRef.removeListener(this.listener);
  }

  render(props: DynamicRouterProps): Structure {
    const currentLocation: string = window.location.pathname;
    const currentParentPath: string = this.getContext(CONTEXT_PARENT_PATH);

    const location = currentLocation.slice(currentParentPath.length);

    const page = <ComponentStructure>props.page;
    page.props = page.props ? { ...page.props, routeVariable: location } : { routeVariable: location };

    return {
      type: "div",
      htmlAttributes: {
        class: "jam_router",
      },
      childs: [page],
    };
  }
}
