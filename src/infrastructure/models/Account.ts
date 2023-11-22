import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";

// Data model
@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;
    // @OneToMany(() => Purchase, (purchase) => purchase.account)
    // purchases: Purchase[];
}