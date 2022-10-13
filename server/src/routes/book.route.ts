import express from "express";
import { getAll, createOne, getOne } from "./../controllers/book.controller";
const Router = express.Router();
Router.route("/").get(getAll).post(createOne);
Router.route("/:slug").get(getOne);
export default Router;
