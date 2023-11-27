import db from "./infrastructure/db";
import { Account } from "./infrastructure/models/Account";
import { Container, AsyncContainerModule } from "inversify";
import { Repository } from "typeorm";
import { TYPES } from "./TYPES";
import { AccountService, IAccountService } from "./application/AccountService";

import "./presentation/AccountController";
import { AccountAggregateRepo, IAccountAggregateRepo } from "./infrastructure/AccountAggregateRepo";
import { AccountAggregateFactory, IAccountAggregateFactory } from "./infrastructure/AccountAggregateFactory";

export default async function loadContainer() {

    const container = new Container();

    container.bind<IAccountService>(TYPES.IAccountService).to(AccountService);
    container.bind<IAccountAggregateRepo>(TYPES.IAccountAggregateRepo).to(AccountAggregateRepo);
    container.bind<IAccountAggregateFactory>(TYPES.IAccountAggregrateFactory).to(AccountAggregateFactory);
    
    const dbBindings = new AsyncContainerModule(async bind => {
        const connectedDb = await db.initialize();

        bind<Repository<Account>>(TYPES.AccountDataRepo).toDynamicValue(() => {
            return connectedDb.getRepository(Account);
        }).inRequestScope();
        
    });

    await container.loadAsync(dbBindings);

    return container;
}