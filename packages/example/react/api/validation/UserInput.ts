import { Length, IsEmail } from 'class-validator';

// Be careful, this file is used as well in the browser
// You should only use library compatible on both side, client/server

export class UserInput {
    @Length(2, 20)
    name!: string;

    @IsEmail()
    email!: string;
}
