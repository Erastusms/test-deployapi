const multer = require("multer");
const { tokenVerifier } = require("../helpers/jwt");

const MulterSingle = (dest) => {
  var storage = multer.diskStorage({
    destination: `${dest}`,
    filename: (req, file, cb) => {
      const { access_token } = req.headers;
      let name;

      if (access_token) {
        const decoded = tokenVerifier(access_token);
        name = decoded.name.split(" ");
        name = name[0];
      } else {
        name = "user";
      }

      cb(null, name.toLowerCase() + "-" + Date.now() + "-" + file.originalname);
    },
  });
  var upload = multer({
    storage: storage,
  });

  return upload.single("file");
};

module.exports = { MulterSingle };
