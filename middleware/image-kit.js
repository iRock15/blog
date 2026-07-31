const ImageKit = require("imagekit");

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uplaodImageKit = (isMultiple = false, folder = "uploads") => {
  return async (req, res, next) => {
    if ((!isMultiple && !req.file) || (isMultiple && req.files.length === 0)) {
      return next();
    }
    const files = isMultiple ? req.files : [req.file];

    const uploadPromises = files.map((file) => {
      return imageKit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.fieldname}`,
        folder: folder,
      });
    });
    const images = await Promise.all(uploadPromises);
    req.images = images.map((image) => image.url);
    next();
  };
};

module.exports = uplaodImageKit;
