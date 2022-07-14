import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1000000000)
  @Max(9999999999)
  phone: number;
}
