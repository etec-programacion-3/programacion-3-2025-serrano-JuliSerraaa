import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js'; // Importa la instancia de conexión

const User = sequelize.define('Products', {
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
}
}, {
  // Opciones del modelo
  tableName: 'products',
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
export default Products;