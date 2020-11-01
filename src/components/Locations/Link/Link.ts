import { TrackedReference } from "../../../general/trackedRef.js";
import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure } from "../../../vdom/types.js";
import { CONTEXT_PATH_NAME } from "../constants.js";
import { LinkProps } from "./Link.types.js";

function open(context: TrackedReference, path: string) {
  const linkTo = path[0] === "/" ? path : `${window.location.pathname}/${path}/`;
  window.history.pushState({}, "", linkTo);
  context.current = linkTo;
}

class Link extends VDC {
  clickHandler() {
    const pathRef = this.getContext(CONTEXT_PATH_NAME);
    const props = <LinkProps>this.getProps();
    open(pathRef, props.to);
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
