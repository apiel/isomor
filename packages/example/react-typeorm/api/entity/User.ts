import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    // in case you dont want to set `strictPropertyInitialization: false` in your tsconfig
    // you need to have an exclamation mark after each property: `id!: number;`

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
