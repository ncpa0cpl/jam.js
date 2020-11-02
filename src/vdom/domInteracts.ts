import VDOM from "./VDOM.js";
import { TreeBranch } from "./tree.js";

class HTMLDomInterface {
  static create(type: string) {
    return document.createElement(type);
  }

  static setStyle(dom: HTMLElement, property: string, value: string | number) {
    dom.style[<any>property] = typeof value === "number" ? value.toString() : value;
  }

  static replace(oldDom: HTMLElement, newDom: HTMLElement) {
    oldDom.parentNode?.replaceChild(newDom, oldDom);
  }

  static swap(parent: VDOM | HTMLElement, node1: VDOM | HTMLElement, node2: VDOM | HTMLElement) {
    parent = parent instanceof VDOM ? parent.generateElement() : parent;
    node1 = node1 instanceof VDOM ? node1.generateElement() : node1;
    node2 = node2 instanceof VDOM ? node2.generateElement() : node2;

    const node1clone = node1.cloneNode(true);
    const node2clone = node2.cloneNode(true);

    parent.replaceChild(node2clone, node1);
    parent.replaceChild(node1clone, node2);
  }

  static render(target: HTMLElement, tree: TreeBranch) {
    // const targetDOM = target instanceof VDOM ? target.generateElement() : target;
    if (target !== null) tree.mountTo(target);
    else console.error("Invalid html element");
    // HTMLDomInterface.printTo(targetDOM, vdom.generateElement());
  }

  static append(dst: HTMLElement, node: VDOM | HTMLElement) {
    dst.appendChild(node instanceof VDOM ? node.generateElement() : node);
  }

  static appendTextNode(dst: HTMLElement, str: string) {
    dst.appendChild(HTMLDomInterface.text(str));
  }

  static clear(target: VDOM | HTMLElement) {
    const targetDOM = target instanceof VDOM ? target.generateElement() : target;
    while (targetDOM.hasChildNodes()) {
      targetDOM.removeChild(targetDOM.firstChild!);
    }
  }

  static text(str: string) {
    return document.createTextNode(str);
  }

  // private static printTo(dst: HTMLElement, source: HTMLElement) {
  //     while(dst.hasChildNodes()) {
  //         dst.removeChild(dst.firstChild!);
  //     }
  //     dst.appendChild(source);
  // }

  static remove(target: HTMLElement) {
    target.remove();
  }
}

export { HTMLDomInterface };
