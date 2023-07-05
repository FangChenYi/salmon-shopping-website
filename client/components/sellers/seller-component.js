import searchScopeStyles from "../../styles/searchScope/searchScope.module.scss";
import cartStyles from "../../styles/cartStyles/cart.module.scss";
import productStyles from "../../styles/productStyles/product.module.scss";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AuthService from "../../service/auth.service";
import SellerService from "../../service/seller.service";
import Product from "../product/product-component";
import { useRouter } from "next/router";
import CreateAndEditComponent from "../../components/sellers/createAndEdit-component";
import CartProductComponent from "../../components/carts/cartProduct-component";

export default function SellerComponent({ windowWidth }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const isSeller = router.pathname === "/seller";
  const isSellerOrder = router.pathname === "/seller/order";
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerProduct, setSellerProduct] = useState(null);
  const [sellerOrder, setSellerOrder] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);

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

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      buttonRef.current.click();
    }
  };

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
      <button className={searchScopeStyles.btn} onClick={handleScrollToTop}>
        TOP
      </button>
      <div className={searchScopeStyles.container}>
        <div className={searchScopeStyles.sortAndScope}>
          <div className={searchScopeStyles.sortAndScopeItem}>
            <div className={searchScopeStyles.sortContainer}>
              <div className={searchScopeStyles.sortItem}>
                <button>
                  <Link href="/seller/order">查看訂單</Link>
                </button>
              </div>

              {isSeller && (
                <div className={searchScopeStyles.sortItem}>
                  <button>
                    <Link href="/seller/create">新增商品</Link>
                  </button>
                </div>
              )}

              {isSeller && sellerProduct && (
                <div className={searchScopeStyles.sortItem}>
                  <button onClick={handleSortLatest}>由新到舊排序</button>
                </div>
              )}

              <div className={searchScopeStyles.sortItem}>
                <button>
                  <Link onClick={handleAllProduct} href="/seller">
                    查看所有商品
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {isSeller && windowWidth && (
            <div className={searchScopeStyles.sortAndScopeItem}>
              <div className={searchScopeStyles.sellerScope}>
                <div className={searchScopeStyles.sellerScopeItem}>
                  <p>搜尋商品</p>
                </div>
                <div className={searchScopeStyles.sellerScopeItem}>
                  <input
                    type="text"
                    value={searchInput}
                    placeholder="商品名稱"
                    ref={inputRef}
                    onKeyDown={handleEnterPress}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className={searchScopeStyles.sellerScopeItem}>
                  <button onClick={handleSearchProduct} ref={buttonRef}>
                    搜尋
                  </button>
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
              <div className={searchScopeStyles.noItem}>沒有商品</div>
            )}
          </div>
        ) : (
          <CreateAndEditComponent sellerProduct={sellerProduct} />
        )}

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
          isSellerOrder && (
            <div className={searchScopeStyles.noItem}>目前沒有訂單</div>
          )
        )}
      </div>
    </div>
  );
}
