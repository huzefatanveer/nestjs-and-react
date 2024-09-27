import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';


export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    imageUrl?: string; // Optional
}
