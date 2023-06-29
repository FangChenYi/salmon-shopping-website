import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  faBars,
  faPhone,
  faEnvelope,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/navStyles/navBar.module.scss";
import AuthService from "../../service/auth.service";

export default function NavBarComponent({ currentUser, setCurrentUser }) {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const isCart = router.pathname === "/user/cart";
  const isLogin = router.pathname === "/user/login";
  const isRegister = router.pathname === "/user/register";
  const [isVisible, setIsVisible] = useState(false);
  const [visibleHome, setVisibleHome] = useState(false);

  const handleCheckboxChange = () => {
    setIsVisible(!isVisible);
    // >768時沒有btn可以按，也已經回傳true了
    // <768時會是false，反轉就是true
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    const a = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
    };

    router.events.on("routeChangeStart", a);

    return () => {
      router.events.off("routeChangeStart", a);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      // 在<768時，點擊其他route，導覽列會消失
      if (window.innerWidth < 768) {
        setIsVisible(false);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsVisible(true);
        setVisibleHome(true);
      } else {
        setIsVisible(false);
        setVisibleHome(false);
      }
    };

    // 一進到畫面會先執行useEffect，這個function會被執行，
    // 監聽視窗大小回傳true or false
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      // 每次監聽完後需釋放資源
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    if (currentUser) {
      AuthService.logout();
      setCurrentUser(null);
    } else {
      await signOut("google");
    }

    window.alert("已登出，導向至首頁");
    router.push("/");
  };

  return (
    <div>
      <div className={styles.hidden}>
        <input
          type="checkbox"
          id="menuControl"
          onChange={handleCheckboxChange}
        />
      </div>
      <div className={styles.header}>
        <div className={styles.navContainer}>
          <div className={styles.container}>
            <label htmlFor="menuControl" className={styles.menuBtn}>
              <FontAwesomeIcon icon={faBars} />
            </label>
            <div className={styles.navIcon}>
              {isHome && !isVisible && (
                <li>
                  <Link href="/" onClick={() => window.location.reload()}>
                    <FontAwesomeIcon icon={faHouse} />
                  </Link>
                </li>
              )}

              {!isHome && (
                <li>
                  <Link href="/" onClick={() => window.location.reload()}>
                    <FontAwesomeIcon icon={faHouse} />
                  </Link>
                </li>
              )}

              <li>
                <Link href="/">
                  <FontAwesomeIcon icon={faPhone} />
                </Link>
              </li>
              <li>
                <Link href="/">
                  <FontAwesomeIcon icon={faEnvelope} />
                </Link>
              </li>
              <li>
                <Link href="/">
                  <FontAwesomeIcon icon={faLinkedin} />
                </Link>
              </li>
            </div>
            {isVisible && (
              <div className={styles.navMember}>
                <nav>
                  <ul>
                    <li>
                      <Link href="/seller">賣家中心</Link>
                    </li>

                    <li>
                      <Link href="/user/profile">會員中心</Link>
                    </li>
                    {!isHome && !isCart && !isRegister && !isLogin && (
                      <li>
                        <Link href="/user/cart">購物車</Link>
                      </li>
                    )}

                    {!currentUser && (
                      <li>
                        <Link href="/user/register">註冊</Link>
                      </li>
                    )}
                    {!currentUser && (
                      <li>
                        <Link href="/user/login">登入</Link>
                      </li>
                    )}

                    {currentUser && (
                      <li>
                        <Link onClick={handleLogout} href="/">
                          登出
                        </Link>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
