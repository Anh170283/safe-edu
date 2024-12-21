import { News } from "@modules/news/entities/news.entity";
import { NewsRepositoryInterface } from "@modules/news/interfaces/news.interfaces";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";


@Injectable()
export class NewsRepository implements NewsRepositoryInterface {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<News>,
    ) {}

    async findOne(condition: FilterQuery<News>): Promise<News | null> {
        return await this.newsModel.findOne(condition).exec();
    }

    async create(data: Partial<News>): Promise<News> {
        const newNews = new this.newsModel(data);
        return await newNews.save();
    }

    async findAll() {
        const news = await this.newsModel
		  .find()
		  .exec(); 
	  
		const total = await this.newsModel.countDocuments().exec();
		return { items: news, total };
    }

    async update(id: string, data: Partial<News>): Promise<News | null> {
        return await this.newsModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.newsModel.findByIdAndDelete(id).exec();
		return !!result;
    }

    async findById(id: string): Promise<News | null> {
        return await this.newsModel.findById(id).exec();
    }
}