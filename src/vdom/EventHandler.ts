import VDOM from "./VDOM";

class VirtualEvent {
  // private callbackList = new CallbackList();
  private callback: Function = () => {};

  constructor(target: VDOM, event: string) {
    target.listenFor(event, this.handler.bind(this));
  }

  addCallback(callback: Function) {
    return (this.callback = callback);
  }

  removeCallback() {
    this.callback = () => {};
  }

  handler(e: Event) {
    this.callback(e);
  }
}

class EventHandler {
  private target: VDOM;
  private listeners: { [key: string]: VirtualEvent } = {};
  constructor(vdom: VDOM) {
    this.target = vdom;
  }

  allActiveEvents() {
    return Object.keys(this.listeners);
  }

  exists(event: string) {
    return Object.keys(this.listeners).includes(event);
  }

  update(event: string, callback: Function) {
    if (this.listeners.hasOwnProperty(event)) {
      return this.listeners[event].addCallback(callback);
    }
    return this.new(event, callback);
  }

  new(event: string, callback: Function) {
    if (!this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = new VirtualEvent(this.target, event);
    }
    return this.listeners[event].addCallback(callback);
  }

  remove(event: string) {
    if (this.listeners[event]) this.listeners[event].removeCallback();
    delete this.listeners[event];
  }
}

export { EventHandler };
