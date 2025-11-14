// src/models/purchase.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';
import User from './user.js';
import Product from './products.js';

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'productId'
    }
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'completed'
  }
}, {
  tableName: 'purchases',
  timestamps: true
});

// Asociaciones simples
Purchase.belongsTo(User, { foreignKey: 'buyerId', as: 'Buyer' });
Purchase.belongsTo(User, { foreignKey: 'sellerId', as: 'Seller' });
Purchase.belongsTo(Product, { foreignKey: 'productId' });

export default Purchase;