import { DataSource } from "typeorm";
import { Account } from "./models/Account";

const db = new DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: "playground-user",
    password: "pass",
    database: "Playground",
    entities: [
        Account
    ],
    logging: true,
    synchronize: false,
    options: {
        encrypt: false // please add this for ms sql
    }
});

export default db;