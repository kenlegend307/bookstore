import { iError } from "../types";

export const handleError = (error: any, statusCode: number): iError => {
	const status = statusCode || 500;
	const message = error.message || "Something went wrong";
	throw {
		message,
		status,
	};
};
