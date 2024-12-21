import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { NextFunction } from 'express';

// INNER

// OUTER
import { Organization } from '@modules/organizations/entities/organization.entity';

export type CitizenDocument = HydratedDocument<Citizen>;

export enum GENDER {
	MALE = 'Male',
	FEMALE = 'Female',
	OTHER = 'Other',
}

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
export class Citizen extends BaseEntity {
  constructor(citizen: {
    first_name?: string;
    last_name?: string;
    avatar?: string;
    phone?: string;
    gender?: GENDER;
    date_of_birth?: Date;
  }) {
    super();
    this.first_name = citizen?.first_name;
    this.last_name = citizen?.last_name;
    this.avatar = citizen?.avatar;
    this.phone = citizen?.phone;
    this.gender = citizen?.gender;
    this.date_of_birth = citizen?.date_of_birth;
  }


  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
    set: (first_name: string) => first_name.trim(),
  })
  first_name: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
    set: (last_name: string) => last_name.trim(),
  })
  last_name: string;

  @Prop({
    default: 'https://example.com/default-avatar.png',
  })
  avatar: string;

  @Prop({
    required: true,
    match: /^[0-9]{10}$/,
  })
  phone: string;

  @Prop({
      enum: GENDER,
  })
  gender: GENDER;

  @Prop()
	date_of_birth?: Date;

  @Prop()
	@Exclude()
	current_refresh_token?: string;

  @Prop({
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserAchievement' }],
      default: [],
  })
  achievements: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationWithStudent' }],
    default: [],
  })
  registration_competition: mongoose.Types.ObjectId[];
}

export const CitizenSchema = SchemaFactory.createForClass(Citizen);

export const CitizenSchemaFactory = () => {
	const citizen_schema = CitizenSchema;

	citizen_schema.pre('findOneAndDelete', async function (next: NextFunction) {
		// OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
		const Citizen = await this.model.findOne(this.getFilter());
		await Promise.all([]);
		return next();
	});
	return citizen_schema;
};
