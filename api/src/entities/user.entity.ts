import { User } from "@/interfaces/user.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryColumn()
  discordID: string;

  @Column()
  @IsNotEmpty()
  color: string;
}
