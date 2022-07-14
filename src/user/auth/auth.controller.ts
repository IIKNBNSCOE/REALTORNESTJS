import { Controller,Post, Body, Param, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import {SigninDTO, SignupDTO, GenKeyDTO} from '../dtos/auth.dto'
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}
    @Post('/signup/:usertype') 
    signUp(@Body() body:SignupDTO,@Param('usertype') usertype:UserType)
    {
        if(usertype !== 'BUYER')
        {
            if(!body.productid)
            {
                throw new UnauthorizedException("UnAUthorized Access")
            }  
            const validateproductid=bcrypt.compare(`${body.email} - ${usertype} - ${process.env.PRODUCT_KEY_SECRET}`,body.productid)
            if(!validateproductid)  
            throw new UnauthorizedException("Invalid Product Key")   
        }        
        return this.authService.signUp(body,usertype)
    }
    
    @Post('/signin')
    signIn(@Body() body:SigninDTO)
    {
        return this.authService.signIn(body)
    }
    
    @Post('/genkey')
    generateProductID(@Body() body:GenKeyDTO)
    {
        return this.authService.generateProductID(body)
    }
}
