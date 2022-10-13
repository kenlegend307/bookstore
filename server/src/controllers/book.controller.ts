import { handleError } from "./../utils/error";
import { NextFunction, Request, Response } from "express";
import Book from "../models/Book.model";
import Author from "../models/Author.model";
import Category from "../models/Category.model";
import Publisher from "../models/Publisher.model";

interface iPagination {
	page?: string;
	limit?: string;
}

interface iGetOne {
	slug: string;
}

export async function getOne(req: Request<iGetOne, {}, {}, {}>, res: Response, next: NextFunction) {
	try {
		console.log(req.params.slug);
		const book = await Book.findOne({ slug: req.params.slug })
			.populate("author")
			.populate("categories")
			.populate("publisher");
		if (!book) {
			throw handleError("Book not found", 404);
		}

		res.status(200).json({
			message: "Book fetched successfully",
			data: book,
		});
	} catch (error) {
		next(error);
	}
}
export const getAll = async (req: Request<{}, {}, {}, iPagination>, res: Response, next: NextFunction) => {
	try {
		let results = new Array(0);
		const count = await Book.count({});
		const { query } = req;
		let page = 1;
		let limit = count;
		if (query.page && query.limit) {
			page = +query.page;
			limit = +query.limit;
			if (page && limit) {
				results = await Book.find({})
					.limit(limit)
					.skip(limit * (page - 1))
					.populate("author")
					.populate("categories")
					.populate("publisher");
			}
		} else results = await Book.find({}).populate("author").populate("categories").populate("publisher");
		res.status(200).json({
			message: "Books fetched successfully",
			data: {
				pages: Math.ceil(count / limit || count),
				page: query.page || 1,
				length: count,
				limit: limit,
				books: results,
				author: await Author.find({}),
				category: await Category.find({}),
				publisher: await Publisher.find({}),
			},
		});
	} catch (error) {
		next(error);
	}
};
export async function createOne(req: Request, res: Response, next: NextFunction) {
	const { title, image, description, publisher, author, quantity, year, price, categories } = req.body;
	let authorId: any[] = [];
	let categoryId: any[] = [];
	for (let i = 0; i < author.length; i++) {
		const authorExists = await Author.findOne({ name: author[i] });
		if (!authorExists) {
			const newAuthor = await Author.create({ name: author[i] });
			authorId.push(newAuthor._id);
		} else authorId.push(authorExists._id);
	}
	for (let i = 0; i < categories.length; i++) {
		const categoryExists = await Category.findOne({ name: categories[i] });
		if (!categoryExists) {
			const newCategory = await Category.create({ name: categories[i] });
			categoryId.push(newCategory._id);
		} else categoryId.push(categoryExists._id);
	}
	let publisherId: any;
	const publisherExists = await Publisher.findOne({ name: publisher });
	if (!publisherExists) {
		const newPublisher = await Publisher.create({ name: publisher });
		publisherId = newPublisher._id;
	} else publisherId = publisherExists._id;
	const book = await Book.create({
		title: title || "Harry Potter",
		image,
		description,
		publisher: publisherId,
		author: authorId,
		year: +year,
		quantity,
		price,
		categories: categoryId,
	});
	res.status(201).json({
		message: "Book created successfully",
		data: book,
	});
	try {
	} catch (error) {
		next(error);
	}
}
export const adminGetAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const books = await Book.find({}).populate("author").populate("categories").populate("publisher");
		res.status(200).json({
			message: "Books fetched successfully",
			data: books,
		});
	} catch (error) {
		next(error);
	}
};
export const adminGetOne = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.params.slug);
		const book = await Book.findOne({ slug: req.params.slug }).populate("author").populate("categories");
		if (!book) {
			throw handleError("Book not found", 404);
		}
		const authors = await Author.find({});
		const categories = await Category.find({});
		const publishers = await Publisher.find({});
		res.status(200).json({
			message: "Book fetched successfully",
			data: book,
			authors,
			categories,
			publishers,
		});
	} catch (error) {
		next(error);
	}
};
export async function updateOne(req: Request, res: Response, next: NextFunction) {
	try {
		const { _id, title, image, description, publisher, author, year, quantity, price, categories } =
			req.body;
		let authorId: any[] = [];
		let categoryId: any[] = [];
		for (let i = 0; i < author.length; i++) {
			const authorExists = await Author.findOne({ name: author[i] });
			if (!authorExists) {
				const newAuthor = await Author.create({ name: author[i] });
				authorId.push(newAuthor._id);
			} else authorId.push(authorExists._id);
		}
		for (let i = 0; i < categories.length; i++) {
			const categoryExists = await Category.findOne({ name: categories[i] });
			if (!categoryExists) {
				const newCategory = await Category.create({ name: categories[i] });
				categoryId.push(newCategory._id);
			} else categoryId.push(categoryExists._id);
		}

		// author.forEach(async (authorItem: string) => {
		// 	const authorExists = await Author.findOne({ name: authorItem });
		// 	if (!authorExists) {
		// 		const newAuthor = await Author.create({ name: authorItem });
		// 		authorId.push(newAuthor._id);
		// 	} else authorId.push(authorExists._id);
		// 	console.log("authorId: ", authorId);
		// });

		const book = await Book.findOneAndUpdate(
			{ _id },
			{
				title,
				image,
				description,
				publisher,
				author: authorId,
				year,
				quantity,
				price,
				categories: categoryId,
			},
			{ new: true }
		);
		res.send({
			message: "Book updated successfully",
			data: book,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
}
export async function deleteOne(req: Request, res: Response, next: NextFunction) {
	try {
		const book = await Book.findOneAndDelete({ _id: req.params.id });
		if (!book) {
			throw handleError("Book not found", 404);
		}
		res.status(200).json({
			message: "Book deleted successfully",
			data: book,
		});
	} catch (error) {
		next(error);
	}
}
