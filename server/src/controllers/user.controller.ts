import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import axios from "axios";
import { RequestWithUser } from "../middlewares/currentUser";
import { handleError } from "../utils/error";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
	apiKey: "698f781da4f77e5b9bdbfc2fbdc9bcd7-us18",
	server: "us18",
});

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const userData = await User.findById(user._id);
		if (!userData) throw handleError(new Error("User not found"), 404);
		if (userData.status.isActive === false) {
			return res.status(401).json({
				message: "Your account is not active",
			});
		}
		res.status(200).json({
			message: "Login successfully",
			data: {
				token: userData.createToken(),
				user: userData,
			},
		});
	} catch (error) {
		next(error);
	}
};
export const loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, name, picture } = await axios
			.get("https://www.googleapis.com/oauth2/v3/userinfo", {
				headers: {
					Authorization: `Bearer ${req.body.token}`,
				},
			})
			.then((response) => response.data);
		const user = await User.findOne({ email });
		if (!user) {
			const newUser = await User.create({ email, name, image: picture });
			return res.status(201).json({
				message: "Register successfully",
				data: {
					token: newUser.createToken(),
					user: newUser,
				},
			});
		}
		if (user.status.isActive === false) {
			res.status(401).json({
				message: "Your account is not active",
			});
		}
		res.status(200).json({
			message: "Login successfully",
			data: {
				token: user.createToken(),
				user,
			},
		});
	} catch (error) {
		next(error);
	}
};
export const addToWhitelist = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const { book_id } = req.body;
		const userData = await User.findById(user._id);
		if (!userData) throw handleError(new Error("User not found"), 404);
		//check is exist
		if (userData.white_list.includes(book_id))
			throw handleError(new Error("Book already in whitelist"), 400);
		userData.white_list.push(book_id);
		await userData.save();
		res.status(200).json({
			message: "Add to whitelist successfully",
			data: {
				_id: book_id,
			},
		});
	} catch (error) {
		next(error);
	}
};
export const removeFromWhitelist = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const { book_id } = req.body;
		const userData = await User.findById(user._id);
		if (!userData) throw handleError(new Error("User not found"), 404);
		//check is exist
		if (!userData.white_list.includes(book_id))
			throw handleError(new Error("Book not in whitelist"), 400);
		userData.white_list.splice(userData.white_list.indexOf(book_id), 1);
		await userData.save();
		res.status(200).json({
			message: "Remove from whitelist successfully",
			data: {
				_id: book_id,
			},
		});
	} catch (error) {
		next(error);
	}
};
export const updateOneAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const { address } = req.body;
		const userData = await User.findById(user._id);
		if (!userData) throw handleError(new Error("User not found"), 404);
		const addressFind = userData.address.find((item: any) => {
			return item._id + "" === address._id;
		});
		if (!addressFind) throw handleError(new Error("Address not found"), 404);
		addressFind.province = address.province;
		addressFind.district = address.district;
		addressFind.ward = address.ward;
		addressFind.street = address.street;
		addressFind.other = address.other;
		await userData.save();
		res.status(200).json({
			message: "Update address successfully",
			data: {
				_id: userData._id,
				address,
			},
		});
	} catch (error) {
		next(error);
	}
};
export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const { address } = req.body;
		const userData = await User.findById(user._id);
		if (!userData) throw handleError(new Error("User not found"), 404);
		userData.address.push(address);
		await userData.save();
		res.status(200).json({
			message: "Update address successfully",
			data: {
				address,
			},
		});
	} catch (error) {
		next(error);
	}
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const { name, phone, subscribe } = req.body;
		const userData = await User.findById(user._id);
		if (!userData) throw handleError(new Error("User not found"), 404);
		userData.name = name;
		userData.phone = phone;
		if (userData.status.isSubscribed !== subscribe) {
			userData.status.isSubscribed = subscribe;
			if (subscribe) {
				await addMemberSubcribe(userData.email);
			} else await removeMemberSubcribe(userData.email);
		}
		await userData.save();
		res.status(200).json({
			message: "Update user successfully",
			data: {
				user: userData,
			},
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
export const userSubcribe = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email } = req.body;
		const LIST_ID = "7851c20afb";
		const members = (await (mailchimp as any).lists.getListMembersInfo(LIST_ID)).members;
		const isExist = members.find((item: any) => item.email_address === email);
		if (isExist) throw handleError(new Error("Email already exist"), 400);
		await mailchimp.lists.addListMember(LIST_ID, {
			email_address: email,
			status: "subscribed",
		});
		res.send({
			message: "Subscribe successfully",
		});
	} catch (error) {
		next(error);
	}
};
async function addMemberSubcribe(email: string) {
	const LIST_ID = "7851c20afb";
	const members = (await (mailchimp as any).lists.getListMembersInfo(LIST_ID)).members;
	const isExist = members.find((item: any) => item.email_address === email);
	if (isExist) {
		if (isExist.status === "subscribed") return;
		await mailchimp.lists.updateListMember(LIST_ID, isExist.id, {
			status: "subscribed",
		});
	}
}
async function removeMemberSubcribe(email: string) {
	const LIST_ID = "7851c20afb";
	const members = (await (mailchimp as any).lists.getListMembersInfo(LIST_ID)).members;
	const isExist = members.find((item: any) => item.email_address === email);
	await mailchimp.lists.updateListMember(LIST_ID, isExist.id, {
		status: "unsubscribed",
	});
}
