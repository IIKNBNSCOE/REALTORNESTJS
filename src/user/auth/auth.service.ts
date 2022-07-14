import { Injectable, ConflictException,UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {UserType} from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as JWT from "jsonwebtoken"

interface SignupParameter{
    name:string,
    email:string,
    password:string,
    phone:string
}

interface SigninParameter
{
    email:string,
    password:string
}

interface GenKeyParameter
{
    email:string;
    usertype:UserType
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService:PrismaService){}
   async signUp({email,password,phone,name}:SignupParameter,usertype:UserType)
    {
       const existuser=await this.prismaService.user.findFirst({
         where:{
              email      
         }
        })
        if(existuser)        
        throw new ConflictException("Email Already Exists, Use Different One")
        
        const hashedPassword=await bcrypt.hash(password,8)

        const newUser=await this.prismaService.user.create({
            data:{
                email,
                name,
                password:hashedPassword,
                phone,
                type:usertype
                }
        })
        const token=JWT.sign(email,process.env.SECRET_KEY)
        return token
    }

    async signIn({email,password}:SigninParameter)
    {
        const userd=await this.prismaService.user.findFirst({
            where:{
                email
            }
        })
        if(!userd)
        throw new UnauthorizedException("UnAuthorized Access")
        
        const validu=await bcrypt.compare(password,userd.password)
        if(!validu)
        throw new UnauthorizedException("UnAuthorized Access")

        const token=JWT.sign(email,process.env.SECRET_KEY)
        return token           
    }

    async generateProductID({email,usertype}:GenKeyParameter)
    {
        let productkeystring= `${email} - ${usertype} - ${process.env.PRODUCT_KEY_SECRET}`
        const productKey=await bcrypt.hash(productkeystring,10)
        return productKey
    }
}
