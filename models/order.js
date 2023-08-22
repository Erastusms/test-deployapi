"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User);
      Order.hasMany(models.Line_items);
    }
  }
  Order.init(
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      subtotal: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: {
            message: "Field cannot be empty!",
          },
        },
      },
      discount: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: {
            message: "Field cannot be empty!",
          },
        },
      },
      tax: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: {
            message: "Field cannot be empty!",
          },
        },
      },
      total_due: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: {
            message: "Field cannot be empty!",
          },
        },
      },
      total_qty: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            message: "Field cannot be empty!",
          },
        },
      },
      // invoice
      payt_trx_number: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "Field cannot be empty!",
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "City cannot be null!",
          },
          notEmpty: {
            msg: "City cannot be empty!",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address cannot be null!",
          },
          notEmpty: {
            msg: "Address cannot be empty!",
          },
        },
      },
      status: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (order, options) => {
          order.status = "Process";
        },
      },
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
