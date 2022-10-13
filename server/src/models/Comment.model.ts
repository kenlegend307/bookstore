import mongoose from "mongoose";
const Schema = mongoose.Schema;
const commentSchema = new Schema({
	comment: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	book: {
		type: Schema.Types.ObjectId,
		ref: "Book",
	},
});
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
