import {
  faCartShopping,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/product.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AuthService from "../service/auth.service";
import CartService from "../service/cart.service";

export default function ProductComponent({ product }) {
  const router = useRouter();
  const isUser = router.pathname === "/";
  const isSeller = router.pathname === "/seller";
  const [currentuser, setCurrentUser] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (user && user.user) {
      setUserID(user.user._id);
    }
  }, []);

  const bufferToBase64 = (buffer) => {
    const buf = Buffer.from(buffer, "utf8");
    return buf.toString("base64");
  };

  const handleCart = async () => {
    try {
      if (!currentuser) {
        localStorage.setItem("redirectPath", "/user/cart");
        router.push("/user/login");
      } else {
        router.push("/user/cart");
      }

      if (currentuser) {
        if (userID === product.sellerID) {
          window.alert("無法新增自己的商品至購物車");
        }
        await CartService.post(product._id);
        window.alert("已新增至購物車");
        // router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className={styles.productContainer}>
        <div className={styles.product}>
          <div className={styles.productPhoto}>
            <img
              src={`data:image/png;base64,${bufferToBase64(
                product.photo.data
              )}`}
              alt="Product Photo"
            />
          </div>

          <div className={styles.productItem}>
            <div className={styles.productName}>
              <h1>{product.name}</h1>
            </div>
          </div>

          <div className={styles.productItem}>
            <div className={styles.productDescription}>
              <p>{product.description}</p>
            </div>
          </div>

          <div className={styles.productItem}>
            <div className={styles.productPrice}>
              <p>$ {product.price}</p>
            </div>
          </div>

          <div className={styles.productSellerCartContainer}>
            <div className={styles.productSeller}>
              <p>賣家：{product.sellerName}</p>
            </div>
            {isUser && (
              <div className={styles.productCart}>
                <Link onClick={handleCart} className={styles.icon} href="/">
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </div>
            )}
            {isSeller && (
              <div className={styles.productCart}>
                <Link
                  className={styles.icon}
                  href={`/seller/edit/${product._id}`}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
