import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure } from "../../../vdom/types.js";
import { CONTEXT_PARENT_PATH, CONTEXT_PATH_NAME } from "../constants.js";
import { Path } from "../Path/path.js";
import { LinkProps } from "./Link.types.js";

function open<T extends VDC>(path: string, from: T) {
  const pathRef = from.getContext(CONTEXT_PATH_NAME);
  window.history.pushState({}, "", path);
  pathRef.current = path;
}

class Link extends VDC {
  clickHandler() {
    const currentParentPath = this.getContext(CONTEXT_PARENT_PATH);
    const props = <LinkProps>this.getProps();
    const linkTo = props.to[0] === "/" ? props.to : Path.join(currentParentPath, props.to);
    open(linkTo, this);
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
