import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import { StateContext } from "../../../context/state-context";

const Day = ({ day, rowIdx }) => {
	const [dayEvents, setDayEvents] = useState([]);

	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
	} = useContext(StateContext);

	useEffect(() => {
		const events = filteredEvents.filter(
			(evt) => day.valueOf() >= evt.startDate && day.valueOf() <= evt.endDate
		);
		setDayEvents(events);
	}, [filteredEvents, day]);

	const getCurrentDayClass = () => {
		return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
			? "bg-blue-600 text-white rounded-full w-7"
			: "";
	};

	return (
		<div className="border border-gray-200 flex flex-col">
			<header className="flex flex-col items-center">
				{rowIdx === 0 && (
					<p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>
				)}
				<p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>
					{day.format("DD")}
				</p>
			</header>
			<div
				className="flex-1 cursor-pointer"
				onClick={() => {
					setDaySelected(day);
					setShowEventModal(true);
				}}
			>
				{dayEvents
					.sort((a, b) => a.startDate - b.startDate)
					.map((evt, idx) => (
						<>
							{idx <= 4 &&
								(dayEvents.length > 5 && idx === 4 ? (
									<div className="bg-gray-200 rounded-xl mx-3" key={idx}>
										<p className="text-center">További események</p>
									</div>
								) : (
									<div
										key={idx}
										onClick={() => setSelectedEvent(evt)}
										className={`bg-${
											evt.label
										}-200 flex flex-row pl-5 items-center h-1/6 text-gray-600 text-sm mb-1 truncate ${
											evt.startDate === day.valueOf() && "ml-3 rounded-l-xl"
										} ${evt.endDate === day.valueOf() && "mr-3 rounded-r-xl"}`}
									>
										{evt.startDate === day.valueOf() && evt.title}
									</div>
								))}
						</>
					))}
			</div>
		</div>
	);
};

export default Day;
