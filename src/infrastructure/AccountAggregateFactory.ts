import { injectable } from "inversify";
import { AccountAggregate } from "../application/models/AccountAggregate";

export interface IAccountAggregateFactory {
    // factory method -> purpose is to call the constructor
    create(username: string, password: string, id?: number): AccountAggregate;
}

@injectable()
export class AccountAggregateFactory implements IAccountAggregateFactory {
    // factory method, just calling constructor for us
    create(username: string, password: string, id: number = null): AccountAggregate {
        return new AccountAggregate(username, password, id);
    }
}
