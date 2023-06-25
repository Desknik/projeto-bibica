const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

export function uploadImage(imageUploaded, publicId = null, decoracao = false) {

  const UploadOptions = { width: 1280, height: 1280, crop: "fill" }

  const isDecoration = () => {
    if(!decoracao){
        return UploadOptions
    }else{
      return {}
    }
  }

  return new Promise((resolve, reject) => {

    if(publicId){

      cloudinary.uploader.destroy(publicId)

      cloudinary.uploader.upload(
        imageUploaded,
        isDecoration,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
      );
      }
      else{
        cloudinary.uploader.upload(
          imageUploaded,
          isDecoration,
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        }
        );
      }
  });
}

export function deleteImage(publicId) {

  return new Promise((resolve, reject) => {

    if(publicId){
      cloudinary.uploader.destroy(publicId)

    }
  });
}
