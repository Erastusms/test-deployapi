const router = require("express").Router();

const { adminAuth } = require("../middlewares/auth");

const adminRouter = require("./admin");
const apiRouter = require("./api");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello world"
  })
});

router.use("/admin", adminAuth, adminRouter);
router.use("/api/v1", apiRouter);

module.exports = router;
