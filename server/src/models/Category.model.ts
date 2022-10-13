import mongoose from "mongoose";
const Schema = mongoose.Schema;
const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
});
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
