import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrganizationsRepositoryInterface } from '@modules/organizations/interfaces/organizations.interface';
import { Organization } from '@modules/organizations/entities/organization.entity';

@Injectable()
export class OrganizationsRepository implements OrganizationsRepositoryInterface {
	constructor(
		@InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
	) {}
	async findOne(condition: FilterQuery<Organization>): Promise<Organization | null> {
		return await this.organizationModel.findOne(condition).exec(); 
	  }
	async create(data: Partial<Organization>): Promise<Organization> {
		const newOrganization = new this.organizationModel(data);
		return await newOrganization.save();
	}
	async findAll() {
		const organizations = await this.organizationModel
		  .find({ isActive: true, deleted_at: null, deleted_by: null})
		  .exec(); 
	  
		const total = await this.organizationModel.countDocuments().exec();
		return { items: organizations, total };
	  }

	async update(id: string, data: Partial<Organization>): Promise<Organization | null> {
		return await this.organizationModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async remove(id: string): Promise<boolean> {
		const result = await this.organizationModel.findByIdAndDelete(id).exec();
		return !!result;
	}

	async findById(id: string): Promise<Organization | null> {
		return await this.organizationModel.findById(id).exec(); // Using Mongoose's findById method
	}

	async isNameExist(name: string, province: string) {
		if(this.organizationModel.exists({ name, province })) {
			return true;
		} else {
			return false;
		}
	}

	async findAllWithPaging(query: Record<string, any>, current: number = 1, pageSize: number = 10) {
		const {sort, ...filters} = query
		
		current = Number(current) || 1;
  		pageSize = Number(pageSize) || 10;

		const totalItems = await this.organizationModel.countDocuments(filters);
		const totalPages = Math.ceil(totalItems / pageSize);
		const offset = (current - 1) * pageSize;

		const result = await this.organizationModel
			.find(filters)
			.limit(pageSize)
			.skip(offset)
			.sort(sort as any);

		return { items: result, totalPages }
	}

	async isNullOrEmpty(value: string) {
		return value == null || value.trim() === "";	
	}

	async findAllIsActive() {
		const organizations = await this.organizationModel
		  .find({ isActive: true, deleted_at: null, deleted_by: null})
		  .exec(); 
	  
		const total = await this.organizationModel
			.countDocuments({ isActive: true, deleted_at: null, deleted_by: null })
			.exec();
		return { items: organizations, total };
	}
}
