import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

export class loginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}
