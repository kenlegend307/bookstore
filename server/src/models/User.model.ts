import mongoose from "mongoose";
import { createJWT } from "../utils";
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
		},
		address: [
			{
				province: {
					type: Number,
				},
				ward: {
					type: Number,
				},
				district: {
					type: Number,
				},
				other: {
					type: String,
					default: "",
				},
			},
		],
		image: {
			type: String,
			required: true,
			trim: true,
		},
		white_list: [
			{
				type: Schema.Types.ObjectId,
				ref: "Book",
			},
		],
		status: {
			isActive: {
				type: Boolean,
				default: true,
			},
			isSubscribed: {
				type: Boolean,
				default: false,
			},
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{
		timestamps: true,
	}
);
userSchema.methods.createToken = function () {
	const token = createJWT(this._id, this.role);
	return token;
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
