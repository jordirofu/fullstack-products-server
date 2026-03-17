import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'


dotenv.config() 

const db = new Sequelize( process.env.DATABASEURL!, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    models: [__dirname + '/../models/**/*.{js,ts}'],
    logging: false
});

export default db