import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'


dotenv.config() 

const db = new Sequelize( process.env.DATABASE_URL!, {
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