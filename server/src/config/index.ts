import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import connectDB from "./db";

const withConfig = (app: Express) => {
	connectDB();
	app.use(express.static("public"));
	app.use(cors());
	app.use(morgan("dev"));
	app.use(express.json({ limit: "10000" }));
	app.use(express.urlencoded({ extended: true }));
};
export default withConfig;
