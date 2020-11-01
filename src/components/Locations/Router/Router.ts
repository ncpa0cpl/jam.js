import { objectCopy } from "../../../general/objectCopy.js";
import { trackedRef } from "../../../general/trackedRef.js";
import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure } from "../../../vdom/types.js";
import { CONTEXT_PARENT_PATH, CONTEXT_PATH_NAME } from "../constants.js";
import { Onpopstate } from "../Onpopstate/Onpopstate.js";
import { RouterProps } from "./Router.types.js";
import { TrackedReference } from "../../../general/trackedRef.js";

const ERROR_PAGE = {
  type: "div",
  content: "Page you are looking for doesn't exist.",
};

export default class Router extends VDC {
  protected listener: number;
  constructor(props: RouterProps) {
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

  render(props: RouterProps): Structure {
    const currentLocation = this.retrieveLocation();

    const location = <[]>currentLocation!.current.split("/").filter((p: string) => p.length > 0);

    const defaultRoute = props.routes.find(r => r.default !== undefined && r.default);

    const match = props.routes.find(r => location[location.length - 1] === r.path);

    if (match !== undefined) {
      const currentParentPath = this.getContext(CONTEXT_PARENT_PATH);
      this.setContext(CONTEXT_PARENT_PATH, `${currentParentPath}${match.path}/`);
      return match.page;
    }
    if (defaultRoute !== undefined) {
      return defaultRoute.page;
    }
    return props.errorPage || ERROR_PAGE;
  }
}