// Domain model
export class AccountAggregate {
    private id?: number;
    private username: string;
    private password: string;
    constructor(username, password, id = null) {
        this.id = id;
        this.username = username;
        this.setPassword(password);
    }
    setPassword(value: string) {
        if (!value.includes("$")) {
            throw new DomainError("Password must be stronger!");
        }
        this.password = value;
    }

    getState() {
        return {
            id: this.id,
            username: this.username,
            password: this.password
        }
    }
}

export class DomainError extends Error {
    type: "DomainError"
}