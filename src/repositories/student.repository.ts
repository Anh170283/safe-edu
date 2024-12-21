import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Student } from '@modules/students/entities/student.entity';
import { StudentsRepositoryInterface } from '@modules/students/interfaces/students.interface';

@Injectable()
export class StudentsRepository implements StudentsRepositoryInterface {
	constructor(
		@InjectModel(Student.name) private readonly student_Model: Model<Student>,
	) {}
	async findOne(condition: FilterQuery<Student>): Promise<Student | null> {
		return await this.student_Model.findOne(condition).exec(); 
	}

	async create(data: Partial<Student>): Promise<Student> {
		console.log('data:', JSON.stringify(data, null, 2));
		
		try {
			const newStudent = new this.student_Model(data);
			const savedStudent = await newStudent.save();
			return savedStudent;
		  } catch (error) {
			console.error('Error saving new Student:', error.message);
			throw new BadRequestException('Failed to create Student. Please try again.');
		  }
	}
	async findAll() {
		const Students = await this.student_Model
		  .find()
		  .exec(); 
	  
		const total = await this.student_Model.countDocuments().exec();
		return { items: Students, total };
	  }
	  
	async getStudentWithRole(StudentId: string): Promise<Student | null> {
		return await this.student_Model.findById(StudentId).populate('role').exec();
	}

	async update(id: string, data: Partial<Student>): Promise<Student | null> {
		return await this.student_Model.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async remove(id: string): Promise<boolean> {
		const result = await this.student_Model.findByIdAndDelete(id).exec();
		return !!result;
	}

	async findOneByCondition(condition: FilterQuery<Student>): Promise<Student | null> {
		try {
			console.log('Condition:', condition);
	
			if ('phone_number' in condition) {
				console.log('Searching by phone_number:', condition.phone_number);
			} else if ('_id' in condition || 'id' in condition) {
				console.log('Searching by ID:', condition._id || condition.id);
			}
			const student = await this.student_Model.findOne(condition).exec();
			console.log('Found student:', student);
			return student;
		} catch (error) {
			console.error('Error finding student:', error);
			throw error;
		}
	}

	async delete(id: string | Types.ObjectId): Promise<Student | null> {
		const stringId = id instanceof Types.ObjectId ? id.toString() : id;
		return this.student_Model.findByIdAndUpdate(stringId, { deleted_at: new Date() }, { new: true }).exec();
	}
}
