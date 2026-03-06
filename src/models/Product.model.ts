import { Table, Column, Model, DataType, Default} from 'sequelize-typescript'
//estos son los decoradoes que utilizaremos, y que empiezan por arroba: table, column, etc.

@Table({
    tableName: 'products'
})

//Model es una clase que heredas y reescribes para hacer tu modelo. Le pones los atributos, en este caso del modelo que defines
//el id te lo da normalmente cuando vas a hacer el registro
//CURIOSO: Objeto con propiedades dentro de Column... pero debajo el nombre del atributo con el tipo, tmbién.
class Product extends Model { //Model es de sequelize-typescript... lo que le dará métodos create, etc.
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.FLOAT
    })
    declare price: number

    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean
}

export default Product
