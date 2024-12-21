import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { NextFunction } from 'express';

export type SupervisorOrganizationDocument = HydratedDocument<SupervisorOrganization>;

@Schema({
  timestamps: {
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class SupervisorOrganization extends BaseEntity {
  constructor(supervisorOrganization: {
    supervisor_Id?: mongoose.Types.ObjectId;
    organization_Id?: mongoose.Types.ObjectId;
  }) {
    super();
    this.supervisor_Id = supervisorOrganization?.supervisor_Id;
    this.organization_Id = supervisorOrganization?.organization_Id;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supervisor',
    required: true,
  })
  supervisor_Id: mongoose.Types.ObjectId;
  
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organization_Id: mongoose.Types.ObjectId;
}

export const SupervisorOrganizationSchema = SchemaFactory.createForClass(SupervisorOrganization);

export const SupervisorOrganizationSchemaFactory = () => {
  const supervisorOrganizationSchema = SupervisorOrganizationSchema;
  supervisorOrganizationSchema.pre('findOneAndDelete', async function (next: NextFunction) {
    const supervisorOrganization = await this.model.findOne(this.getFilter());
    return next();
  });

  return supervisorOrganizationSchema;
};
