import {IsNotEmpty,IsString,IsEmail,Matches,MinLength, IsEnum,IsOptional} from 'class-validator'
import {UserType} from '@prisma/client'
export class SignupDTO
{
    @IsString()
    @IsNotEmpty()
    name:string;
    @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,{message:"Phone number must be in proper format"})
    phone:string;

    @MinLength(8)
    password:string;
    @IsEmail()
    email:string;

    @IsOptional()
    @IsNotEmpty()
    productid?:string
}

export class SigninDTO
{
    @IsEmail()
    email:string;

    @IsNotEmpty()
    password:string;
}

export class GenKeyDTO
{
    @IsEmail()
    email:string;
    
    @IsEnum(UserType,{message:"Usertype must be either BUYER,ADMIN OR REALTOR"})
    @IsNotEmpty()
    usertype:UserType
}

