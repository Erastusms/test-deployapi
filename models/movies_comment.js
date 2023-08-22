"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movies_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movies_comment.belongsTo(models.User);
      Movies_comment.belongsTo(models.Movie);
    }
  }
  Movies_comment.init(
    {
      comments: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            message: "field cannot be empty!",
          },
        },
      },
      MovieId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movies_comment",
    }
  );
  return Movies_comment;
};
