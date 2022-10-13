import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../middlewares/currentUser";
import Book from "../models/Book.model";
import Order from "../models/Order.model";
import Voucher from "../models/Voucher.model";
import { handleError } from "../utils/error";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		if (req.body.price.voucher.code) {
			// reduce voucher times
			const voucher = await Voucher.findOne({ code: req.body.price.voucher.code });
			if (!voucher) throw handleError(new Error("Voucher not found"), 404);
			if (voucher.times > 0) {
				voucher.times -= 1;
				await voucher.save();
			}
		}
		req.body.products.forEach(async (product: any) => {
			await Book.findByIdAndUpdate(product.product, { $inc: { quantity: -product.quantity } });
		});
		const order = await Order.create({
			info: {
				user: user._id,
				address: req.body.info.address,
				phone: req.body.info.phone,
				note: req.body.info.note,
			},
			products: req.body.products,
			price: {
				voucher: req.body.price.voucher.discount,
				subtotal: req.body.price.subtotal,
				total: req.body.price.total,
				shipping: req.body.price.shipping,
			},
			payment: req.body.payment,
		});
		res.status(201).json(order);
	} catch (error) {
		console.log(error);
		next(error);
	}
};
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const orders = await Order.find({
			"info.user": user._id,
		})
			.populate({
				path: "products.product",
				select: "title image slug",
			})
			.sort({ status: 1, createdAt: -1 });
		res.status(200).json({
			message: "Get orders successfully",
			data: orders,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const rateOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as RequestWithUser;
		const order = await Order.findById(req.params.id);
		if (!order) throw handleError(new Error("Order not found"), 404);
		if (order.info.user.toString() !== user._id.toString())
			throw handleError(new Error("You are not allowed to rate this order"), 403);
		order.comment = req.body.comment;
		order.isRated = true;
		await order.save();
		res.status(200).json(order);
	} catch (error) {
		next(error);
	}
};

export const adminGetOrders = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const orders = await Order.find()
			.populate({
				path: "products.product",
				select: "title image slug",
			})
			.sort({ status: 1, createdAt: -1 });
		res.status(200).json({
			message: "Get orders successfully",
			data: orders,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
