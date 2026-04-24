import express from 'express'
import router from './router'
import db from './config/db'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import {swaggerSpec, swaggerUiOption} from './config/swagger'

export async function connectDB() {
    try {
        await db.authenticate()  
        await db.sync() 
    } catch (error) {
        console.log(colors.red.bold("Hubo un error al conectar a la base de datos"));
    }
}

connectDB();

const server = express();

const corsOptions : CorsOptions = {
    origin: function(origin, callback) { 
        const whiteList =[process.env.FRONTEND_URL]
        if (!origin || whiteList.includes(origin)){ 
                callback(null, true) }
        else{
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions)) 

server.use(express.json());

server.use(morgan('dev')) 

server.get('/', (req, res) => {
    res.send('Backend Product Maintenance - API is running')
})

server.use('/api/products', router); 

server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOption) )

export default server