import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Citizen } from '@modules/citizens/entities/citizen.entity';
import { CitizensRepositoryInterface } from '@modules/citizens/interfaces/citizens.interfaces';

@Injectable()
export class CitizensRepository implements CitizensRepositoryInterface {
    constructor(
        @InjectModel(Citizen.name) private readonly Citizen_Model: Model<Citizen>,
    ) {}
    async findOne(condition: FilterQuery<Citizen>): Promise<Citizen | null> {
        return await this.Citizen_Model.findOne(condition).exec(); 
    }

    async create(data: Partial<Citizen>): Promise<Citizen> {
        console.log('data:', JSON.stringify(data, null, 2));
        
        try {
            const newCitizen = new this.Citizen_Model(data);
            const savedCitizen = await newCitizen.save();
            return savedCitizen;
          } catch (error) {
            console.error('Error saving new Citizen:', error.message);
            throw new BadRequestException('Failed to create Citizen. Please try again.');
          }
    }
    async findAll() {
        const Citizens = await this.Citizen_Model
          .find()
          .exec(); 
      
        const total = await this.Citizen_Model.countDocuments().exec();
        return { items: Citizens, total };
      }
      
    async getCitizenWithRole(CitizenId: string): Promise<Citizen | null> {
        return await this.Citizen_Model.findById(CitizenId).populate('role').exec();
    }

    async update(id: string, data: Partial<Citizen>): Promise<Citizen | null> {
        return await this.Citizen_Model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.Citizen_Model.findByIdAndDelete(id).exec();
        return !!result;
    }

    async findOneByCondition(condition: FilterQuery<Citizen>): Promise<Citizen | null> {
        try {
			console.log('Condition:', condition);
	
			if ('phone_number' in condition) {
				console.log('Searching by phone_number:', condition.phone_number);
			} else if ('_id' in condition || 'id' in condition) {
				console.log('Searching by ID:', condition._id || condition.id);
			}
			const citizen = await this.Citizen_Model.findOne(condition).exec();
			console.log('Found citizen:', citizen);
			return citizen;
		} catch (error) {
			console.error('Error finding student:', error);
			throw error;
		}
    }

    async delete(id: string | Types.ObjectId): Promise<Citizen | null> {
        const stringId = id instanceof Types.ObjectId ? id.toString() : id;
        return this.Citizen_Model.findByIdAndUpdate(stringId, { deleted_at: new Date() }, { new: true }).exec();
    }
}
