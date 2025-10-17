import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js'; // Importa la instancia de conexión

const Product = sequelize.define('Products', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
},
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }

}, {
  // Opciones del modelo
  tableName: 'Products',
  timestamps: true,

  // Índices para mejorar la búsqueda
  //indexes: [
   // {
   //   unique: true,
   //   fields: ['email']
    //}
    
  //]
});

// Exporta el modelo
export default Product;