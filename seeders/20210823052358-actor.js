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
    let actors = JSON.parse(
      fs.readFileSync("./seeders/data/actor.json", "utf8")
    );
    let actorData = actors.map((actor) => {
      const {
        actor_name,
        char_name,
        year_date,
        filename,
        filesize,
        filetype,
        MovieId,
      } = actor;
      return {
        actor_name,
        char_name,
        year_date,
        filename,
        filesize,
        filetype,
        MovieId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Movies_actors", actorData, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Movies_actors", null, {});
  },
};
