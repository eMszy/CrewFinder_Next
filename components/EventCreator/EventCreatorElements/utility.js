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

// export const onChangeHandle = (value, name, updatingArray) => {
// 	//ha csak mentem nem rendereli újra és a régi adat marad benne

// 	const changedData = [{ ...updatingArray[id], [name]: value }];
// 	console.log("UA", value, name, updatingArray);
// 	const updatedArray = uniqueArray(updatingArray, changedData);
// 	return updatedArray;
// };

// export const addPosHandel = (
// 	pos,
// 	id,
// 	name = "",
// 	invitionType = { name: "open" }
// ) => {
// 	if (pos && pos !== "") {
// 		const updatedPos = [
// 			...crewMembers,
// 			{ id: id + Math.random(), pos, name, invitionType },
// 		];
// 		setCrewMembers(updatedPos);
// 	}
// };
