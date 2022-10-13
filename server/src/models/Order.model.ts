import mongoose from "mongoose";
const Schema = mongoose.Schema;
const orderSchema = new Schema(
	{
		info: {
			user: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			address: String,
			phone: String,
			note: String,
		},
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "Book",
				},
				quantity: Number,
				price: Number,
			},
		],
		price: {
			voucher: Number,
			subtotal: Number,
			total: Number,
			shipping: Number,
		},
		status: {
			type: String,
			enum: ["pending", "cancelled", "shipping", "delivered"],
			default: "pending",
		},
		payment: {
			type: String,
			enum: ["cash", "paypal"],
			default: "cash",
		},
		comment: {
			type: String,
			default: "",
		},
		isRated: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
