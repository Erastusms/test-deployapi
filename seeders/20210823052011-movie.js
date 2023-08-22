"use strict";
const fs = require("fs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let movies = JSON.parse(
      fs.readFileSync("./seeders/data/movie.json", "utf8")
    );
    let moviesData = movies.map((movie) => {
      const {
        title,
        episode,
        director,
        studio,
        tv_status,
        duration,
        release,
        country,
        genre,
        rating_tmdb,
        network,
        trailer,
        views,
        price,
        image,
        UserId,
      } = movie;
      return {
        title,
        episode,
        director,
        studio,
        tv_status,
        duration,
        release,
        country,
        genre,
        rating_tmdb,
        network,
        trailer,
        views,
        price,
        image,
        UserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Movies", moviesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Movies", null, {});
  },
};
