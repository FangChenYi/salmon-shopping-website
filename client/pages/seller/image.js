import { useState } from "react";
import SellerService from "../../service/seller.service";

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("imagePhoto", selectedImage);
      formData.append("name", name);

      const result = await SellerService.postImage(formData);
      console.log(formData);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <input
        type="text"
        id="name"
        name="name"
        onChange={handleChangeName}
        value={name}
      />
      <br />
      <input
        type="file"
        id="imagePhoto"
        name="imagePhoto"
        onChange={handleImageChange}
      />
      <button onClick={handleSubmit}>上傳圖片</button>
    </div>
  );
}
