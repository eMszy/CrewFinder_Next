import dayjs from "dayjs";

export const eventLoaderHandler = (filteredEvents, day) => {
	let events = [];
	filteredEvents.forEach((event) => {
		if (event.label === 1) {
			let isExist = event.dates.find(
				(d) =>
					dayjs(d.startTime).format("YYMMDD") === dayjs(day).format("YYMMDD")
			);
			if (isExist) {
				events.push(event);
			}
		} else {
			let eventId = [];
			event.positions.forEach((pos) => {
				let isExist = pos.date.find(
					(d) =>
						dayjs(d.startTime).format("YYMMDD") === dayjs(day).format("YYMMDD")
				);

				if (isExist && !eventId.includes(event._id)) {
					events.push(event);
					eventId.push(event._id);
				}
			});
		}
	});
	return events;
};

export const posCounterPerDay = (evt, day) => {
	let eventsNum = 0;
	evt.positions.forEach((p) =>
		p.date.forEach((d) => {
			if (day.format("YYYYMMDD") === d.id.toString()) {
				eventsNum++;
			}
		})
	);
	return eventsNum;
};
