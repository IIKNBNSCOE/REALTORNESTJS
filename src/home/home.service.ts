import { Injectable,NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDTO } from './dtos/home.dto';
import {prisma, PropertyType} from '@prisma/client'

interface FilterType{
    city?:string
    address?:string
    price?:{
        gte?:number,
        lte?:number  
    }
}
interface Image{
    url:string
}

interface CreateHomeParameters
{
    address:string      
    city:string
    price:number        
    numberOfBedrooms:number
    numberOfBathrooms:number
    landSize:number
    propertyType:PropertyType
    images:Image[]  
}

interface UpdateHomeParameters
{
    address?:string      
    city?:string
    price?:number        
    numberOfBedrooms?:number
    numberOfBathrooms?:number
    landSize?:number
    propertyType?:PropertyType
}

@Injectable()
export class HomeService {
    constructor(private readonly prismaService:PrismaService){}
    async getHomes(filter:FilterType):Promise<HomeResponseDTO[]>
    {
        const homes=await this.prismaService.home.findMany({
            select:{
                id:true,
                address:true,
                city:true,
                price:true,
                no_of_bed:true,
                no_of_bath:true,
                land_size:true ,
                images:{
                    select:
                    {
                        url:true
                    },
                    take:1
                },
                property_type:true,
                listed_date:true                          
            },
           where:filter
        })
        const homesj=homes.map((item)=>{
        const imgurl=item.images[0]
        delete item.images
        const item1={...item,url:imgurl.url}
        return item1})
        const homesd=homesj.map((item)=>
        {
            return new HomeResponseDTO(item)
        })  
        if(!homesd.length)
        throw new NotFoundException("Not Found Home")

        return homesd
    }

    async getHome(id:number):Promise<HomeResponseDTO>{

        const home=await this.prismaService.home.findFirst({
            where:{
                id
            }
        })  
        if(!home)             
        throw new NotFoundException("Not Found Home")

        return new HomeResponseDTO(home)
    }

    async CreateHome({address,city,price,numberOfBedrooms,numberOfBathrooms,landSize,propertyType,images}:CreateHomeParameters){
        const home=await this.prismaService.home.create({
            data:{
                address,
                city,
                land_size:landSize,
                no_of_bath:numberOfBathrooms,
                no_of_bed:numberOfBedrooms,
                price,
                property_type:propertyType,
                realtor_id:9                
            }
        }) 
        const homeid=home.id
        const mdata= images.map((item)=>
       {
        return {...item ,homeid}
       })
       
      await this.prismaService.image.createMany({
        data:mdata
       })
       return new HomeResponseDTO(home)
    }

    async UpdateHome(body:UpdateHomeParameters,id:number)
    {
        const home=await this.prismaService.home.findFirst({
            where:
            {
                id
            }
        })
        if(!home)
        throw new NotFoundException("Not Found Home")
        
        const uhome=await this.prismaService.home.update({
            data:body,
            where:{
                id
            }
        })
        return new HomeResponseDTO(uhome)
    } 
    
    async DeleteHome(id:number)
    {
        const home=await this.prismaService.home.findFirst({
            where:
            {
                id
            }
        })

        if(!home)
        throw new NotFoundException("Not Found Home")

        await this.prismaService.image.deleteMany({
            where:{
                homeid:home.id
            }
        })

        const dhome=await this.prismaService.home.delete({
            where:{
               id 
            }
        })

        return new HomeResponseDTO(dhome)
    }
}
