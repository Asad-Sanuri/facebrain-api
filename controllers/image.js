const cloudinary = require("cloudinary").v2;

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0].entries);
      } else {
        res.status(400).json("unable to get entries of user with id = " + id);
      }
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const handleImageUpload = () => (req, res) => {
  console.log(req.files);
  const values = Object.values(req.files);
  const promises = values.map((image) =>
    cloudinary.uploader.upload(image.path)
  );
  Promise.all(promises).then((results) => res.json(results));
};

module.exports = {
  handleImage,
  handleImageUpload,
};
