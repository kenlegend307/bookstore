import { Express } from "express";
import userRoute from "./user.route";
import bookRoute from "./book.route";
import voucherRoute from "./voucher.route";
import addressRoute from "./address.route";
import orderRoute from "./order.route";
import adminRoute from "./admin.route";

const withRoute = (app: Express) => {
	app.use("/api/v1/address", addressRoute);
	app.use("/api/v1/user", userRoute);
	app.use("/api/v1/voucher", voucherRoute);
	app.use("/api/v1/book", bookRoute);
	app.use("/api/v1/order", orderRoute);
	app.use("/api/v1/admin", adminRoute);
};
export default withRoute;
