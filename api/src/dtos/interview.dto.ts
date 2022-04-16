import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  public student: string;

  @IsOptional()
  @IsString()
  public mentor: string;

  @IsDateString()
  public startDate: string;

  @IsDateString()
  public endDate: string;
}

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  public student: string;

  @IsOptional()
  @IsString()
  public mentor: string;

  @IsOptional()
  @IsDateString()
  public startDate: string;

  @IsOptional()
  @IsDateString()
  public endDate: string;
}

export class ConfirmInterviewDto {
  @IsDateString()
  public startDate: string;

  @IsDateString()
  public endDate: string;
}
