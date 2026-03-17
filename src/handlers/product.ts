import { Request, Response } from 'express'
import Product from '../models/Product.model'


export const createProduct = async (req: Request, res: Response) => {

    try {
        const savedProduct = await Product.create(req.body)
        res.status(201).json({ data: savedProduct })
    } catch (error) {
        console.log(error)
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
        res.json({ data: products })
    } catch (error) {
        console.log(error)
    }

}

export const getProductById = async (req: Request, res: Response) => {
    const productId = Number(req.params.productId)
    try {
        const product = await Product.findByPk(productId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })

        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        res.json({ data: product })
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    try {
        const product = await Product.findByPk(productId)

        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        await product.update(req.body)
        res.json({ data: product })
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
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({ data: product })
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = Number(req.params.productId)
    try {
        const product = await Product.findByPk(productId)
        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        await product.destroy()
        res.json({ data: 'Producto eliminado' })
    } catch (error) {
        console.log(error);
    }
}


