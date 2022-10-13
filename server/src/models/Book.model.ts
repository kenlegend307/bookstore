import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;
const bookSchema = new Schema(
	{
		slug: {
			type: String,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		image: {
			type: String,
			required: true,
		},
		author: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Author",
			},
		],
		publisher: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Publisher",
		},
		description: {
			type: String,
		},
		year: {
			type: Number,
			default: new Date().getFullYear(),
		},
		quantity: {
			type: Number,
			default: 0,
		},
		price: {
			sale: {
				saleType: {
					type: String,
					enum: ["percent", "price"],
					default: "percent",
				},
				value: {
					type: Number,
					default: 0,
				},
			},
			priceInitial: {
				type: Number,
				default: 0,
			},
			priceFinal: {
				type: Number,
				default: 0,
			},
		},
		categories: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Category",
			},
		],
		rating: {
			rates: [
				{
					user: {
						type: mongoose.SchemaTypes.ObjectId,
						ref: "User",
					},
					rate: {
						type: Number,
						default: 0,
					},
				},
			],
			average: {
				type: Number,
				default: 0,
			},
		},
		comment: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Comment" }],
	},
	{
		timestamps: true,
	}
);
bookSchema.pre("save", function (next) {
	console.log(this);
	if (this.isNew) {
		this.slug = slugify(this.title.toLowerCase());
	}
	next();
});
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book;
//get random 5 characters from the title
