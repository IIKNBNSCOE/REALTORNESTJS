import {Expose,Exclude,Type} from "class-transformer"
import {IsOptional,IsNumber,IsNotEmpty, IsString,IsPositive,IsEnum,IsArray,ValidateNested,IsAlpha} from "class-validator"
import {PropertyType} from '@prisma/client'


class Image{
   @IsNotEmpty()
   @IsString()
   url:string
}

export class HomeResponseDTO
{
         
         id: number;
         address: string;
         @Exclude()
         no_of_bed: number;
         @Expose({name:'numberOfBedrooms'})
         numberOfBedRooms()
         {
            return this.no_of_bed
         }
         @Exclude()
         no_of_bath: number;
         @Expose({name:'numberOfBathrooms'})
         numberOfBathRooms()
         {
            return this.no_of_bath
         }
         city:string;
         @Exclude()
         listed_date:Date;
         @Expose({name:"listedDate"})
         listDate() {return this.listed_date }
         price:number;
         @Exclude()
         land_size:number;
         @Expose({name:"landSize"})
         landSize(){return this.land_size}
         @Exclude()
         property_type: PropertyType;
         @Expose({name:"propertyType"})
         propertyType()
         {
            return this.property_type
         }
         @Exclude()
         realtor_id: number
         constructor(partial:Partial<HomeResponseDTO>)
         {
            Object.assign(this,partial)
         }
   }
 export class HomeQueryParamDTO
    {
      @IsOptional()
      @IsNotEmpty()
      city?:string 
      @IsOptional()
      @IsNotEmpty()
      address?:string
      @IsOptional()
      @IsNumber()
      minprice?:number
      @IsOptional()
      @IsNumber()
      maxprice?:number
   }


   export class CreateHomeDTO
   {
         @IsString()
         @IsNotEmpty()
         address:string

         @IsAlpha()
         @IsNotEmpty()
         city:string
         
         @IsNumber()
         @IsPositive()
         price:number

         @IsNumber()
         @IsPositive()
         numberOfBedrooms:number

         @IsNumber()
         @IsPositive()
         numberOfBathrooms:number

         @IsNumber()
         @IsPositive()
         landSize:number

         @IsEnum(PropertyType)
         propertyType:PropertyType

         @IsArray()
         @ValidateNested({ each: true })
         @Type(() =>Image)
         images:Image[]        
   }

   export class UpdateHomeDTO
   {
      @IsOptional()
      @IsString()
      @IsNotEmpty()
      address!:string

      @IsOptional()
      @IsAlpha()
      @IsNotEmpty()
      city!:string
      
      @IsOptional()
      @IsNumber()
      @IsPositive()
      price!:number
      
      @IsOptional()
      @IsNumber()
      @IsPositive()
      numberOfBedrooms!:number

      @IsOptional()
      @IsNumber()
      @IsPositive()
      numberOfBathrooms!:number

      @IsOptional()
      @IsNumber()
      @IsPositive()
      landSize!:number

      @IsOptional()
      @IsEnum(PropertyType)
      propertyType!:PropertyType

      @IsOptional()
      @IsArray()
      @ValidateNested({ each: true })
      @Type(() =>Image)
      images!:Image[]  
   }