import { useRouter } from "next/router";
import styles from "../../styles/navStyles/memberBar.module.scss";

export default function NavStateComponent({}) {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const isLogin = router.pathname === "/user/login";
  const isRegister = router.pathname === "/user/register";
  const isProfile = router.pathname === "/user/profile";
  const isCart = router.pathname === "/user/cart";
  const isOrder = router.pathname === "/user/order";
  const isSeller = router.pathname.startsWith("/seller");

  return (
    <div>
      {!isHome && (
        <div className={styles.stateContainer}>
          <div className={styles.container}>
            <div className={styles.userState}>
              {isProfile && <sapn>會員中心</sapn>}
              {isLogin && <sapn>登入</sapn>}
              {isRegister && <sapn> 註冊</sapn>}
              {isCart && <sapn>購物車</sapn>}
              {isSeller && <sapn>賣家中心</sapn>}
              {isOrder && <sapn>訂單查詢</sapn>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
