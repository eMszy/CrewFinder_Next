export const uniqueArray = (array1 = [], array2 = []) => {
	let updatedArray = {};
	array1.forEach((arr1) => {
		updatedArray = { ...updatedArray, [arr1.id]: { ...arr1 } };
	});
	array2.forEach((arr2) => {
		updatedArray = { ...updatedArray, [arr2.id]: { ...arr2 } };
	});
	return Object.values(updatedArray);
};

export const addPosHelper = (
	pos,
	id,
	baseCrew,
	invitionType = { name: "open" },
	name = ""
) => {
	if (pos && pos !== "") {
		const updatedPos = [
			...baseCrew,
			{ id: id + Math.random(), pos, name, invitionType },
		];
		return updatedPos;
	}
	return false;
};
