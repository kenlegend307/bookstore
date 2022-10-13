import express from "express";
import { createOrder, getOrders, rateOrder } from "../controllers/order.controller";
import { currentUser } from "../middlewares/currentUser";
const Router = express.Router();
Router.route("/").post(currentUser, createOrder).get(currentUser, getOrders);
Router.route("/:id").post(currentUser, rateOrder);
// Router.route("/:slug").get(getOne);
export default Router;
