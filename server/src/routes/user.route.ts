import express from "express";
import {
	addToWhitelist,
	removeFromWhitelist,
	getUser,
	loginWithGoogle,
	createAddress,
	updateUser,
	updateOneAddress,
	userSubcribe,
} from "../controllers/user.controller";
import { currentUser } from "../middlewares/currentUser";
const Router = express.Router();
Router.post("/login", loginWithGoogle);
Router.route("/").get(currentUser, getUser).patch(currentUser, updateUser);
Router.route("/whitelist").post(currentUser, addToWhitelist).delete(currentUser, removeFromWhitelist);
Router.route("/address").post(currentUser, createAddress).put(currentUser, updateOneAddress);
Router.route("/mail").post(userSubcribe);
export default Router;
