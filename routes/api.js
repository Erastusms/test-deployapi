const ApiRouter = require("express").Router();
const ApiController = require("../controllers/ApiController");
const { MulterSingle } = require("../middlewares/multer");
const { auth } = require("../middlewares/auth");

ApiRouter.post(
  "/register",
  MulterSingle("./public/images/avatars/"),
  ApiController.register
);
ApiRouter.post("/login", ApiController.login);
ApiRouter.get("/profile", auth, ApiController.profilePage);
ApiRouter.put(
  "/profile",
  auth,
  MulterSingle("./public/images/avatars/"),
  ApiController.updateProfile
);

ApiRouter.get("/home-page", ApiController.homePage);
ApiRouter.get("/movies-detail/:id", ApiController.detailMoviePage);
ApiRouter.post("/movies-detail/:id/add-to-cart", auth, ApiController.addToCart);
ApiRouter.post("/movies-detail/:id/add-comment", auth, ApiController.addComment);

ApiRouter.get("/my-cart", auth, ApiController.myCartPage);
ApiRouter.put("/my-cart/:id", auth, ApiController.updateCartItem);
ApiRouter.delete("/my-cart/:id", auth, ApiController.deleteCartItem);
ApiRouter.delete("/my-cart/delete-cart/item", auth, ApiController.deleteCart);

ApiRouter.get("/order-summary", auth, ApiController.orderSummary);
ApiRouter.post("/checkout", auth, ApiController.checkout);
ApiRouter.get("/my-order", auth, ApiController.showOrder);

module.exports = ApiRouter;
