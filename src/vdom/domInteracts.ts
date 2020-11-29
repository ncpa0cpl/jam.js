interface HTMLElem extends HTMLElement {
  [key: string]: any;
}

class HTMLDomInterface {
  static create(type: string) {
    return document.createElement(type);
  }

  static setAttribute(elem: HTMLElement, name: string, value: string) {
    elem.setAttribute(name, value);
  }

  static setStyle(dom: HTMLElement, property: string, value: string | number) {
    dom.style[<any>property] = typeof value === "number" ? value.toString() : value;
  }

  static setEvent(dom: HTMLElement, event: string, callback: (...args: any[]) => void) {
    dom.addEventListener(event, callback);
  }

  static setNodeProperty(dom: HTMLElem, name: string, value: any) {
    dom[name] = value;
  }

  static replace(oldDom: HTMLElement, newDom: HTMLElement) {
    oldDom.parentNode?.replaceChild(newDom, oldDom);
  }

  static swap(parent: HTMLElement, node1: HTMLElement, node2: HTMLElement) {
    const node1clone = node1.cloneNode(true);
    const node2clone = node2.cloneNode(true);

    parent.replaceChild(node2clone, node1);
    parent.replaceChild(node1clone, node2);
  }

  // static render(target: HTMLElement, tree: TreeBranch) {
  //   // const targetDOM = target instanceof VDOM ? target.generateElement() : target;
  //   if (target !== null) tree.mountTo(target);
  //   else console.error("Invalid html element");
  //   // HTMLDomInterface.printTo(targetDOM, vdom.generateElement());
  // }

  static append(dst: HTMLElement, node: HTMLElement) {
    dst.appendChild(node);
  }

  static appendTextNode(dst: HTMLElement, str: string) {
    dst.appendChild(HTMLDomInterface.text(str));
  }

  static clear(target: HTMLElement) {
    const targetDOM = target;
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
