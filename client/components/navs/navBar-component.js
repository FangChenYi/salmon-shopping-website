import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { faBars, faEnvelope, faHouse } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/headerStyles/navBar.module.scss";
import AuthService from "../../service/auth.service";

export default function NavBarComponent() {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const isLogin = router.pathname === "/user/login";
  const isRegister = router.pathname === "/user/register";
  const [isVisible, setIsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleCheckboxChange = () => {
    setIsVisible(!isVisible);
    // >768時沒有btn可以按，也已經回傳true了
    // <768時會是false，反轉就是true
  };

  // 處理登入登出後馬上更新導覽列
  useEffect(() => {
    const getUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    getUser();
    router.events.on("routeChangeStart", getUser);
    return () => {
      router.events.off("routeChangeStart", getUser);
    };
  }, []);

  // 處理rwd選單，導覽列是否顯示
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
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

  // 處理rwd選單，在<768時，點擊其他route，導覽列會消失
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        setIsVisible(false);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const handleLogout = async () => {
    if (currentUser) {
      AuthService.logout();
      setCurrentUser(null);
    }
    window.alert("已登出，導向至首頁");
    window.location.href = "/";
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
      <div className={styles.navContainer}>
        <div className={styles.container}>
          <label htmlFor="menuControl" className={styles.menuBtn}>
            <FontAwesomeIcon icon={faBars} />
          </label>
          <div className={styles.navIcon}>
            {isHome && !isVisible && (
              <li>
                <a href="/">
                  <FontAwesomeIcon icon={faHouse} />
                </a>
              </li>
            )}

            {!isHome && (
              <li>
                <Link href="/" onClick={() => (window.location.href = "/")}>
                  <FontAwesomeIcon icon={faHouse} />
                </Link>
              </li>
            )}
            <li>
              <Link
                target="_blank"
                href="https://github.com/FangChenYi/salmon-shopping-website"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/chenyi-fang-926b3525a/"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </Link>
            </li>
            <li>
              <a target="_blank" href="mailto:fx17896@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
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
                  {!isHome && !isRegister && !isLogin && (
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
  );
}
