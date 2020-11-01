import { VDOMComponent as VDC } from "../../../vdom/index.js";
import { Structure } from "../../../vdom/types.js";
import { CONTEXT_PATH_NAME } from "../constants.js";
import { LinkProps } from "./Link.types.js";

export default class Link extends VDC {
  clickHandler() {
    const props = <LinkProps>this.getProps();
    const linkTo = props.to[0] === "/" ? props.to : `${window.location.pathname}/${props.to}/`;
    window.history.pushState({}, "", linkTo);

    const pathRef = this.getContext(CONTEXT_PATH_NAME);
    pathRef.current = linkTo;
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
