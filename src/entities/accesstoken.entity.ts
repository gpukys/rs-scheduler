import { Token } from "@/interfaces/token.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccessTokenEntity extends BaseEntity implements Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  token: string;

  @Column()
  expiresAt: string;
}
