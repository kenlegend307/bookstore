import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../middlewares/currentUser";
import Voucher from "../models/Voucher.model";
import { handleError } from "../utils/error";

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		let message = "";
		const { slug } = req.params;
		const voucher = await Voucher.findOne({ code: slug });
		if (!voucher) {
			throw handleError(new Error("Voucher not found"), 404);
		}
		if (
			!voucher.active ||
			voucher.times === 0 ||
			(voucher.allowUser.length > 0 && !voucher.allowUser.find(user._id)) ||
			+new Date(voucher.date.expiryDate) < +new Date() ||
			+new Date(voucher.date.startDate) > +new Date()
		)
			throw handleError(new Error("Voucher is not active"), 400);

		message = "Voucher found successfully";
		res.status(200).json({
			message,
			data: voucher,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
