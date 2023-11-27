import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import { AccountDto } from "../presentation/models/AccountDto";
import { AccountAggregate, DomainError } from "./models/AccountAggregate";
import { IAccountAggregateRepo } from "../infrastructure/AccountAggregateRepo";
import { IAccountAggregateFactory } from "../infrastructure/AccountAggregateFactory";

export interface IAccountService {
    create(account: AccountDto): Promise<AccountDto>;
    getAll(): Promise<AccountDto[]>;
    getById(id: number): Promise<AccountDto>;
    update(account: AccountDto): Promise<AccountDto>;
    delete(id: number): Promise<boolean>;
}

@injectable()
export class AccountService implements IAccountService {
    private readonly repo: IAccountAggregateRepo;
    private readonly factory: IAccountAggregateFactory;
    constructor(
        @inject(TYPES.IAccountAggregateRepo) repo: IAccountAggregateRepo, 
        @inject(TYPES.IAccountAggregrateFactory) factory: IAccountAggregateFactory
    ) {
        this.repo = repo;
        this.factory = factory;
    }  

    async create(accountDto: AccountDto): Promise<AccountDto> {
        const account = this.factory.create(accountDto.name, accountDto.security);
        const savedAccount = await this.repo.save(account);
        return this.mapToDto(savedAccount);
    }    
    async getAll(): Promise<AccountDto[]> {
        const accounts = await this.repo.getAll();
        return accounts.map(account => this.mapToDto(account));
    }
    async getById(id: number): Promise<AccountDto> {
        const account = await this.repo.getById(id);
        return this.mapToDto(account);
    }
    async update(accountDto: AccountDto): Promise<AccountDto> {
        const account = await this.repo.getById(accountDto.id);
        account.setPassword(accountDto.security);

        const savedAccount = await this.repo.save(account);
        return this.mapToDto(savedAccount);
    }
    async delete(id: number): Promise<boolean> {
        return await this.repo.delete(id);
    }

    private mapToDto(account: AccountAggregate) {
        const state = account.getState();
        const dto = new AccountDto();
        dto.name = state.username;
        dto.security = state.password;
        return dto;
    }
}