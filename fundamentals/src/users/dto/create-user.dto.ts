import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator'
import { Role } from '../role.enum';
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password:string;
    
    @IsEnum(Role)
    role: Role; 

}
