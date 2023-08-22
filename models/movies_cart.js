"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movies_cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movies_cart.belongsTo(models.User);
      Movies_cart.hasMany(models.Line_items);
    }
  }
  Movies_cart.init(
    {
      status: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (cart, options) => {
          cart.status = "open";
        },
      },
      modelName: "Movies_cart",
    }
  );
  return Movies_cart;
};
