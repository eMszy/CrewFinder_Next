import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

import User from "../../models/user";
import Event from "../../models/event";

// import { clearImage } from "../util/file.js";

const YMDHM = {
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
};

const YMD = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
};

const AuthFailMsg = (isAuth) => {
	if (!isAuth) {
		const error = new Error("Nem vagy bejelentkezve!");
		error.code = 401;
		throw error;
	}
};

const IsExist = (element, msg) => {
	if (!element) {
		const error = new Error(`Nincs ilyen ${msg}`);
		error.code = 404;
		throw error;
	}
};

const returnObject = (data) => {
	return {
		...data._doc,
		_id: data._id.toString(),
		createdAt: data.createdAt.toLocaleString("hu-HU", YMDHM),
		updatedAt: data.updatedAt.toLocaleString("hu-HU", YMDHM),
	};
};

export const resolvers = {
	Query: {
		// login: async (obj, { email, password }, context, info) => {
		// 	const user = await User.findOne({ email: email });
		// 	if (!user) {
		// 		const error = new Error("Ezzel az email címmel még nem regisztráltak");
		// 		error.code = 401;
		// 		throw error;
		// 	}
		// 	const isEqual = await bcrypt.compare(password, user.password);
		// 	if (!isEqual) {
		// 		const error = new Error("Helytelen jelszó");
		// 		error.code = 401;
		// 		throw error;
		// 	}
		// 	const token = jwt.sign(
		// 		{
		// 			userId: user._id.toString(),
		// 			email: user.email,
		// 		},
		// 		process.env.SECRET_WORD,
		// 		{ expiresIn: "1h" }
		// 	);
		// 	console.log("user", user.userData.connectInfo);
		// 	return {
		// 		token: token,
		// 		userId: user._id.toString(),
		// 		userData: {
		// 			name: user.name,
		// 			userData: {
		// 				connectInfo: { nickName: user.userData.connectInfo.nickName },
		// 			},
		// 		},
		// 		metaData: user.metaData,
		// 	};
		// },

		user: async (obj, { id }, { isAuth, err, userId }, info) => {
			AuthFailMsg(isAuth);
			// console.log(`object`, isAuth, err, userId);
			const user = await User.findById(userId);
			IsExist(user, "felhasználó");

			let returnObj = returnObject(user);
			if (user.userData.connectInfo.dob) {
				returnObj = {
					...returnObj,
					userData: {
						...returnObj.userData,
						connectInfo: {
							...returnObj.userData.connectInfo,
							dob: returnObj.userData.connectInfo.dob
								.toISOString()
								.split("T")[0],
						},
					},
				};
			}
			return returnObj;
		},

		event: async (req, { id }, { isAuth, err, userId }) => {
			// console.log(`context`, isAuth, err, userId);
			AuthFailMsg(isAuth);
			const event = await Event.findById(id).populate("creator");
			IsExist(event, "esemény");

			let returnObj = {
				...returnObject(event),
			};
			if (event.startDate && event.endDate) {
				returnObj = {
					...returnObj,
					startDate: event.startDate,
					endDate: event.endDate,
				};
			}
			return returnObj;
		},

		events: async function (req, { page, perPage }, { isAuth, err, userId }) {
			// console.log(`context`, isAuth, err, userId);

			AuthFailMsg(isAuth);
			if (!page) {
				page = 1;
			}
			if (!perPage) {
				perPage = 50;
			}
			const totalEvents = await Event.find().countDocuments();
			const events = await Event.find()
				.sort({ createdAt: -1 })
				.skip((page - 1) * perPage)
				.limit(perPage)
				.populate("creator");
			return {
				events: events.map((e) => {
					return returnObject(e);
				}),
				totalEvents: totalEvents,
			};
		},
	},

	Mutation: {
		createUser: async (req, { userInput }) => {
			// console.log(`req`, userInput);

			const errors = [];
			if (!validator.isEmail(userInput.email)) {
				errors.push({ message: "Érvénytelen e-mail" });
			}
			if (
				validator.isEmpty(userInput.password) ||
				!validator.isLength(userInput.password, { min: 8 })
			) {
				errors.push({ message: "A jelszó túl rövid" });
			}
			if (errors.length > 0) {
				const error = new Error("Érvénytelen bevitel");
				error.data = errors;
				error.code = 422;
				throw error;
			}
			const existingUser = await User.findOne({ email: userInput.email });
			if (existingUser) {
				const error = new Error("Ezzel az email címmel már regisztráltak");
				throw error;
			}
			const hashedPw = await bcrypt.hash(userInput.password, 12);
			const user = new User({
				email: userInput.email,
				password: hashedPw,
				name: userInput.name,
				imageUrl: userInput.imageUrl || "",
				metaData: {
					isAdmin: false,
					isHOD: false,
				},
			});
			const createdUser = await user.save();
			return returnObject(createdUser);
		},

		updateUser: async (req, { id, Data }, { isAuth, err, userId }) => {
			// console.log(`req`, isAuth, id, err, Data);

			AuthFailMsg(isAuth);
			const user = await User.findById(id);
			IsExist(user, "felhasználó");

			if (user._id.toString() !== id.toString()) {
				const error = new Error("Nincs engedélyed");
				error.code = 403;
				throw error;
			}

			const updateAnObjectHandler = (updateData) => {
				for (const [key] of Object.entries(updateData)) {
					user.userData[key] = { ...user.userData[key], ...Data[key] };
				}
			};
			updateAnObjectHandler(Data);

			const updatedUser = await user.save();
			// console.log("User is updated!", updatedUser);
			return returnObject(user);
		},

		deleteUser: async (req, { id }, { isAuth, err, userId }) => {
			// console.log(`object`, id, isAuth, err, userId);
			AuthFailMsg(isAuth);
			const user = await User.findById(id);
			IsExist(user, "felhasználó");

			console.log(`user`, user.event);

			if (id !== userId) {
				const error = new Error("Nem engedélyezett művelet!");
				error.code = 403;
				throw error;
			}

			await User.findByIdAndRemove(id);

			// const event = await.findById(eventId);
			// event.user.pull(id);
			// await event.save();

			return true;
		},

		createEvent: async (req, { id, eventInput }, { isAuth, err, userId }) => {
			// console.log(`req`, req, isAuth, id, eventInput);

			AuthFailMsg(isAuth);
			const user = await User.findById(id);
			IsExist(user, "felhasználó");
			const event = new Event({
				title: eventInput.title,
				shortName: eventInput.shortName,
				startDate: eventInput.startDate,
				endDate: eventInput.endDate,
				eventType: eventInput.eventType,
				creator: user,
			});
			const createdEvent = await event.save();
			user.event.push(createdEvent);
			await user.save();
			return returnObject(user);
		},

		deleteEvent: async function (req, { id }, { isAuth, err, userId }) {
			// console.log(`req`, isAuth, id, userId);

			AuthFailMsg(isAuth);
			const event = await Event.findById(id);
			IsExist(event, "esemény");

			if (event.creator.toString() !== userId.toString()) {
				const error = new Error("Nem engedélyezett művelet!");
				error.code = 403;
				throw error;
			}
			await Event.findByIdAndRemove(id);
			const user = await User.findById(userId);
			user.event.pull(id);
			await user.save();
			return true;
		},
	},
};
