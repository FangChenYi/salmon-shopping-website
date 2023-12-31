import styles from "../../styles/cartStyles/cart.module.scss";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import CartService from "../../service/cart.service";
import { useRouter } from "next/router";

export default function CartProductComponent({ product, userID, setData }) {
  const router = useRouter();
  const isCart = router.pathname === "/user/cart";
  const isOrder = router.pathname === "/user/order";
  const isSellerOrder = router.pathname === "/seller/order";
  const [productQuantity, setProductQuantity] = useState(
    product.productQuantity
  );
  const [totalAmount, setTotalAmount] = useState(
    product.productPrice * product.productQuantity
  );
  const [cartPhotoBase64, setCartPhotoBase64] = useState("");
  const [orderPhotoBase64, setOrderPhotoBase64] = useState("");

  useEffect(() => {
    const photoTobase64 = async () => {
      try {
        if (isCart) {
          const cartPhotoBase64 = await bufferToBase64(
            product.productPhoto.data
          );
          setCartPhotoBase64(`data:image/png;base64,${cartPhotoBase64}`);
        }
        if (isOrder || isSellerOrder) {
          const orderPhotoBase64 = await bufferToBase64(
            product.product.productPhoto.data
          );
          setOrderPhotoBase64(`data:image/png;base64,${orderPhotoBase64}`);
        }
      } catch (e) {
        console.log(e);
      }
    };
    photoTobase64();
  }, []);

  const bufferToBase64 = (buffer) => {
    const buf = Buffer.from(buffer, "utf8");
    return buf.toString("base64");
  };

  const handleQuantityMinus = async () => {
    if (productQuantity > 1) {
      const newQuantity = productQuantity - 1;
      const newTotalAmount = product.productPrice * newQuantity;
      setProductQuantity(newQuantity);
      setTotalAmount(newTotalAmount);
      await CartService.patch(product.productID, newQuantity, newTotalAmount);
    }
  };

  const handleQuantityPlus = async () => {
    const newQuantity = productQuantity + 1;
    const newTotalAmount = product.productPrice * newQuantity;
    setProductQuantity(newQuantity);
    setTotalAmount(newTotalAmount);
    await CartService.patch(product.productID, newQuantity, newTotalAmount);
  };

  const handleDeleteProduct = async () => {
    try {
      let confirmed = window.confirm("確定刪除？");
      if (confirmed) {
        await CartService.delete(product.productID);
        window.alert("成功刪除商品");
        router.push("/user/cart");
        const updatedCart = await CartService.get(userID);
        setData(updatedCart.data);
      }
    } catch (e) {
      window.alert("發生未知錯誤，無法刪除商品");
      console.log(e);
    }
  };

  return (
    <div>
      {isCart && (
        <div className={styles.shopProductItem}>
          <div className={styles.shopProductPhoto}>
            <img src={cartPhotoBase64} alt="商品圖片" />
          </div>
          <div className={styles.shopProductContent}>
            <div className={styles.shopProductContentItem}>
              <span>{product.productName}</span>
            </div>
            <div className={styles.shopProductContentItem}>
              <span>$ {product.productPrice}</span>
            </div>
            <div className={styles.shopProductContentItem}>
              <div className={styles.quantityContainer}>
                <div className={styles.quantityMinus}>
                  <FontAwesomeIcon
                    onClick={handleQuantityMinus}
                    className={styles.icon}
                    icon={faMinus}
                  />
                </div>
                <div className={styles.quantityInput}>
                  <input
                    type="text"
                    value={productQuantity}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = parseInt(inputValue);
                      if (!isNaN(numericValue) && numericValue >= 1) {
                        setProductQuantity(numericValue);
                        const newTotalAmount =
                          product.productPrice * numericValue;
                        setTotalAmount(newTotalAmount);
                        CartService.patch(
                          product.productID,
                          numericValue,
                          newTotalAmount
                        );
                      }
                    }}
                  />
                </div>
                <div className={styles.quantityPlus}>
                  <FontAwesomeIcon
                    onClick={handleQuantityPlus}
                    className={styles.icon}
                    icon={faPlus}
                  />
                </div>
              </div>
              <div className={styles.shopDeleteProduct}>
                <button onClick={handleDeleteProduct}>刪除</button>
              </div>
              <div className={styles.shopProductPrice}>
                <span>＄ {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(isOrder || isSellerOrder) && (
        <div className={styles.shopProductItem}>
          <div className={styles.shopProductPhoto}>
            <img src={orderPhotoBase64} alt="商品圖片" />
          </div>
          <div className={styles.shopProductContent}>
            <div className={styles.shopProductContentItem}>
              <span>{product.product.productName}</span>
            </div>
            <div className={styles.shopProductContentItem}>
              <span>$ {product.product.productPrice}</span>
            </div>
            <div className={styles.shopProductContainer}>
              <div className={styles.shopProductContentItem}>
                <sapn>數量：{product.product.productQuantity}</sapn>
              </div>
              <div className={styles.shopProductContentItem}>
                <sapn>＄ {product.product.productTotalAmount}</sapn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
