import mongoose from "mongoose";
const Schema = mongoose.Schema;
const voucherSchema = new Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		minlength: 6,
		uppercase: true,
		trim: true,
	},
	description: {
		type: String,
	},
	type: {
		type: String,
		enum: ["percent", "fixed"],
	},
	value: {
		type: Number,
		required: true,
	},
	times: {
		type: Number,
		default: 0,
	},
	date: {
		startDate: {
			type: Date,
			required: true,
		},
		expiryDate: {
			type: Date,
			required: true,
		},
	},
	allowUser: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	active: {
		type: Boolean,
		default: true,
	},
});
voucherSchema.pre("save", async function (next) {
	try {
		const voucher = this;
		if (voucher.isModified("times")) {
			if (voucher.times === 0) voucher.active = false;
		}

		if (voucher.isModified("date.expiryDate")) {
			if (voucher.date.expiryDate < voucher.date.startDate) {
				throw new Error("Expiry date must be greater than start date");
			}
		}
		next();
	} catch (error) {
		next(error);
	}
});
const Voucher = mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);
export default Voucher;
