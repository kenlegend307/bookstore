import mongoose from "mongoose";
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI as string);
		require("../models/Author.model");
		require("../models/Category.model");
		require("../models/Publisher.model");
		require("../models/Book.model");
		require("../models/Voucher.model");
		require("../models/Order.model");
		console.log("⚡️[server]: Connect db successfully");
	} catch (error) {
		process.exit(1);
	}
};
export default connectDB;
