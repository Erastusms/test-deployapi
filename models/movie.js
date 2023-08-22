"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.User);
      Movie.hasMany(models.Movies_comment);
      Movie.hasMany(models.Movies_actor);
      Movie.hasMany(models.Line_items);
    }
  }
  Movie.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title cannot be empty!",
          },
          notNull: true,
        },
      },
      episode: {
        type: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: {
              message: "Episode cannot be empty!",
            },
            isInt: true,
            notNull: true,
          },
        },
      },
      director: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Director cannot be empty!",
          },
        },
      },
      studio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Studio cannot be empty!",
          },
        },
      },
      tv_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Tv status cannot be empty!",
          },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Duration cannot be empty!",
          },
          isInt: true,
          notNull: true,
        },
      },
      release: DataTypes.DATEONLY,

      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Country cannot be empty!",
          },
        },
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Genre cannot be empty!",
          },
        },
      },
      rating_tmdb: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Rating cannot be empty!",
          },
        },
      },
      network: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Network cannot be empty!",
          },
        },
      },
      trailer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Trailer cannot be empty!",
          },
        },
      },
      views: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            message: "Views cannot be empty!",
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            message: "Price cannot be empty!",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      UserId: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate(movie, options) {
          movie.views = 0;
        },
      },
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
