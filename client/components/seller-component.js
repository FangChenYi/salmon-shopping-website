import styles from "../styles/searchScope/searchScope.module.scss";
import cartStyles from "../styles/cart.module.scss";
import productStyles from "../styles/product.module.scss";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthService from "../service/auth.service";
import SellerService from "../service/seller.service";
import Product from "./product-component";
import { useRouter } from "next/router";
import CreateAndEditComponent from "./createAndEdit-component";
import CartProductComponent from "./cartProduct-component";

export default function SellerComponent({}) {
  const router = useRouter();
  const isSeller = router.pathname === "/seller";
  const isSellerOrder = router.pathname === "/seller/order";
  const [currentUser, setCurrentUser] = useState(null);
  const [windowWidth, setwindowWidth] = useState(false);
  const [sellerProduct, setSellerProduct] = useState(null);
  const [sellerOrder, setSellerOrder] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sortedProducts, setSortedProducts] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setwindowWidth(true);
      } else {
        setwindowWidth(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (user && isSeller) {
      let _id;
      _id = user.user._id;
      SellerService.getSellerAllProducts(_id)
        .then((data) => {
          setSellerProduct(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (user && isSellerOrder) {
      SellerService.getSellerAllOrder()
        .then((data) => {
          setSellerOrder(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (!user) {
      localStorage.setItem("redirectPath", "/seller");
      router.push("/user/login");
    }
  }, []);

  const handleSortLatest = () => {
    const sortedByDate = [...sellerProduct].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setFilteredProducts(sortedByDate);
  };

  const handleAllProduct = () => {
    setFilteredProducts(sellerProduct);
  };

  const handleSearchProduct = () => {
    const filteredByProduct = sellerProduct.filter((product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredProducts(filteredByProduct);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteOrder = async (orderID) => {
    try {
      let confirmed = window.confirm(
        "完成訂單後，訂單將會刪除，確定要完成訂單嗎？"
      );
      if (orderID && confirmed) {
        const response = await SellerService.delete(orderID);
        if (response) {
          window.alert("已完成訂單");
          window.location.reload();
        } else {
          window.alert("無法完成訂單");
        }
      }
    } catch (e) {
      console.log(e);
      window.alert("無法完成訂單");
    }
  };

  return (
    <div>
      <button className={styles.btn} onClick={handleScrollToTop}>
        TOP
      </button>
      <div className={styles.container}>
        <div className={styles.sortAndScope}>
          <div className={styles.sortAndScopeItem}>
            <div className={styles.sortContainer}>
              <div className={styles.sortItem}>
                <button>
                  <Link href="/seller/order">查看訂單</Link>
                </button>
              </div>

              {isSeller && (
                <div className={styles.sortItem}>
                  <button>
                    <Link href="/seller/create">新增商品</Link>
                  </button>
                </div>
              )}

              {isSeller && sellerProduct && (
                <div className={styles.sortItem}>
                  <button onClick={handleSortLatest}>由新到舊排序</button>
                </div>
              )}

              <div className={styles.sortItem}>
                <button>
                  <Link onClick={handleAllProduct} href="/seller">
                    查看所有商品
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {isSeller && windowWidth && (
            <div className={styles.sortAndScopeItem}>
              <div className={styles.sellerScope}>
                <div className={styles.sellerScopeItem}>
                  <p>搜尋商品</p>
                </div>
                <div className={styles.sellerScopeItem}>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className={styles.sellerScopeItem}>
                  <button onClick={handleSearchProduct}>搜尋</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {isSeller ? (
          <div>
            {currentUser &&
            (filteredProducts || sellerProduct) &&
            (filteredProducts || sellerProduct).length !== 0 ? (
              <div className={productStyles.products}>
                {(filteredProducts || sellerProduct)
                  .reverse()
                  .map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
              </div>
            ) : (
              <div className={styles.noItem}>沒有商品</div>
            )}
          </div>
        ) : (
          <CreateAndEditComponent sellerProduct={sellerProduct} />
        )}

        {/* {console.log(sellerOrder)} */}

        {sellerOrder && currentUser && Object.values(sellerOrder).length > 0 ? (
          <div className={cartStyles.cart}>
            {Object.values(sellerOrder || {}).map((group) => (
              <div className={cartStyles.cartContainer} key={group.seller._id}>
                <div className={cartStyles.shopContainer}>
                  <div className={cartStyles.shopName}>
                    <span>買家：{group.buyer.buyerName}</span>
                  </div>
                  {group.orders.map(
                    (product) =>
                      product &&
                      product._id && (
                        <CartProductComponent
                          product={product}
                          key={product._id}
                        />
                      )
                  )}
                  <div className={cartStyles.shopBtnContainer}>
                    <Link
                      onClick={() => handleDeleteOrder(group.orderID)}
                      href="/seller/order"
                    >
                      完成訂單
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          isSellerOrder && <div className={styles.noItem}>目前沒有訂單</div>
        )}
      </div>
    </div>
  );
}
