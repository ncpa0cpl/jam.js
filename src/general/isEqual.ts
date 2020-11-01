function isEqualObject(ob1: {[key: string]: any}, ob2: {[key: string]: any}) {
	const key1 = Object.keys(ob1);
	const key2 = Object.keys(ob2);

	if (!isEqual(key1, key2)) return false;

	for (const key of key1) {
		if (!ob2.hasOwnProperty(key)) {
			return false;
		}
		if (!isEqual(ob1[key], ob2[key])) {
			return false;
		}
	}
	return true;
}

function isEqualArray(arr1: any[], arr2: any[]) {
	if (arr1.length !== arr2.length) return false;

	for (const index in arr1) {
		if (!isEqual(arr1[index], arr2[index])) return false;
	}

	return true;
}

export default function isEqual(ob1: any, ob2: any) {
	if (typeof ob1 !== typeof ob2) return false;

	if (Array.isArray(ob1)) {
		return isEqualArray(ob1, ob2);
	}

	switch (typeof ob1) {
		case "object":
			return isEqualObject(ob1, ob2);
			break;
		case "function":
			if (ob1 === ob2) return true;
			else return ob1.toString() === ob2.toString();
			break;
		default:
			return ob1 === ob2;
			break;
	}
}
