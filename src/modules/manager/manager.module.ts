import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// INNER


// OUTER

import { ManagerController } from './manager.controller';
import { Manager, ManagerSchemaFactory } from './entities/manager.entity';
import { ManagerRepository } from '@repositories/manager.repository';
import { ManagerService } from './manager.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Manager.name,
        useFactory: ManagerSchemaFactory,
      },
    ]),
    
  ],
  controllers: [ManagerController],
  providers: [
    ManagerService,
    { provide: 'ManagerRepositoryInterface', useClass: ManagerRepository},
  ],
  exports: [ManagerService],
})
export class ManagerModule {}
