import request from 'supertest'
import server, { connectDB } from '../server'
import db from '../config/db'


//Estos dos primeros tests eran pruebas preliminares
// describe('Nuestro primer test', () => {
//     it('Debe revisar que 1 + 1 sean 2', ()=> {
//         expect(1+1).toBe(2)
//     } )
//     it('Debe revisar que 1 + 1 no sean 3', ()=> {
//         expect(1+1).not.toBe(3)
//     } )
// })

// describe('GET /api', () => { //Solo una prueba: para este test creaste un nevo endpoint en server (ver al final de server.ts)
//     it('should send back a json response', async () => {
//         const res = await request(server).get('/api')
//         expect(res.status).toBe(200);
//         expect(res.headers['content-type']).toMatch(/json/) //si el valor de ese header incluye "json" (application/json)
//         expect(res.body.msg).toBe("Desde API")
//         expect(res.status).not.toBe(404);
//     })
// })

//El mock
jest.mock('../config/db') //Se mockea el módulo entero. Con esto mockeas la configuración e instancia de sequelize
//Lo haces porque quieres forzar y testear la respuesta de error que te da 
// db.autheticate desde "server", que es lo que estás testeando

describe('Connect DB', () => {
    it('should return error message when it can not connect to db', async () => {

        // jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD')) 
        
        //mockeas el comportamiento de db.authenticate para forzarlo a devolver error

        //La linea de arriba funciona perfectamente... pero... 
        //OJO! jest.mock ya ha hecho que todas las funciones de db sean jest.fn(), las ha mockeado. Por ello
        //hacer luego jest.spyOn sobre algún método de db es redudante. Peeeeero, si hicieras directamente
        //db.authenticate.mockRejectedValueOnce (perfecto en JS), con TS te da problema. Opciones:
        //1) spyOn...2)  (db.authenticate as jest.Mock)   3) La + ortodoxa: la que aparece descomentada:
        //(db.authenticate as jest.Mock).mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD')) //el método se ha de poner como string.
        //sOLUCION 3. LA ortodoxa para TS:
        // const dbAuthenticateMock = jest.mocked(db.authenticate); 
        // dbAuthenticateMock.mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))

        //jest.mocked(db.authenticate).mockResolvedValue();
        jest.mocked(db.authenticate).mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
        const consoleSpy = jest.spyOn(console, 'log'); //otro mock o espía que espiará lo que haga "console.log" pero sin modificarlo

        await connectDB();
        // expect(jest.mocked(db.sync)).toHaveBeenCalledTimes(2); //no se le llamaba, porque authenticate hace que se vaya al catch
        // expect(jest.mocked(db.sync)).toHaveBeenCalledTimes(1);
          expect(consoleSpy).toHaveBeenCalledWith( //comprueba que se ha llamado a console.log con el string que aparece después.
            expect.stringContaining("Hubo un error al conectar a la base de datos")
        )
    })
})

