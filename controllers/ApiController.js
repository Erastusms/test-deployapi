const {
  Line_items,
  Movie,
  Movies_cart,
  Movies_actor,
  Movies_comment,
  Order,
  User,
} = require("../models");
const { decrypter, encrypter } = require("../helpers/bcrypt");
const { tokenGenerator } = require("../helpers/jwt");
const fs = require("fs-extra");
const path = require("path");
const randomstring = require("randomstring");

class ApiController {
  static async register(req, res) {
    try {
      let file = req.file;
      const { name, email, password, birthdate, gender } = req.body;
      let mail = email.toLowerCase();
      let findEmail = await User.findOne({
        where: { email },
      });

      if (findEmail) {
        res.status(403).json({
          message: "Email already exist!",
        });
      } else {
        let user = await User.create({
          name,
          email: mail,
          password,
          birthdate,
          gender,
          avatar: file ? file.filename : "blank.png",
        });
        res.status(201).json(user);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({
        where: { email },
      });

      if (user) {
        if (decrypter(password, user.password)) {
          let access_token = tokenGenerator(user);
          res.status(200).json({
            status: 200,
            message: "You are successfully logged in",
            user,
            access_token,
          });
        } else {
          res.status(403).json({
            message: "Password is Invalid!",
          });
        }
      } else {
        res.status(404).json({
          message: "User not found!",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async profilePage(req, res) {
    try {
      const id = +req.userData.id;
      let users = await User.findByPk(id, {
        include: [Movies_comment, Movie, Movies_cart, Order],
      });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updateProfile(req, res) {
    const userData = req.userData;
    const file = req.file;
    const { name, birthdate, gender } = req.body;

    try {
      const user = await User.findOne({ where: { email: userData.email } });

      // if (file) {
      //   file = file.filename;
      //   await fs.unlink(path.join(`public/images/avatars/${user.avatar}`));
      // } else {
      //   file = user.avatar;
      // }

      await User.update(
        {
          name,
          birthdate,
          gender,
          avatar: file ? file.filename : "blank.png",
        },
        { where: { email: user.email } }
      );

      const userAfterUpdate = await User.findOne({
        where: { email: userData.email },
      });

      res.status(200).json({
        status: 200,
        message: "User data has been updated!",
        user: userAfterUpdate,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async homePage(req, res) {
    try {
      const allMovies = await Movie.findAll({
        include: [Movies_comment, Movies_actor],
      });
      const movieCompleted = await Movie.findAll({
        include: [Movies_comment, Movies_actor],
        where: {
          tv_status: "COMPLETED",
        },
        order: [["id", "ASC"]],
      });
      const movieCS = await Movie.findAll({
        include: [Movies_comment, Movies_actor],
        where: {
          tv_status: "COMING SOON",
        },
      });
      const movieOA = await Movie.findAll({
        include: [Movies_comment, Movies_actor],
        where: {
          tv_status: "ON AIR",
        },
      });

      res.status(200).json({
        allMovies,
        movieCompleted,
        movieCS,
        movieOA,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async detailMoviePage(req, res) {
    try {
      const id = +req.params.id;
      const movie = await Movie.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["name", "avatar"],
          },
          {
            model: Movies_comment,
            include: [
              {
                model: User,
                attributes: ["name", "avatar"],
              },
            ],
          },
          {
            model: Movies_actor,
            include: [{ model: Movie, attributes: ["title"] }],
          },
        ],
      });

      await movie.increment({
        views: 1,
      });

      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async myCartPage(req, res) {
    try {
      const UserId = +req.userData.id;
      const cart = await Movies_cart.findAll({
        where: { UserId },
        include: [
          {
            model: Line_items,
            where: { status: "cart" },
            include: [Movie],
            order: [["id", "ASC"]],
          },
        ],
        order: [["id", "ASC"]],
      });

      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addToCart(req, res) {
    try {
      const UserId = +req.userData.id;
      const MovieId = +req.params.id;
      // const { qty } = req.body;

      let qty = 1;
      const movies = await Movie.findByPk(MovieId);

      const cartMovies = await Movies_cart.findAll({
        where: { UserId },
        include: [
          {
            model: Line_items,
            include: [Movie],
            order: [[Movie, "id", "ASC"]],
          },
        ],
        order: [["id", "ASC"]],
      });

      if (cartMovies.length > 0) {
        const carts = cartMovies;

        let scID = 0;
        let moviesFound = false;

        carts.forEach(async (cart) => {
          let foundSeller = false;

          cart.Line_items.forEach(async (line_item) => {
            if (line_item.Movie.UserId === movies.UserId) {
              foundSeller = true;
              scID = cart.id;
            }

            if (line_item.MovieId === MovieId && line_item.status === "cart") {
              moviesFound = true;
              await Line_item.update(
                { qty: line_item.qty + qty },
                { where: { id: line_item.id } }
              );
              return false;
            }
          });
        });

        if (scID > 0 && moviesFound === false) {
          await Line_items.create({
            MoviesCartId: scID,
            MovieId: MovieId,
            qty,
          });
        }

        if (scID === 0 && moviesFound === false) {
          const shop = await Movies_cart.create({
            UserId,
          });

          await Line_items.create({
            MoviesCartId: shop.id,
            MovieId: MovieId,
            qty,
          });
        }
      } else {
        const shop = await Movies_cart.create({
          UserId,
        });

        await Line_item.create({
          MoviesCartId: shop.id,
          MovieId: MovieId,
          qty,
        });
      }

      const cart = await Movies_cart.findAll({
        where: { UserId },
        include: [
          {
            model: Line_items,
            include: [Movie],
            order: [[Movie, "id", "ASC"]],
          },
        ],
        order: [["id", "ASC"]],
      });

      res.status(201).json({
        status: 201,
        message: "Your movies has been successfully added to cart!",
        cart,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updateCartItem(req, res) {
    try {
      const id = +req.params.id;
      const qty = +req.body.qty;
      const line_items = await Line_items.findByPk(id);

      if (line_items === null) {
        res.status(404).json({
          message: `Line items ${id} not found`,
        });
      } else {
        await Line_items.update({ qty }, { where: { id } });

        res.status(200).json({
          status: 200,
          message: "Successfully update cart item!",
          line_items,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteCartItem(req, res) {
    try {
      const id = +req.params.id;
      const line_items = await Line_items.findByPk(id);

      const total_line_item = await Line_items.findAll({
        where: { MoviesCartId: line_items.MoviesCartId, status: "cart" },
      });

      if (total_line_item.length === 1) {
        await Movies_cart.destroy({
          where: { id: line_items.MoviesCartId },
        });
      }

      await Line_items.destroy({ where: { id, status: "cart" } });

      res.status(200).json({
        status: 200,
        message: "Successfully remove cart item!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteCart(req, res) {
    try {
      const UserId = +req.userData.id;

      const moviesCart = await Movies_cart.findAll({ where: { UserId } });

      moviesCart.forEach(async (cart) => {
        // console.log(cart.id);
        const line_items = await Line_items.findAll({
          where: { MoviesCartId: cart.id, status: "cart" },
        });
        line_items.forEach(async (line_item) => {
          await Line_items.destroy({ where: { id: line_item.id } });
        });
        await Movies_cart.destroy({ where: { id: cart.id } });
      });

      res.status(200).json({
        status: 200,
        message: "Successfully remove cart!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async orderSummary(req, res) {
    const UserId = +req.userData.id;

    const shoppingCarts = await Movies_cart.findAll({
      where: { UserId, status: "open" },
      attributes: ["id"],
      include: [
        {
          model: Line_items,
          where: { status: "cart" },
          attributes: ["id", "MovieId", "qty"],
          include: [
            {
              model: Movie,
              attributes: [
                "id",
                "UserId",
                "title",
                "price",
                "director",
                "studio",
                "image",
              ],
              include: [User],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });

    const orders = [];

    let totalFinal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    shoppingCarts.forEach(async (shoppingCart) => {
      let total_qty = 0;
      let subTotal = 0;
      let total_due = 0;

      const items = [];

      let sellerName = shoppingCart.Line_items[0].Movie.User.name;

      shoppingCart.Line_items.forEach((line_item) => {
        const total = line_item.qty * line_item.Movie.price;
        subTotal += total;
        total_qty += line_item.qty;

        items.push(line_item);
      });

      total_due = subTotal;

      let discount = 0;
      if (total_qty > 2) {
        discount = (5 * total_due) / 100;
        total_due -= discount;
      }

      const tax = (10 * total_due) / 100;
      total_due += tax;

      totalFinal += total_due;
      totalTax += tax;
      totalDiscount += discount;

      orders.push({
        total_qty,
        ShoppingCartId: shoppingCart.id,
        sellerName: sellerName,
        subTotal: subTotal,
        discount: discount,
        tax: tax,
        total_due: total_due,
        total_qty: total_qty,
        Line_items: items,
      });
    });

    res.status(200).json({
      status: 200,
      message: "Order summary displayed successfully!",
      shoppingCarts: orders,
      totalTax,
      totalDiscount,
      totalFinal,
    });
  }

  static async checkout(req, res) {
    const userId = +req.userData.id;
    const userName = req.userData.name;

    try {
      const { city, address } = req.body;

      if (!city || !address) {
        throw {
          status: 500,
          message: "City or address cannot be null",
        };
      }

      const shoppingCarts = await Movies_cart.findAll({
        where: { UserId: userId, status: "open" },
        include: [
          {
            model: Line_items,
            where: { status: "cart" },
            include: [
              {
                model: Movie,
              },
            ],
            order: [["id", "ASC"]],
          },
        ],
        order: [["id", "ASC"]],
      });

      shoppingCarts.forEach(async (shoppingCart) => {
        const rand = Math.round(Math.random() * 899999 + 100000);
        const payTrx = randomstring.generate();
        const OrderName = `MOV-INV/${userName
          .substring(0, 3)
          .toUpperCase()}${rand}RAND`;

        let total_qty = 0;
        let subTotal = 0;
        let total_due = 0;

        shoppingCart.Line_items.forEach(async (line_item) => {
          const total = line_item.qty * line_item.Movie.price;
          subTotal += total;
          total_qty += line_item.qty;

          await Line_items.update(
            { status: "checkout", OrderName },
            { where: { id: line_item.id } }
          );
        });

        total_due = subTotal;

        let discount = 0;
        if (total_qty > 2) {
          discount = (5 * total_due) / 100;
          total_due -= discount;
        }

        const tax = (10 * total_due) / 100;
        total_due += tax;

        await Order.create({
          UserId: userId,
          name: OrderName,
          subtotal: subTotal,
          discount,
          tax,
          total_due,
          total_qty,
          payt_trx_number: payTrx,
          city,
          address,
        });
      });
      res.json({
        status: 200,
        message: "Checkout success!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async showOrder(req, res) {
    try {
      const UserId = +req.userData.id;
      const order = await Order.findAll({
        include: [
          {
            model: Line_items,
            include: [
              {
                model: Movie,
                paranoid: false,
              },
            ],
          },
        ],
        where: { UserId },
      });

      res.json({
        status: 200,
        message: " Data orders has been displayed successfully!",
        order,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addComment(req, res) {
    try {
      const UserId = +req.userData.id;
      const MovieId = +req.params.id;
      const { comments, rating } = req.body;
      const movComment = await Movies_comment.create({
        comments,
        rating,
        UserId,
        MovieId,
      });
      res.json({
        status: 200,
        message: "Berhasil comment!",
        movComment,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = ApiController;
