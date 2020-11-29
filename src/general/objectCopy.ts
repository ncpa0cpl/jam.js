function arrayCopy<T extends Array<any>>(arr: T): T {
	const copy: any[] = [];
	if(!Array.isArray(arr) || arr === null || arr === undefined) return copy as T;

	for (const elem in arr) {
		if (Array.isArray(arr[elem])) copy[elem] = arrayCopy(arr[elem]);
		else if (typeof arr[elem] === "object") copy[elem] = objectCopy(arr[elem]);
		else copy[elem] = arr[elem]
	}
	return copy as T;
}

function objectCopy<T extends Record<string, any>>(ob: T): T {
	const copy: Record<string, any> = {};
	if(typeof(ob) !== "object" || ob === null || ob === undefined) return copy as T;

	for (const prop of Object.keys(ob)) {
		if (Array.isArray(ob[prop])) copy[prop] = arrayCopy(ob[prop]);
		else if (typeof ob[prop] === "object") copy[prop] = objectCopy(ob[prop]);
		else copy[prop] = ob[prop];
	}
	return copy as T;
}

export { objectCopy, arrayCopy };
