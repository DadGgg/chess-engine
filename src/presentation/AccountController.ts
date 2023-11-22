import { BaseHttpController, controller, httpGet, httpPost } from "inversify-express-utils";
import { Request } from "express";
import { inject } from "inversify";
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

    @httpPost("/")
    private async createAccount(request: Request) {
        const newAccount = request.body as AccountDto;
        if (newAccount.name == null) {
            return this.badRequest("Name must at least be provided, you baboon.");
        }
        if (newAccount.security == null) {
            return this.badRequest("Security info must at least be provided, you baboon.");
        }

        const savedAccount = await this.service.create(newAccount);
        return savedAccount;
    }
}