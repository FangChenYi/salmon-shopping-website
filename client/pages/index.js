import React, { useState, useEffect } from "react";
import styles from "../styles/searchScope/searchScope.module.scss";
import productStyles from "../styles/product.module.scss";
import Product from "../components/product-component";
import SearchBarComponent from "../components/navs/searchBar-component";

export default function Home({ products }) {
  const [windowWidth, setwindowWidth] = useState(false);
  const [sortedProducts, setSortedProducts] = useState(products);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sellerInput, setSellerInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSortLatest = () => {
    const sortedByDate = [...products].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setSortedProducts(sortedByDate);
  };

  const handleSortLowToHigh = () => {
    const sortedByPriceLowToHigh = [...products].sort((a, b) => {
      return a.price - b.price;
    });

    setSortedProducts(sortedByPriceLowToHigh);
  };

  const handleSortHighToLow = () => {
    const sortedByPriceHighToLow = [...products].sort((a, b) => {
      return b.price - a.price;
    });

    setSortedProducts(sortedByPriceHighToLow);
  };

  const handleApplyFilter = () => {
    const filteredByPrice = products.filter((product) => {
      const price = product.price;
      return price >= minPrice && price <= maxPrice;
    });

    setSortedProducts(filteredByPrice);
  };

  const handleSearchSeller = () => {
    const filteredBySeller = products.filter((product) =>
      product.sellerName.toLowerCase().includes(sellerInput.toLowerCase())
    );

    setSortedProducts(filteredBySeller);
  };

  const handleSearchProduct = () => {
    const filteredByProduct = products.filter((product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSortedProducts(filteredByProduct);
  };

  return (
    <div>
      <SearchBarComponent
        handleSearchProduct={() => handleSearchProduct()}
        setSearchInput={setSearchInput}
        searchInput={searchInput}
      />

      <button className={styles.btn} onClick={handleScrollToTop}>
        TOP
      </button>

      <div className={styles.container}>
        <div className={styles.sortAndScope}>
          <div className={styles.sortAndScopeItem}>
            <div className={styles.sortContainer}>
              <div className={styles.sortItem}>
                <div className={styles.latest}>
                  <button onClick={handleSortLatest}>最近新增</button>
                </div>
              </div>

              <div className={styles.sortItem}>
                <div className={styles.lowToHighSort}>
                  <button onClick={handleSortLowToHigh}>價格由低到高</button>
                </div>
              </div>

              <div className={styles.sortItem}>
                <div className={styles.HighToLowSort}>
                  <button onClick={handleSortHighToLow}>價格由高到低</button>
                </div>
              </div>
            </div>
          </div>
          {windowWidth && (
            <div className={styles.sortAndScopeItem}>
              <div className={styles.priceScope}>
                <div className={styles.priceScopeItem}>
                  <p>價格範圍</p>
                </div>
                <div className={styles.priceScopeItem}>
                  <div className={styles.priceScopeInput}>
                    <div className={styles.priceScopeInputItem}>
                      <input
                        type="text"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className={styles.priceScopeInputItem}>
                      <p>~</p>
                    </div>
                    <div className={styles.priceScopeInputItem}>
                      <input
                        type="text"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.priceScopeItem}>
                  <button onClick={handleApplyFilter}>套用</button>
                </div>
              </div>
            </div>
          )}
          {windowWidth && (
            <div className={styles.sortAndScopeItem}>
              <div className={styles.sellerScope}>
                <div className={styles.sellerScopeItem}>
                  <p>搜尋賣家</p>
                </div>
                <div className={styles.sellerScopeItem}>
                  <input
                    type="text"
                    value={sellerInput}
                    onChange={(e) => setSellerInput(e.target.value)}
                  />
                </div>

                <div className={styles.sellerScopeItem}>
                  <button onClick={handleSearchSeller}>搜尋</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={productStyles.products}>
          {sortedProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch("http://localhost:8080");
  const products = await response.json();
  return {
    props: {
      products,
    },
  };
}
