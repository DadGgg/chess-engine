import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { TYPES } from "../TYPES";
import { AccountAggregate } from "../application/models/AccountAggregate";
import { Account } from "./models/Account";
import { IAccountAggregateFactory } from "./AccountAggregateFactory";

export interface IAccountAggregateRepo {  
    getAll(): Promise<AccountAggregate[]>;
    getById(id: number): Promise<AccountAggregate>;
    save(account: AccountAggregate): Promise<AccountAggregate>;
    delete(id: number): Promise<boolean>;
}

@injectable()
export class AccountAggregateRepo implements IAccountAggregateRepo {
    private readonly dataRepo: Repository<Account>;
    private readonly factory: IAccountAggregateFactory;
    constructor(
        @inject(TYPES.AccountDataRepo) dataRepo: Repository<Account>, 
        @inject(TYPES.IAccountAggregrateFactory) factory: IAccountAggregateFactory
    ) {
        this.dataRepo = dataRepo;
        this.factory = factory;
    }
    
    async getAll(): Promise<AccountAggregate[]> {
        const dataModels = await this.dataRepo.find();
        return dataModels.map(dataModel => this.mapToAggregateModel(dataModel));
    }
    async getById(id: number): Promise<AccountAggregate> {
        const dataModel = await this.dataRepo.findOneBy({id: id});
        return this.mapToAggregateModel(dataModel);
    }
    async save(account: AccountAggregate): Promise<AccountAggregate> {
        const dataModel = this.mapToDataModel(account);
        const savedDataModel = await this.dataRepo.save(dataModel);
        return this.mapToAggregateModel(savedDataModel);
    }
    async delete(id: number): Promise<boolean> {
        try {
            await this.dataRepo.delete(id);
            return true;
        } catch(error) {
            return false;
        }
    }

    private mapToDataModel(account: AccountAggregate) {
        const state = account.getState();
        const dataModel = new Account();
        dataModel.id = state.id;
        dataModel.username = state.username;
        dataModel.password = state.password;
        return dataModel;
    }

    private mapToAggregateModel(accountData: Account) {
        const account = this.factory.create(accountData.username, accountData.password, accountData.id);
        return account;
    }

}