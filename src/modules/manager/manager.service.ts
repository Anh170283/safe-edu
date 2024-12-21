import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';

  import { FindAllResponse, QueryParams } from 'src/types/common.type';
  import { FilterQuery } from 'mongoose';
import { log } from 'console';
import { Manager } from './entities/manager.entity';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerRepositoryInterface } from './interfaces/manager.interface';

  
  @Injectable()
  export class ManagerService {
    constructor(
      @Inject('ManagerRepositoryInterface')
      private readonly ManagerRepository: ManagerRepositoryInterface,
      private readonly configService: ConfigService,
    ) {}

      
    async setCurrentRefreshToken(managerId: string, refreshToken: string): Promise<void> {
        try {
          // Tìm người dùng theo ID
          const Manager = await this.ManagerRepository.findById(managerId);
          
          if (!Manager) {
            throw new Error('Manager not found');
          }
    
          // Cập nhật refresh token cho người dùng
          Manager.refreshToken = refreshToken;  // Giả sử `refreshToken` là trường trong entity User
        //  await this.usersRepository.update(userId, { token: refreshToken });  // Cập nhật thông tin trong DB
    
          console.log(`Refresh token for user ${managerId} has been updated.`);
        } catch (error) {
          console.error(`Failed to set refresh token for user ${managerId}:`, error);
          throw new Error('Failed to set refresh token');
        }
      }
    // Method to find a user by condition
    async findOneByCondition(condition: FilterQuery<Manager>): Promise<Manager | null> {
      return this.ManagerRepository.findOne(condition);
    }
  
    //
  
    
    async create(createDto: CreateManagerDto): Promise<Manager> {
        console.log('service');
        
        
    
    
         const Manager = await this.ManagerRepository.create({
           ...createDto
         });
      
         return Manager;
      }
 
    async findAll() {
      return await this.ManagerRepository.findAll();
    }

  
    async update(
      id: string,
      updateUserDto: UpdateManagerDto,
    ): Promise<Manager> {
      const updatedManager = await this.ManagerRepository.update(id,{...updateUserDto});
      if (!updatedManager) {
        throw new NotFoundException(`Manager with ID ${id} not found`);
      }
      return updatedManager;
    }
  
    // Remove user
    async remove(id: string): Promise<void> {
      const result = await this.ManagerRepository.remove(id);
      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    }

    async getManagerByEmail(email: string): Promise<Manager> {
        const Manager = await this.ManagerRepository.findOne({ email });
    
        if (!Manager) {
          throw new NotFoundException(`Manager with email ${email} not found`);
        }
    
        return Manager;
      }
    
  }
  