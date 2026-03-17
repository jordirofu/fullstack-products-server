import db from '../config/db'

export const clearDb = async () => {
    try {
        await db.sync({ force: true })
        console.log('Datos eliminados correctamente');
    } catch (error) {
        console.log(error);

    }
}
