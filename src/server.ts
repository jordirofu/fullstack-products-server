import express from 'express'
import router from './router';
//tb podrías tener varios archivos router (productsRouter, clientsRouter)... y a cada uno le llames con una api base diferente
import db from './config/db'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
//los dos siguientes, para swagger:
import swaggerUI from 'swagger-ui-express';
import {swaggerSpec, swaggerUiOption} from './config/swagger';

//Conectar a base de datos. Sequelize utiliza promises
export async function connectDB() {
    try {
        await db.authenticate()  //esto autentica
        await db.sync();              //Esto hace que si modificamos nuestro modelo (añadimos/qitamos tablas) se actualice en bd
        //console.log(colors.blue.bold('Conexión exitosa a la bd'));
    } catch (error) {
        console.log(colors.red.bold("Hubo un error al conectar a la base de datos"));
    }
}

connectDB();

//instancia de express
const server = express();


//
//
//esto ya es de 2ª parte: conectar con frontend. CORS
const corsOptions : CorsOptions = {
    origin: function(origin, callback) { //origin: quién me está enviando la petición? En este caso, localhost:5173
        if (origin === process.env.FRONTEND_URL){
                callback(null, true) //priemer param es para denegar, segudnod para permitir. Aquí permitimos que pase la petición... esto va a la api 
        }
        else{
            callback(new Error('Error de CORS')); //por este camino... la petición no llega a la api, acaba aquí
        }
    }
}
server.use(cors(corsOptions)) //.use... se utilizará en todos los tipos de las llamadas.
//
//
//

server.use(express.json());

server.use(morgan('dev')) //la diferentes opciones (combined, tiny, etc.) dan más o menos detalles


server.use('/api/products', router); //le entran todas las llamadas... discriminará según config en router. 
//Tb te puede servir para ir cambiando de versiones desde aquí. Es como la url base
//server.use('/api/v1', router)... cuando quieras cambias a v2...



//TODO ESTO SE MOVIÓ A ROUTER.TS
// server.get('/', (req, res) => { //siempre que comunicas con un servidor, hay req y resp.
//     const datos = [ 
//         {id: 1, nombre: "Juan"},    //vas a localhost/4000 y esto es lo que recibes, lo que ves
//         {id: 2, nombre: "Jose"}
//     ]
//     // res.send('Hola Mundo en Express');
//     res.send(datos)
// })

// server.post('/', (req, res) => { //siempre que comunicas con un servidor, hay req y resp.
//     res.json('Desde POST')
// })

// server.put('/', (req, res) => { //siempre que comunicas con un servidor, hay req y resp.
//     res.json('Desde PUT')
// })

// server.patch('/', (req, res) => { //siempre que comunicas con un servidor, hay req y resp.
//     res.json('Desde PATCH')
// })

// server.delete('/', (req, res) => { //siempre que comunicas con un servidor, hay req y resp.
//     res.json('Desde DELETE')
// })

//Esto era simplex para una prueba preliminar de supertest
// server.get('/api', (req, res) => {
//     res.json({msg: 'Desde API'})
// })


server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOption) )
//Cuando visitemos docs, ejecutas estos dos middlewares
//El primero sirve los archivos estáticos (CSS, JS y HTML). Sirve la interfaz
//El segundo toma la especificación openAPI, se la pasa a la interfaz y renderiza. Carga tu documentación 

export default server