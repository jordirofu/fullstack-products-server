import { connectDB } from '../server'
import db from '../config/db'

jest.mock('../config/db')

describe('Connect DB', () => {
    it('should return error message when it can not connect to db', async () => {

        jest.mocked(db.authenticate).mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
        const consoleSpy = jest.spyOn(console, 'log'); 

        await connectDB();
        expect(consoleSpy).toHaveBeenCalledWith( 
            expect.stringContaining("Hubo un error al conectar a la base de datos")
        )
    })
})

