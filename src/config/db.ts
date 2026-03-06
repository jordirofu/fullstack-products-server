import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'


dotenv.config() //cuando esto se ejecuta una vez... todas las vaiables que están en .env ya se cargan... y para simpre,
//no hace falta volver a llamar a esto paa utilizar "process.env." en otros archivos.

//hemos puesto como parámetro la uri completa: external database url, extraido de Render
const db = new Sequelize( process.env.DATABASEURL!, {
    dialectOptions: {
        ssl: {
            require: false  //si no pones esto del ssl, te cortan la conex
        }
    },
    models: [__dirname + '/../models/**/*.{js,ts}'], //pongo las dos extensiones para q tb funcione en prod (en prod.. no ts)
    //en qué directorio encuentras modelos para definir las columnas.
    //__dirname es de node: te devuelve la ubicación del directorio actual
    logging: false
});

export default db