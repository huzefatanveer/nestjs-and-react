import {IsString, IsNumber, IsNotEmpty} from 'class-validator'

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    imageUrl: string;

}
