import { NextFunction, Request, Response } from "express";
import provinces from "../jsons/provinces.json";
import districts from "../jsons/districts.json";
import wards from "../jsons/wards.json";
export async function getProvinces(req: Request, res: Response, next: NextFunction) {
	try {
		return res.send(provinces);
	} catch (error) {
		next(error);
	}
}
export async function getDistricts(
	req: Request<{}, {}, {}, { province_code: string }>,
	res: Response,
	next: NextFunction
) {
	try {
		if (req.query.province_code)
			return res.send(
				districts.filter((district) => district.province_code === +req.query.province_code)
			);
		return res.send(districts);
	} catch (error) {
		next(error);
	}
}
export async function getWards(
	req: Request<{}, {}, {}, { district_code: string }>,
	res: Response,
	next: NextFunction
) {
	try {
		if (req.query.district_code)
			return res.send(wards.filter((ward) => ward.district_code === +req.query.district_code));
		return res.send(wards);
	} catch (error) {
		next(error);
	}
}
export async function getProvince(
	req: Request<{ province_code: string }, {}, {}, {}>,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send(provinces.find((province) => province.code === +req.params.province_code));
	} catch (error) {
		next(error);
	}
}
export async function getDistrict(
	req: Request<{ district_code: string }, {}, {}, {}>,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send(districts.find((district) => district.code === +req.params.district_code));
	} catch (error) {
		next(error);
	}
}
export async function getWard(
	req: Request<{ ward_code: string }, {}, {}, {}>,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send(wards.find((ward) => ward.code === +req.params.ward_code));
	} catch (error) {
		next(error);
	}
}
export async function getAll(
	req: Request<{}, {}, { province_code: number; district_code: number; ward_code: number }, {}>,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send({
			message: "Get all success",
			data: {
				province: provinces.find((province) => province.code === req.body.province_code),
				district: districts.find((district) => district.code === req.body.district_code),
				ward: wards.find((ward) => ward.code === req.body.ward_code),
			},
		});
	} catch (error) {
		next(error);
	}
}
