import React, { useRef } from "react";
import { faSearch, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styles from "../../styles/navStyles/searchBar.module.scss";

export default function SearchBarComponent({
  setSearchInput,
  handleSearchProduct,
  searchInput,
}) {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      buttonRef.current.click();
    }
  };

  return (
    <div>
      <div className={styles.searchContainer}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <a href="/" onClick={() => window.location.reload()}>
              鮭鮭購物
            </a>
          </div>
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <input
                type="text"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                ref={inputRef}
                onKeyDown={handleEnterPress}
                placeholder="註冊獲得全站購物金"
              />
            </div>
            <div className={styles.searchBtn}>
              <button onClick={handleSearchProduct} ref={buttonRef}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
          <div className={styles.searchCart}>
            <Link href="/user/cart">
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
