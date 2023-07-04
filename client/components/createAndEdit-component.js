import styles from "../styles/createAndEdit.module.scss";
import SellerService from "../service/seller.service";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CreateAndEditComponent({}) {
  const router = useRouter();
  const { id } = router.query;
  const isCreate = router.pathname === "/seller/create";
  const isOrder = router.pathname === "/seller/order";
  const isEdit = /^\/seller\/edit\/.*/.test(router.pathname);
  const [photo, setPhoto] = useState({ file: "" });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [productId, setProductId] = useState(null);
  const [base64, setBase64] = useState("");
  const [file, setFile] = useState(null);

  // 在/edit時取得原資料在input上
  useEffect(() => {
    const getSellerProduct = async () => {
      try {
        const productData = await SellerService.getSellerProduct(id);
        setProductId(productData.data[0]._id);
        setName(productData.data[0].name);
        setDescription(productData.data[0].description);
        setPrice(productData.data[0].price);
        const result = await bufferToBase64(productData.data[0].photo.data);
        setBase64(`data:image/png;base64,${result}`);
      } catch (e) {
        console.log(e);
      }
    };

    if (isEdit) {
      getSellerProduct();
    }
  }, [id]);

  const bufferToBase64 = (buffer) => {
    const buf = Buffer.from(buffer, "utf8");
    return buf.toString("base64");
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const compressedFile = await compressImage(file);
    converToBase64(compressedFile); // 轉base64，預覽圖片
    setPhoto(compressedFile);
    setFile(compressedFile); // 更新商品確認是否有更改（上傳）圖片
  };

  // 壓縮圖片
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;

          // 根據最大寬高縮放
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            0.1
          );
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // 預覽圖片
  const converToBase64 = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //執行後會有一個result屬性，result的值會放file轉換完成的base64，再來才會執行onloadend
    reader.onloadend = () => {
      setBase64(reader.result);
    };
  };

  const handlePostProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      await SellerService.post(formData);
      window.alert("成功新增商品");
      router.push("/seller");
    } catch (e) {
      if (e.response && e.response.data) {
        setMessage(e.response.data);
      } else {
        setMessage("發生未知錯誤，請重新上傳，或上傳檔案較小的圖片");
      }

      console.log(e);
    }
  };

  const handleEditProduct = async () => {
    try {
      if (file) {
        // 如果有更新（上傳）圖片就
        const formData = new FormData();
        formData.append("photo", photo); // 新增這行
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        await SellerService.put(id, formData);
        window.alert("成功編輯商品");
        router.push("/seller");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        await SellerService.put(id, formData);
        window.alert("成功編輯商品");
        router.push("/seller");
      }
    } catch (e) {
      if (e.response && e.response.data) {
        setMessage(e.response.data);
      } else {
        setMessage("發生未知錯誤");
      }

      console.log("message以外的ERROR：" + e);
    }
  };

  const handleDeleteProduct = async () => {
    console.log(id);
    try {
      const productFound = await SellerService.getSellerProduct(id);

      if (productFound) {
        const response = await SellerService.deleteProdutct(id);
        if (response) {
          window.alert("成功刪除商品");
          router.push("/seller");
        } else {
          window.alert("無法刪除商品");
        }
      } else {
        window.alert("無法刪除商品");
      }
    } catch (e) {
      if (e.response && e.response.data) {
        setMessage(e.response.data);
      } else {
        setMessage("發生未知錯誤");
      }

      console.log("message以外的ERROR：" + e);
    }
  };

  return (
    <div>
      {!isCreate && !productId && !isOrder && (
        <div className={styles.createAndEdit}>
          <div className={styles.createAndEditContainer}>
            <div className={styles.createAndEditNotFound}>
              <span>找不到此商品</span>
            </div>
          </div>
        </div>
      )}
      {(isCreate || productId) && (
        <div className={styles.createAndEdit}>
          <div className={styles.createAndEditContainer}>
            {isCreate ? (
              <div className={styles.createAndEditTitle}>
                <span>新增商品</span>
              </div>
            ) : (
              <div className={styles.createAndEditTitle}>
                <span>編輯商品</span>
              </div>
            )}

            <div className={styles.formInputFile}>
              <span>圖片：</span>
              <input
                onChange={(e) => handleFileUpload(e)}
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
              />
              <img src={base64} />
            </div>

            <div className={styles.formContainer}>
              <div className={styles.formItem}>
                <span>名稱：</span>
                <br />
                <input
                  onChange={handleChangeName}
                  value={name}
                  type="text"
                  id="name"
                  name="name"
                  required
                  minlength="1"
                  maxlength="50"
                />
              </div>

              <div className={styles.formItem}>
                <span>描述：</span>
                <br />
                <input
                  onChange={handleChangeDesciption}
                  value={description}
                  type="text"
                  id="description"
                  name="description"
                  required
                  minlength="1"
                  maxlength="80"
                />
              </div>

              <div className={styles.formItem}>
                <span>價格：</span>
                <br />
                <input
                  onChange={handleChangePrice}
                  value={price}
                  type="number"
                  id="price"
                  name="price"
                  required
                  minlength="1"
                />
              </div>

              {message && (
                <div className={styles.errorMessage}>
                  <span>{message}</span>
                </div>
              )}
              {isCreate && (
                <div className={styles.formBtnContainer}>
                  <div className={styles.formBtn}>
                    <button onClick={handlePostProduct}>新增商品</button>
                  </div>
                </div>
              )}
              {!isCreate && (
                <div className={styles.formBtnContainer}>
                  <div className={styles.formBtn}>
                    <button onClick={handleEditProduct}>編輯商品</button>
                  </div>
                  <div className={styles.formBtn}>
                    <button onClick={handleDeleteProduct}>刪除商品</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
