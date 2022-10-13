import express from "express";
import {
	getAll,
	getDistrict,
	getDistricts,
	getProvince,
	getProvinces,
	getWard,
	getWards,
} from "../controllers/address.controller";
const Router = express.Router();
Router.route("/p").get(getProvinces);
Router.route("/p/:province_code").get(getProvince);
Router.route("/d").get(getDistricts);
Router.route("/d/:district_code").get(getDistrict);
Router.route("/w").get(getWards);
Router.route("/w/:ward_code").get(getWard);
Router.route("/").post(getAll);
export default Router;
