import { Citizen } from '@modules/citizens/entities/citizen.entity';
import { FilterQuery } from 'mongoose';
import { FindAllResponse, QueryParams } from 'src/types/common.type';

export interface CitizensRepositoryInterface {
    create(data: Partial<Citizen>): Promise<Citizen>;
    findAll();
    getCitizenWithRole(CitizenId: string): Promise<Citizen | null>;
    update(id: string, data: Partial<Citizen>): Promise<Citizen | null>;
    remove(id: string): Promise<boolean>;
    findOneByCondition(condition: FilterQuery<Citizen>): Promise<Citizen | null>;  
}
