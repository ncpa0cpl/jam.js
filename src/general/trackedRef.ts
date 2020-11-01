interface Ref {
  current: any;
}

class TrackedReference {
  protected callbackStack: { id: number; callback: Function }[] = [];
  protected reference: Ref;
  protected lastId: number = 0;

  constructor(ref: Ref) {
    this.reference = ref;
  }

  addListener(callback: Function) {
    const id = this.lastId++;
    this.callbackStack.push({ id: id, callback: callback });
    return id;
  }

  removeListener(id: number) {
    this.callbackStack = this.callbackStack.filter(entry => entry.id !== id);
  }

  get current(): any {
    return this.reference.current;
  }

  set current(newVal: any) {
    if (newVal !== this.current) {
      this.reference.current = newVal;
      for (let c of this.callbackStack) {
        c.callback(newVal);
      }
    }
  }
}

function trackedRef(val: any) {
  const ref: Ref = { current: val };
  return new TrackedReference(ref);
}

export { TrackedReference, trackedRef };
