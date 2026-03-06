import request from 'supertest'
import server from '../../server'
import { clearDb } from '../../data'
import Product from '../../models/Product.model'

describe('Products API', () => {

    //estos beforeAll y afterAll son mi forma de crear datos especiales para los
    //tests, que la ejecución de unos no dependa de la ejecución de otros,
    //y que no haya una creación y borrado de tests en cada test (muy lento)
    //hay opciones más PRO como lo de hacer transactions y luego rollback.

    let idProductToGet: number;
    let idProductToDelete: number;
    let idProductToPut: number;
    let idProductToPatch: number;

    // beforeEach(() => clearDb())
    beforeAll(async () => {
        const objectToGet = {
            name: "Test element to get",
            price: 290
        }
        const savedProductToGet = await Product.create(objectToGet)
        if (savedProductToGet) {
            idProductToGet = savedProductToGet.id;
        }
        else {
            throw new Error("Product to get could not be saved");
        }

        const objectToDelete = {
            name: "Test element to delete",
            price: 40
        }
        const savedProductToDelete = await Product.create(objectToDelete)
        if (savedProductToDelete) {
            idProductToDelete = savedProductToDelete.id;
        }
        else {
            throw new Error("Product to delete could not be saved");
        }

        const objectToPut = {
            name: "Test element to put",
            price: 440
        }
        const savedProductToPut = await Product.create(objectToPut)
        if (savedProductToPut) {
            idProductToPut = savedProductToPut.id;
        }
        else {
            throw new Error("Product to put could not be saved");
        }

         const objectToPatch = {
            name: "Test element to patch",
            price: 30
        }
        const savedProductToPatch = await Product.create(objectToPatch)
        if (savedProductToPatch) {
            idProductToPatch = savedProductToPatch.id;
        }
        else {
            throw new Error("Product to patch could not be saved");
        }
    })

    afterAll(() => clearDb());

    describe('POST /api/products', () => {

        describe('when request body is valid', () => {
            it('should create a new product and return 201', async () => {
                const res = await request(server).post('/api/products').send({ name: "Tablet Realme - Testing ", price: 322 })

                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('data')

                expect(res.status).not.toBe(400)
                expect(res.body).not.toHaveProperty('errors')

            })
        })


        describe('when empty body', () => {
            it('should return 400 ', async () => {
                const res = await request(server).post('/api/products').send({})

                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors')
                expect(res.body.errors).toHaveLength(3)

                expect(res.status).not.toBe(200)
                expect(res.body.errors).not.toHaveLength(2)
            })
        })

        describe('when price is not greater than 0', () => {
            it('should return 400', async () => {
                const res = await request(server).post('/api/products').send({ name: "Tablet Realme - Testing ", price: 0 })

                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors')
                expect(res.body.errors).toHaveLength(1)

                expect(res.status).not.toBe(200)
                expect(res.body.errors).not.toHaveLength(2)
            })
        })

        describe('when price is not numeric', () => {
            it('shoul validate that price is numeric', async () => {
                const res = await request(server).post('/api/products').send({ name: "Tablet Realme - Testing ", price: "Hola" })

                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('errors')
                expect(res.body.errors).toHaveLength(2)

                expect(res.status).not.toBe(200)
                expect(res.body.errors).not.toHaveLength(1)
            })
        })
    })

    describe('GET api/products', () => {
        describe('when request is correct', () => {
            it('should return 200 and data', async () => {
                const response = await request(server).get('/api/products')
                expect(response.status).toBe(200);
                //2 formas de comprobar... Match-expresión regular. Contain-string
                expect(response.headers['content-type']).toMatch(/json/);
                expect(response.headers['content-type']).toContain("application/json");
                //expect(response.body.data).toHaveLength(1);
                expect(response.status).not.toBe(404);
            })
        })
    })

    describe('GET api/products:id', () => {
        describe('when request is correct', () => {
            it('should respond with 200 and a JSON with a single product', async () => {
                const response = await request(server).get(`/api/products/${idProductToGet}`)
                expect(response.status).toBe(200);
                //2 formas de comprobar... Match-expresión regular. Contain-string
                expect(response.headers['content-type']).toMatch(/json/);
                expect(response.headers['content-type']).toContain("application/json");
                expect(response.body.data).toBeTruthy();
                //expect(response.body).toHaveProperty('data')
            })
        })
        describe('when id requested does not exist', () => {
            it('should return 404', async () => {
                const id = 2000
                const response = await request(server).get(`/api/products/${id}`)
                expect(response.status).toBe(404);
                expect(response.body.error).toBe('Producto no encontrado')
            })
        })
        describe('when id requested is not numeric', () => {
            it('should return 400 and id not valid message', async () => {
                const id = "Hola";
                const response = await request(server).get(`/api/products/${id}`)
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors[0].msg).toBe("Id no válido, ha de ser numérico");
                //expect(response.body.errors).toContain()
            })
        })

    })

    describe('PUT /api/product:productId', () => {
        describe('when request is correct', () => {
            it('should return 200 and modified product', async () => {
                const updatedProduct = {
                    "name": "Ergonomic Keyboard",
                    "price": 115,
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${idProductToPut}`).send(updatedProduct);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('data');
                expect(response.body.data.name).toBe(updatedProduct.name);
                expect(response.body.data.price).toBe(updatedProduct.price);

            })
        })

        describe('when requested id does not exist', () => {
            it('should return 404', async () => {
                const id = 2000;
                const updatedProduct = {
                    "name": "Ergonomic Keyboard",
                    "price": 115,
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(404);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toBe('Producto no encontrado')

            })
        })
        describe('when sent body is empty', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {}
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(7)

            })
        })

        describe('when requested id is not numeric', () => {
            it('should return 400', async () => {
                const id = "hola";
                const updatedProduct = {
                    "name": "Ergonomic Keyboard",
                    "price": 115,
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe("Id no válido, ha de ser numérico")

            })
        })
        describe('when name is empty', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": "",
                    "price": 115,
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe("El nombre de producto no puede estar vacío")
            })
        })
        describe('when name is not a string', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": 3,
                    "price": 115,
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe("El nombre del producto debe ser alfanumérico")
            })
        })
        describe('when price is empty', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": "Ergonomic keyboard",
                    "price": '',
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(3)
                expect(response.body.errors[0].msg).toBe("El precio del producto no puede estar vacío")
            })
        })
        describe('when price is not numeric', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": "Ergonomic keyboard",
                    "price": "hola",
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(2)
                expect(response.body.errors[0].msg).toBe("El precio del producto debe ser numérico")
            })
        })
        describe('when price is not greater than 0', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": "Ergonomic keyboard",
                    "price": -1,
                    "availability": true
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe("El precio ha de ser mayor de 0")
            })
        })
        describe('when availability is empty', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": "Ergonomic keyboard",
                    "price": 100,
                    "availability": ''
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(2)
                expect(response.body.errors[0].msg).toBe("La disponibilidad no puede estar vacía")
            })
        })
        describe('when availability is not a boolan value', () => {
            it('should return 400', async () => {
                const id = 1;
                const updatedProduct = {
                    "name": "Ergonomic keyboard",
                    "price": 100,
                    "availability": "hola"
                }
                const response = await request(server).put(`/api/products/${id}`).send(updatedProduct);

                expect(response.status).toBe(400);
                expect(response.body).not.toHaveProperty('data');
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe("La disponibilidad ha de ser un valor booleano")
            })
        })
    })

    describe ('PATCH /api/prducts/:productId', ()=> {
        describe('When request is correct', ()=> {
            it('should return 200', async ()=> {
                const response = await request(server).get(`/api/products/${idProductToPatch}`);
                const initAvailability = response.body.data.availability;
                
                const response2 = await request(server).patch(`/api/products/${idProductToPatch}`);
                expect(response2.status).toBe(200);
                expect(response2.body.data).toBeTruthy();
                expect(response2.body.errors).toBeFalsy();
                expect(response2.body.data.availability).not.toBe(initAvailability);
            })
        })

        describe('When requested id does not exist', ()=>{
            it('should return 404', async ()=> {
                const id = 2000
                const response = await request(server).patch(`/api/products/${id}`);

                expect(response.status).toBe(404);
                expect(response.body.error).toBeTruthy();
                expect(response.body.data).toBeFalsy();
                expect(response.body.error).toBe('Producto no encontrado');
            })
        })

         describe('When requested id is not numeric', ()=>{
            it('should return 404', async ()=> {
                const id = "hola"
                const response = await request(server).patch(`/api/products/${id}`);

                expect(response.status).toBe(400);
                expect(response.body.errors).toBeTruthy();
                expect(response.body.data).toBeFalsy();
                expect(response.body.errors[0].msg).toBe('Id no válido, ha de ser numérico')
            })
        })
    })

    describe('DELETE /api/products/:productId', () => {
        describe('when id is correct', () => {
            it('should return 200 and getById should return 404', async () => {
                const response = await request(server).delete(`/api/products/${idProductToDelete}`);
                expect(response.status).toBe(200);
                expect(response.body.data).toBe('Producto eliminado');

                const response2 = await request(server).get(`/api/products/${idProductToDelete}`);
                expect(response2.status).toBe(404)
                expect(response2.body.data).toBeFalsy();
                expect(response2.body.error).toBeTruthy();
            })
        })
        describe('when requested id does not exist', () => {
            it('should return 404', async () => {
                const id = 2999;
                const response = await request(server).delete(`/api/products/${id}`);
                expect(response.status).toBe(404);
                expect(response.body.data).toBeFalsy();
                expect(response.body.error).toBeTruthy();
                expect(response.body.error).toBe('Producto no encontrado');

            })
        })
        describe('when requested id is not numeric', () => {
            it('should return 400', async () => {
                const id = "hola";
                const response = await request(server).delete(`/api/products/${id}`);
                expect(response.status).toBe(400);
                expect(response.body.data).toBeFalsy();
                expect(response.body.errors).toHaveLength(1);
                expect(response.body.errors[0].msg).toBe("Id no válido, ha de ser numérico");
            })
        })
    })

})
