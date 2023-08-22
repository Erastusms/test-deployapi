"use strict";
const { Model } = require("sequelize");
const { encrypter } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Movie);
      User.hasMany(models.Movies_comment);
      User.hasMany(models.Movies_cart);
      User.hasMany(models.Order);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      type: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = encrypter(user.password);
          user.type = "user";
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
