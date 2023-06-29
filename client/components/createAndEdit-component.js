import styles from "../styles/createAndEdit.module.scss";
import SellerService from "../service/seller.service";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CreateAndEditComponent({ sellerProduct }) {
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

  // 在/edit時取得原資料在input上
  useEffect(() => {
    const getSellerProduct = async () => {
      try {
        const productData = await SellerService.getSellerProduct(id);
        setProductId(productData.data[0]._id);
        setPhoto({ file: productData.data[0].photo });
        setName(productData.data[0].name);
        setDescription(productData.data[0].description);
        setPrice(productData.data[0].price);
      } catch (e) {
        console.log(e);
      }
    };
    if (isEdit) {
      getSellerProduct();
    }
  }, [id]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  function converToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await converToBase64(file);
    setPhoto({ file: base64 });
    // setPhoto(base64);
  };

  const handlePostProduct = async () => {
    try {
      await SellerService.post(photo.file, name, description, price);
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
      await SellerService.put(id, photo.file, name, description, price);
      window.alert("成功編輯商品");
      router.push("/seller");
    } catch (e) {
      if (e.response && e.response.data) {
        setMessage(e.response.data);
      } else {
        setMessage("發生未知錯誤，請重新上傳，或上傳檔案較小的圖片");
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
              {photo.file && <img src={photo.file} alt="圖片預覽" />}
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
