import {Request, Response, NextFunction} from 'express'

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): Response => {
    if (err instanceof BaseCustomError){
        return res.status()
    }
}