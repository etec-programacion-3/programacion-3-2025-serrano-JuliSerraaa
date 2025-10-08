// src/routes/auth.routes.js

import { Router } from 'express';
// Importa las funciones específicas del controller
import { register, login } from '../controllers/auth.controller.js'; 

const router = Router();

// Endpoint: POST /register
router.post('/register', register);

// Endpoint: POST /login
router.post('/login', login);

//Endpoint: GET /products
router.get('/products', getProducts)

//Endpoint: GET /products{id}
router.get('/products/{id}', getProductsId)

//Endpoint: POST /products
router.post('/products', addProduct)

//Endpoint: PUT /products{id}
router.put('/products/{id}', putProduct)

//Endpoint: DELETE /products{id}
router.delete('/products/{id}', deleteProduct)


export default router;