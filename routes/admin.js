const AdminRouter = require("express").Router();
const AdminController = require("../controllers/AdminController");
const { MulterSingle } = require("../middlewares/multer");
const { movieAuth } = require("../middlewares/auth");

AdminRouter.get("/", AdminController.showDashboard);
AdminRouter.get("/profiles", AdminController.profilePage);
AdminRouter.get("/dashboard", AdminController.showDashboard);
AdminRouter.get("/list-users", AdminController.showAllUsers);
AdminRouter.delete("/list-users/:id", AdminController.deleteUser);

AdminRouter.get("/list-movies", AdminController.showAllMovies);
// AdminRouter.get(
//   "/list-movies/:title?/:sort?/:page?",
//   AdminController.showAllMovies
// );
AdminRouter.get("/detail-movies/:id", AdminController.detailMovies);
AdminRouter.get("/my-movies", AdminController.showMyMovies);
AdminRouter.get("/list-movies/actors/:MovieId", AdminController.showActors);

AdminRouter.post(
  "/add-movies",
  MulterSingle("./public/images/movies/"),
  AdminController.addMovies
);
AdminRouter.post(
  "/list-movies/actors/:MovieId",
  MulterSingle("./public/images/actors/"),
  AdminController.addActors
);

AdminRouter.delete(
  "/list-movies/actors/:id",
  movieAuth,
  AdminController.deleteActors
);
AdminRouter.delete("/list-movies/:id", movieAuth, AdminController.deleteMovies);
AdminRouter.put(
  "/edit-movies/:id",
  movieAuth,
  MulterSingle("./public/images/movies/"),
  AdminController.editMovies
);

// Order
AdminRouter.get("/list-orders", AdminController.showAllOrders);
AdminRouter.put("/list-orders/confirmation/:id", AdminController.actionConfirm);
AdminRouter.put("/list-orders/reject/:id", AdminController.actionReject);

module.exports = AdminRouter;
