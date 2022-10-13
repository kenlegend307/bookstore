import mongoose from "mongoose";
const Schema = mongoose.Schema;
const authorSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		type: String,
	},
	description: {
		type: String,
	},
	birthday: {
		type: Date,
	},
});
const Author = mongoose.models.Author || mongoose.model("Author", authorSchema);
export default Author;
