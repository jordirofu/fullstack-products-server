import { Router } from 'express'
import { createProduct, getAllProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from './handlers/product';
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware';

const router = Router();

// router.post('/', (req, res) => { //siempre que comunicas con un servidor, hay req y resp.
//     res.json('Desde POST')
// })
//Lo de arriba... lo hemos llevado a la carpeta handlers, para tener más limpio router.ts

/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: product id
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: product name
 *                      example: 'Monitor curvo UW'
 *                  price:
 *                      type: integer
 *                      description: product price
 *                      example: 280
 *                  availability:
 *                      type: boolean
 *                      description: product availability
 *                      example: true
 */




/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Adds a new product
 *          tags: 
 *              - Products
 *          description: Saves/adds a new product in database
 *          responses: 
 *               201: 
 *                 description: Product added successfully
 *                 content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'                  
 *               400:
 *                 description: Bad request - Invalid input data
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor curvo UW"
 *                              price:
 *                                  type: number
 *                                  example: 290              
 *   
 */
//validaciones. LAs sacaste de handler, y las has hecho servir aquí antes. Aquí utilizas "body" para atacar los atributos que llegan en el body
router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede estar vacío'),
    body('price')
        .isNumeric().withMessage('El número ha de ser numérico')
        .custom((value) => value > 0).withMessage('El número ha de ser nayor de 0'),

    handleInputErrors, //es el middleware que metes para manejar los errores encontrados en body(...)

    createProduct)

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get list of existing products
 *          tags: 
 *              - Products
 *          description: Return the list of existing products
 *          responses: 
 *              200: 
 *                  description: Successful response
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:    
 *                                  $ref: '#/components/schemas/Product'
 */
router.get('/', getAllProducts)


/**
 * @swagger
 * /api/products/{productId}:
 *      get:
 *          summary: Get a product by id
 *          tags: 
 *              - Products
 *          description: Return a product based on its unique id
 *          parameters:
 *            - in: path
 *              name: productId
 *              description: Product id to retrieve
 *              required: true
 *              schema:
 *                  type: integer          
 *          responses: 
 *              200: 
 *                  description: Successful response
 *                  content: 
 *                      application/json:
 *                          schema:
 *                            $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Product not found
 *              400:
 *                  description: Bad request - invalid id
 */
router.get('/:productId',
    param('productId').isInt().withMessage("Id no válido, ha de ser numérico"),
    handleInputErrors,
    getProductById)


/**
 * @swagger
 * /api/products/{productId}:
 *      put:
 *          summary: Updates a product with user input
 *          tags: 
 *              - Products
 *          description: Modifies/replaces a product based on its unique id
 *          parameters:
 *            - in: path
 *              name: productId
 *              description: Product id to modify
 *              required: true
 *              schema:
 *                  type: integer  
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor curvo UW"
 *                              price:
 *                                  type: number
 *                                  example: 290
 *                              availability:
 *                                  type: boolean
 *                                  example: true        
 *          responses: 
 *              200: 
 *                  description: Product modified successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad request - Invalid id or invalid input data
 *              404:
 *                  description: Product not found 
 */
router.put('/:productId',
    param('productId').isInt().withMessage("Id no válido, ha de ser numérico"),
    body('name')
        .notEmpty().withMessage('El nombre de producto no puede estar vacío')
        .isString().withMessage('El nombre del producto debe ser alfanumérico'),
    body('price')
        .notEmpty().withMessage('El precio del producto no puede estar vacío')
        .isInt().withMessage('El precio del producto debe ser numérico')
        .custom(value => value > 0).withMessage('El precio ha de ser mayor de 0'),
    body('availability')
        .notEmpty().withMessage('La disponibilidad no puede estar vacía')
        .isBoolean().withMessage('La disponibilidad ha de ser un valor booleano'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{productId}:
 *      patch:
 *          summary: Toggles a product availability
 *          tags: 
 *              - Products
 *          description: Toggles a product availability based on its unique id
 *          parameters:
 *            - in: path
 *              name: productId
 *              description: Product id whose availability will be toggled
 *              required: true
 *              schema:
 *                  type: integer          
 *          responses: 
 *              200: 
 *                  description: Successful response
 *                  content: 
 *                      application/json:
 *                          schema:
 *                            $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Product not found
 *              400:
 *                  description: Bad request - Invalid id or invalid input data
 */
router.patch('/:productId',
    param('productId').isInt().withMessage("Id no válido, ha de ser numérico"),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{productId}:
 *      delete:
 *          summary: Removes a product
 *          tags: 
 *              - Products
 *          description: Removes a product from database based on its unique id
 *          parameters:
 *            - in: path
 *              name: productId
 *              description: Product id to be deleted
 *              required: true
 *              schema:
 *                  type: integer          
 *          responses: 
 *              404:
 *                  description: Product not found
 *              400:
 *                  description: Bad request - Invalid id or invalid input data
 *              200: 
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: string
 *                                      description: deleted message
 *                                      example: 'Producto eliminado'
 */
router.delete('/:productId',
    param('productId').isInt().withMessage("Id no válido, ha de ser numérico"),
    handleInputErrors,
    deleteProduct
)

export default router