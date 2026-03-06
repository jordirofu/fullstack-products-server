import { Request, Response } from 'express'
import Product from '../models/Product.model'
import { check, validationResult } from 'express-validator'


//asignemos tipos a req y res para tener buen autocompletado
export const createProduct = async (req: Request, res: Response) => { //siempre async xq llamarás a bd

    //al final, movimos validaciones a router, que es más cercano al usuario, primero...
    //    await check('name').notEmpty().withMessage('El nombre del producto no puede estar vacío').run(req);
    //     await check('price')
    //     .notEmpty().withMessage('El nombre del producto no puede estar vacío')
    //     .isNumeric().withMessage('El número ha de ser numérico')
    //     .custom((value)=> value > 0).withMessage('El número ha de ser nayor de 0o')
    //     .run(req)  //hace falta correr la req para poder validar


    //pero como queda raro encontrarnos de primeras con este código.. podemos moverlo al middleware de Node 
    //lo movemos al middleware que hemos creado para manejar los errores

    // let errors = validationResult(req);
    //    if (!errors.isEmpty()) {
    //     return res.status(400).json({errors: errors.array()})
    //    }  




    try {
        // const product = new Product(req.body) //estás creando objeto tipo Product de ProductModel.ts
        // const savedProduct = await product.save();
        //la linea de abajo hace lo mismo que las 2 de arriba juntas.
        const savedProduct = await Product.create(req.body)

        res.status(201).json({data: savedProduct}) //es una convención... creas un objeto que tiene una propiedad que se llama
        //data, que contiene el objeto product. Podrías devolver sencillamente product también...

    } catch (error) {
        console.log(error);
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        //const products = await Product.findAll() //findAll()..método de sequelize
        const products = await Product.findAll({
            order: [
                ['id', 'DESC']
            ],
            //limit: 2, //cuantos elementos trae... viene a ser el top,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
        res.json({ data: products })  //DEVUELVES UN OBJETO CON PROPIEDAD DATA Y VALOR PRODUCTS... ES CONVENCIÓN (LO DE DATA). 
    } catch (error) {                   //ESTÁ DENTRO DEL OBJETO BODY DE LA RESPUESTA
        console.log(error);
    }

}

export const getProductById = async (req: Request, res: Response) => {
    //const { productId } = req.params;
    const productId = Number(req.params.productId)

    try {
        // const product = await Product.findOne({
        //     where: { id: productId },
        //     attributes: { exclude: ['createdAt', 'updatedAt'] }
        // })
        const product = await Product.findByPk(productId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })

        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'  //sencillax devuelves un objeto con una propiedad error que contiene un texto de error
            })
        }

        res.json({ data: product })
    } catch (error) {
        console.log(error);
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'  //sencillax devuelves un objeto con una propiedad error que contiene un texto de error
            })}
            await product.update(req.body);
            await product.save();
            //IMP: put hace actualizaciones totales.con lo que le mandes: si le mandas una sola propiedad… eliminará del registro las que no le has mandado.
            //el “update” de sequelize te protege de ello: aunque en req.body haya una sola propiedad… cambia esa y mantiene el resto
            //de todas maneras, podrías poner validaciones en router para esta acción, obligando a que se informaran todas las propiedades.
            res.json({ data: product });
        }

     catch (error) {
        console.log(error);
    }
}

export const updateAvailability = async (req: Request, res: Response) => {

    const productId = Number(req.params.productId);
    try {
        const product = await Product.findByPk(productId);
         if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        //await product.update(req.body); para no enviarle el valor, sino hacer un toggle
        product.availability = !product.dataValues.availability
        await product.save();
  
        res.json({ data: product });
    } catch (error) {
        console.log(error);
    }
}

export const deleteProduct =  async (req: Request, res: Response) => {
       const productId = Number(req.params.productId);
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        await product.destroy()
        //eliminado lógico:
        //en vez de sacar de base de datos... columna visible true o false.
  
        res.json({ data: 'Producto eliminado' });
    } catch (error) {
        console.log(error);
    }
}


