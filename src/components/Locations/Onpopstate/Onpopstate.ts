class Onpopstate {
    static lastId: number = 0;
    static callbacks: {id: number, callback: Function}[] = [];
    
    static addListener(callback: Function) {
        const id = Onpopstate.lastId++;
        Onpopstate.callbacks.push({id: id, callback: callback});
        return id;
    }

    static removeListener(id: number) {
        Onpopstate.callbacks = Onpopstate.callbacks.filter(entry => entry.id !== id);
    }

    static executeCallbacks(e: any) {
        for(let entry of Onpopstate.callbacks) {
            entry.callback(e);
        }
    }
}

window.onpopstate = Onpopstate.executeCallbacks;

export {
    Onpopstate
}