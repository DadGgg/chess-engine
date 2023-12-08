import { BaseHttpController, controller, httpGet, httpPost } from "inversify-express-utils";
import { Request } from "express";
import { id, inject } from "inversify";
import { TYPES } from "../TYPES";
import { IAccountService } from "../application/AccountService";
import { AccountDto } from "./models/AccountDto";

@controller("/accounts")
export default class AccountController extends BaseHttpController {
    service: IAccountService;
    constructor(@inject(TYPES.IAccountService) service: IAccountService) {
        super();
        this.service = service;
    }
    
    @httpGet("/")
    private async getAccounts(request: Request) {
        const accounts = await this.service.getAll();
        return accounts;
    }

    @httpGet("/:id")
    private async getAccount(request: Request) {
        const account = await this.service.getById(+request.params.id);
        return account;
    }

    @httpPost("/")
    private async createAccount(request: Request) {
        const newAccount = request.body as AccountDto;
        if (newAccount.username == null) {
            return this.badRequest("Name must at least be provided, you baboon.");
        }
        if (newAccount.password == null) {
            return this.badRequest("Security info must at least be provided, you baboon.");
        }

        const savedAccount = await this.service.create(newAccount);
        return savedAccount;
    }
}