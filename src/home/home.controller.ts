import {Controller,Get,Post,Put,Delete,Query,ParseIntPipe, Param, Body} from '@nestjs/common';
import { IsString,IsNumber } from 'class-validator';
import { HomeResponseDTO,HomeQueryParamDTO,CreateHomeDTO,UpdateHomeDTO} from './dtos/home.dto';
import { HomeService } from './home.service';


@Controller('home')
export class HomeController {
    constructor(private readonly homeService:HomeService){}
@Get()
getHomes(@Query() queryParams:HomeQueryParamDTO):Promise<HomeResponseDTO[]>
{
    const {address,city,maxprice,minprice}=queryParams
    const price={
        gte:undefined,
        lte:undefined
    }
    if(minprice)    
    price.gte=minprice
    if(maxprice)
    price.lte=maxprice
    
    if(!price.lte)
    delete price.lte
    if(!price.gte)
    delete price.gte
    
    const filter={
      ...(city && {city}),
      ...(address &&{address}),
          price
    }
    if(!price.lte && !price.gte)
    delete filter.price

    console.log(filter)
    return this.homeService.getHomes(filter)
}

@Get(':id')
getHome(@Param('id',ParseIntPipe) id:number):Promise<HomeResponseDTO>
{
    return this.homeService.getHome(id)
}

@Post()
CreateHome(@Body() body:CreateHomeDTO)
{
   return this.homeService.CreateHome(body)
}

@Put(':id')
UpdateHome(@Body() body:UpdateHomeDTO,@Param('id',ParseIntPipe) id:number)
{
    return this.homeService.UpdateHome(body,id)
}

@Delete(':id')
DeleteHome(@Param('id',ParseIntPipe) id:number){
    return this.homeService.DeleteHome(id)
}
}
