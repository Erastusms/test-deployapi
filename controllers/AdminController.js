const {
  Line_items,
  Movie,
  Movies_cart,
  Movies_actor,
  Movies_comment,
  Order,
  User,
} = require("../models");
const fs = require("fs-extra");
const path = require("path");
const { Op } = require("sequelize");

class AdminController {
  static async profilePage(req, res) {
    try {
      const id = req.userData.id;
      let users = await User.findByPk(id, {
        include: [Movies_comment, Movie, Movies_cart, Order],
      });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async actionConfirm(req, res) {
    try {
      const id = +req.params.id;
      
      const order = await Order.update(
        {
          status: "Confirm",
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async actionReject(req, res) {
    try {
      const id = +req.params.id;
      
      const order = await Order.update(
        {
          status: "Rejected",
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async showDashboard(req, res) {
    try {
      const users = await User.findAll();
      const movies = await Movie.findAll();
      const order = await Order.findAll();
      res.status(200).json({
        status: 200,
        message: "Admin validated!",
        dashboard: {
          users: users.length,
          movies: movies.length,
          order: order.length,
        },
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async showAllUsers(req, res) {
    try {
      const users = await User.findAll({
        include: [Movie, Movies_comment, Movies_cart, Order],
        order: [["id", "ASC"]],
      });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async showAllMovies(req, res) {
    try {
      let movies = await Movie.findAll({
        include: [Movies_actor, Movies_comment, Line_items],
        order: [["id", "ASC"]],
      });
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async showAllOrders(req, res) {
    try {
      let orders = await Order.findAll({
        order: [["id", "ASC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async showMyMovies(req, res) {
    try {
      const UserId = +req.userData.id;
      console.log(UserId);
      let movies = await Movie.findAll({
        where: { UserId },
        include: [Movies_actor, Movies_comment, Line_items],
        order: [["id", "ASC"]],
      });

      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async showActors(req, res) {
    try {
      const MovieId = +req.params.MovieId;
      let actors = await Movies_actor.findAll({
        where: { MovieId },
        include: [Movie],
        order: [["id", "ASC"]],
      });
      res.status(200).json(actors);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async detailMovies(req, res) {
    try {
      let id = +req.params.id;
      let movies = await Movie.findOne({
        where: { id },
        include: [Movies_actor, Movies_comment, Line_items],
      });
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addMovies(req, res) {
    try {
      const UserId = +req.userData.id;
      console.log(UserId);
      let file = req.file;
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
        price,
      } = req.body;

      let findMovie = await Movie.findOne({
        where: { title },
      });

      if (findMovie) {
        res.status(403).json({
          message: `Film ${title} already exist!`,
        });
      } else {
        let movies = await Movie.create({
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
          price,
          image: file ? file.filename : "blank.png",
          UserId,
        });

        res.status(201).json(movies);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addActors(req, res) {
    try {
      const MovieId = +req.params.MovieId;
      let file = req.file;
      let filesize = file.size;
      let filetype = file.mimetype;
      const { actor_name, char_name, year_date } = req.body;

      let actors = await Movies_actor.create({
        actor_name,
        char_name,
        year_date,
        filename: file ? file.filename : "blank.png",
        filesize,
        filetype,
        MovieId,
      });

      res.status(201).json(actors);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async editMovies(req, res) {
    try {
      let id = +req.params.id;
      let file = req.file;
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
      } = req.body;

      const movies = await Movie.findOne({ where: { id } });

      if (file) {
        file = file.filename;
        await fs.unlink(path.join(`public/images/movies/${movies.image}`));
      } else {
        file = movies.image;
      }
      await Movie.update(
        {
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
          image: file,
        },
        {
          where: { id },
        }
      );

      res.status(200).json({
        message: `Movie berhasil diupdate!`,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteMovies(req, res) {
    try {
      let id = +req.params.id;
      let movies = await Movie.findByPk(id);
      let actors = await Movies_actor.findAll({ where: { MovieId: id } });

      for (let i = 0; i < actors.length; i++) {
        await fs.unlink(
          path.join(`public/images/actors/${actors[i].filename}`)
        );
      }

      await fs.unlink(path.join(`public/images/movies/${movies.image}`));
      await Movie.destroy({
        where: { id },
      });
      await Movies_actor.destroy({
        where: { MovieId: id },
      });
      await Movies_comment.destroy({
        where: { MovieId: id },
      });
      const carts = await Movies_cart.findAll();
      carts.forEach(async (cart) => {
        const line_items = await Line_items.findAll({
          where: { MoviesCartId: cart.id, status: "cart" },
        });

        if (line_items.length === 1) {
          await Movies_cart.destroy({
            where: { id: cart.id },
          });
        }

        await Line_items.destroy({
          where: { MovieId: id, status: "cart" },
        });
      });
      res.status(200).json({
        message: "This movie has been deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: "Error di controller",
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = +req.params.id;
      const user = await User.findByPk(id);
      const avatar = user.avatar;

      await fs.unlink(path.join(`public/images/avatars/${avatar}`));
      const movies = await Movie.findAll({
        where: { UserId: id },
        include: [Movies_actor, Movies_comment, Line_items],
      });

      for (let i = 0; i < movies.length; i++) {
        const moviesImage = movies[i].image;
        const actors = movies[i].Movies_actors;
        const lineItems = movies[i].Line_items;
        await fs.unlink(path.join(`public/images/movies/${moviesImage}`));
        for (let j = 0; j < actors.length; j++) {
          const actorsImage = actors[j].filename;
          const actorsId = actors[j].id;

          await Movies_actor.destroy({
            where: { id: actorsId },
          });
          await fs.unlink(path.join(`public/images/actors/${actorsImage}`));
        }

        if (lineItems > 0) {
          for (let k = 0; k < lineItems.length; k++) {
            const lineitemsId = lineItems[k].id;

            await Line_items.destroy({
              where: { id: lineitemsId },
            });
          }
        }
      }

      await User.destroy({ where: { id } });
      await Movie.destroy({ where: { UserId: id } });
      await Movies_cart.destroy({ where: { UserId: id } });
      await Movies_comment.destroy({ where: { UserId: id } });
      await Order.destroy({ where: { UserId: id } });

      res.status(200).json({
        message: "Berhasil dihapus",
      });
    } catch (err) {
      res.status(500).json({
        message: "Error di controller",
      });
    }
  }

  static async deleteActors(req, res) {
    try {
      const id = +req.params.id;
      const actors = await Movies_actor.findByPk(id);
      await Movies_actor.destroy({ where: { id } });
      await fs.unlink(path.join(`public/images/actors/${actors.filename}`));

      res.status(200).json({
        message: "Berhasil dihapus",
      });
    } catch (err) {
      res.status(500).json({
        message: "Error di controller",
      });
    }
  }
}

module.exports = AdminController;
