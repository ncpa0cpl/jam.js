import { TrackedReference } from "../../../general/trackedRef.js";
import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure } from "../../../vdom/types.js";
import { CONTEXT_PARENT_PATH, CONTEXT_PATH_NAME } from "../constants.js";
import { LinkProps } from "./Link.types.js";

function open(context: TrackedReference, path: string) {
  window.history.pushState({}, "", path);
  context.current = path;
}

class Link extends VDC {
  clickHandler() {
    const currentParentPath = this.getContext(CONTEXT_PARENT_PATH);
    const pathRef = this.getContext(CONTEXT_PATH_NAME);

    const props = <LinkProps>this.getProps();

    const linkTo = props.to[0] === "/" ? props.to : `${currentParentPath}${props.to}/`;

    open(pathRef, linkTo);
  }

  render(props: LinkProps): Structure {
    const text = props.text;
    return {
      type: "div",
      childs: [
        {
          type: "button",
          content: text,
          events: {
            click: this.clickHandler.bind(this),
          },
        },
      ],
    };
  }
}

export { open, Link };
