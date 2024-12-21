import { FilterQuery } from 'mongoose';
import { Organization } from '../entities/organization.entity';

export interface OrganizationsRepositoryInterface {
	create(data: Partial<Organization>): Promise<Organization>;
	findAll();
	update(id: string, data: Partial<Organization>): Promise<Organization | null>;
	remove(id: string): Promise<boolean>;
	findOne(condition: FilterQuery<Organization>): Promise<Organization | null>;  
	findById(id : string)
	isNameExist(name: string, address: string);
	findAllWithPaging(query: Record<string, any>, current: number, pageSize: number);
	isNullOrEmpty(value: string);
	findAllIsActive();
}
