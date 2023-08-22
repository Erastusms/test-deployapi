"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movies_actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movies_actor.belongsTo(models.Movie);
    }
  }
  Movies_actor.init(
    {
      actor_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Actor Name cannot be empty!",
          },
        },
      },
      char_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Char Name cannot be empty!",
          },
        },
      },
      year_date: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Year Date cannot be empty!",
          },
        },
      },
      filename: DataTypes.STRING,
      filesize: DataTypes.STRING,
      filetype: DataTypes.STRING,
      MovieId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movies_actor",
    }
  );
  return Movies_actor;
};
