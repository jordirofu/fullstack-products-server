import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
        //errors devuelto por validationResult no es un array plano... sí tiene el 
        //método .array() que lo convierte a un array plano.
    }
    next();
}