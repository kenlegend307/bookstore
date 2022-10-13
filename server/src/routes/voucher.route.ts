import { getOne } from "./../controllers/voucher.controller";
import { currentUser } from "./../middlewares/currentUser";
import express from "express";
const Router = express.Router();
// Router.route("/").get(getAll).post(createOne);
Router.route("/:slug").get(currentUser, getOne);
export default Router;
