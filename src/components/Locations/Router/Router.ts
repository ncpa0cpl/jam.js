import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure } from "../../../vdom/types.js";
import { CONTEXT_PARENT_PATH, CONTEXT_PATH_NAME } from "../constants.js";
import { RouterProps } from "./Router.types.js";
import { TrackedReference } from "../../../general/trackedRef.js";
import { Path } from "../Path/path.js";

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
    const currentLocation: string = window.location.pathname;
    const currentParentPath: string = this.getContext(CONTEXT_PARENT_PATH);

    const location = currentLocation
      .slice(currentParentPath.length)
      .split("/")
      .filter((p: string) => p.length > 0);

    const defaultRoute = props.routes.find(r => r.default !== undefined && r.default);

    const match = props.routes.find(r => location[0] === r.path);

    if (match !== undefined) {
      this.setContext(CONTEXT_PARENT_PATH, Path.join(currentParentPath, match.path));
      return {
        type: "div",
        htmlAttributes: {
          class: "jam_router",
        },
        childs: [match.page],
      };
    } else if (defaultRoute !== undefined) {
      const newpath = Path.join(currentParentPath, defaultRoute.path);
      console.log("new path: ", newpath);

      this.setContext(CONTEXT_PARENT_PATH, newpath);
      window.history.replaceState({}, "", newpath);
      return {
        type: "div",
        htmlAttributes: {
          class: "jam_router",
        },
        childs: [defaultRoute.page],
      };
    }
    return props.errorPage || ERROR_PAGE;
  }
}
