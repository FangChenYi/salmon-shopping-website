import React, { useState, useEffect } from "react";
import searchScopeStyles from "../../styles/searchScope/searchScope.module.scss";
import cartStyles from "../../styles/cartStyles/cart.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthService from "../../service/auth.service";
import CartService from "../../service/cart.service";
import OrderService from "../../service/order.service";
import CartProductComponent from "./cartProduct-component";

export default function CartComponent({}) {
  const router = useRouter();
  const isCart = router.pathname === "/user/cart";
  const isOrder = router.pathname === "/user/order";
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState(null);
  const [userID, setUserID] = useState(null);
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (user && user.user) {
      setUserID(user.user._id);
    }
    if (user && isCart) {
      let _id = user.user._id;
      CartService.get(_id) // 取得使用者購物車的資料
        .then((d) => {
          setData(d.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (user && isOrder) {
      OrderService.get() // 取得使用者訂單的資料
        .then((d) => {
          setData(d.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (!user) {
      localStorage.setItem("redirectPath", "/user/cart");
      router.push("/user/login");
    }
  }, []);

  // 將目前購物車的資料去分類
  const cartGroupedData = data?.reduce((acc, item) => {
    const userID = item.user; // 取得使用者ID
    const sellerID = item.seller.sellerID; // 取得當前資料的sellerID

    if (!acc[userID]) {
      acc[userID] = {};
    }

    if (!acc[userID][sellerID]) {
      // 如果這個使用者的購物車並沒有此sellerID的商品
      acc[userID][sellerID] = {
        // 就建立一個物件，存放seller與products
        seller: item.seller, // 目的是要將不同的sellerID分開，達到購物車是以每一個賣場為一組的分類
        products: [],
      };
    }

    acc[userID][sellerID].products.push(item.product);
    return acc;
  }, {});

  const handleOrder = async (sellerID) => {
    try {
      if (sellerID) {
        const response = await OrderService.post(sellerID);
        if (response) {
          setOrderID(response.data.newOrder._id);
          window.alert("成功送出訂單");
          window.location.reload();
        } else {
          window.alert("發生未知錯誤");
        }
      } else {
        window.alert("發生未知錯誤");
      }
    } catch (e) {
      console.log(e);
      window.alert("發生未知錯誤");
    }
  };

  return (
    <div className={searchScopeStyles.container}>
      <div className={searchScopeStyles.sortAndScope}>
        <div className={searchScopeStyles.sortAndScopeItem}>
          <div className={searchScopeStyles.sortContainer}>
            <div className={searchScopeStyles.sortItem}>
              <button>
                <Link href="/user/order">訂單查詢</Link>
              </button>
            </div>

            <div className={searchScopeStyles.sortItem}>
              <button>
                <Link href="/user/cart">購物車</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      {cartGroupedData &&
      currentUser &&
      isCart &&
      Object.values(cartGroupedData).length > 0 ? (
        <div className={cartStyles.cart}>
          {Object.values(cartGroupedData[userID] || {}).map((group) => (
            <div className={cartStyles.cartContainer} key={group.seller._id}>
              <div className={cartStyles.shopContainer}>
                <div className={cartStyles.shopName}>
                  <span>賣場：{group.seller.sellerName}</span>
                </div>
                {group.products.map((product) => (
                  <CartProductComponent
                    product={product}
                    userID={userID}
                    setData={setData}
                    key={product._id}
                  />
                ))}
                {/* <div className={cartStyles.shopPriceTotal}>
                  <span>
                    訂單金額：＄
                    {group.products.reduce((acc, product) => {
                      const total = product.productTotalAmount;
                      return acc + total;
                    }, 0)}
                  </span>
                </div> */}
                <div className={cartStyles.shopBtnContainer}>
                  <Link
                    onClick={() => handleOrder(group.seller.sellerID)}
                    href="/user/order"
                  >
                    送出訂單
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        isCart && (
          <div className={searchScopeStyles.noItem}>目前購物車沒有商品</div>
        )
      )}

      {data && currentUser && isOrder && Object.values(data).length > 0 ? (
        <div className={cartStyles.cart}>
          {Object.values(data || {}).map((group) => (
            <div className={cartStyles.cartContainer} key={group.seller._id}>
              <div className={cartStyles.shopContainer}>
                <div className={cartStyles.shopName}>
                  <span>賣場：{group.seller.sellerName}</span>
                </div>
                {group.orders.map(
                  (product) =>
                    product &&
                    product._id && (
                      <CartProductComponent
                        product={product}
                        userID={userID}
                        setData={data}
                        key={product._id}
                      />
                    )
                )}
                <div className={cartStyles.shopPriceTotal}>
                  <span>
                    訂單金額：＄
                    {group.orders.reduce((acc, product) => {
                      const total = product.product.productTotalAmount;
                      return acc + total;
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        isOrder && <div className={searchScopeStyles.noItem}>沒有訂單</div>
      )}
    </div>
  );
}
