import { useState, useEffect } from "react";
import SellerService from "../../service/seller.service";
// import sharp from "sharp";

export default function ImageGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await SellerService.getImages();
        setImages(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchImages();
  }, []);

  const bufferToBase64 = async (buffer) => {
    // try {
    //   const base64 = await sharp(buffer)
    //     .toBuffer()
    //     .then((data) => data.toString("base64"));
    //   return base64;
    // } catch (error) {
    //   console.log(error);
    //   return null;
    // }
  };

  return (
    <div>
      <h1>Image Gallery</h1>
      {images.map((image) => (
        <div key={image._id}>
          {console.log(image.imagePhoto.data)}
          <img src={bufferToBase64(image.imagePhoto.data)} alt={image.name} />
          <p>Name: {image.name}</p>
        </div>
      ))}
    </div>
  );
}
