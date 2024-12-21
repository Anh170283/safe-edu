import { Student } from '@modules/students/entities/student.entity';
import { FilterQuery } from 'mongoose';
import { FindAllResponse, QueryParams } from 'src/types/common.type';

export interface StudentsRepositoryInterface {
	create(data: Partial<Student>): Promise<Student>;
	findAll();
	getStudentWithRole(StudentId: string): Promise<Student | null>;
	update(id: string, data: Partial<Student>): Promise<Student | null>;
	remove(id: string): Promise<boolean>;
	findOneByCondition(condition: FilterQuery<Student>): Promise<Student | null>;  
}
