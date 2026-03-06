import {exit} from 'node:process'
import db from '../config/db'

export const clearDb = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente');
        //exit(0);
    } catch (error) {
        console.log(error);
        //exit(1); //si ponemos 1 es que finalizo con errores, si 0 o vacío, que finalizó bien
       
    }

    // if (process.argv[2] === '--clear') {
    //     clearDb()
    // }
    //Esto es, si en la linea de comandos de la terminal, el tercer argumento es "--clear"
    //por eso funciona si ejecutaras un script pretest: tsx ./src/data --clear
}
