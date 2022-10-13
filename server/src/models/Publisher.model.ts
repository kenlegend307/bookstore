import mongoose from "mongoose";
const Schema = mongoose.Schema;
const publisherSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
});
const Publisher = mongoose.models.Publisher || mongoose.model("Publisher", publisherSchema);
export default Publisher;
