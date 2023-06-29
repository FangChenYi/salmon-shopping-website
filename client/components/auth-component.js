import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthService from "../service/auth.service";
import styles from "../styles/auth.module.scss";

export default function AuthsComponent({}) {
  const router = useRouter();
  const isLogin = router.pathname === "/user/login";
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let [currentUser, setCurrentUser] = useState(null);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async () => {
    try {
      await AuthService.register(username, email, password);
      window.alert("註冊成功，導向登入頁面");
      router.push("/user/login");
    } catch (e) {
      setMessage(e.reponse.data);
    }
  };

  const handleLogin = async () => {
    setMessage("");
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(AuthService.getCurrentUser());
      window.alert("登入成功");
      const redirectPath = localStorage.getItem("redirectPath");
      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    } catch (e) {
      console.log(e);
      setMessage(e.response.data);
    }
  };

  return (
    <div>
      <div className={styles.auth}>
        <div className={styles.authContainer}>
          <div className={styles.formState}>
            {isLogin ? <span>登入</span> : <span>註冊</span>}
          </div>
          <div className={styles.formContainer}>
            {!isLogin && (
              <div className={styles.formItem}>
                <input
                  onChange={handleUsername}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="使用者名稱"
                  required
                />
              </div>
            )}
            <div className={styles.formItem}>
              <input
                onChange={handleEmail}
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            {isLogin && (
              <div className={styles.formItem}>
                <input
                  onChange={handlePassword}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="密碼"
                  required
                />
              </div>
            )}
            {!isLogin && (
              <div className={styles.formItem}>
                <input
                  onChange={handlePassword}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="密碼長度不得小於 6"
                  required
                />
              </div>
            )}
          </div>

          {message && (
            <div className={styles.errorMessage}>
              <span>{message}</span>
            </div>
          )}

          <div className={styles.formContainer}>
            <div className={styles.formBtn}>
              {isLogin ? (
                <button onClick={handleLogin} type="submit">
                  登入
                </button>
              ) : (
                <button onClick={handleRegister} type="submit">
                  註冊
                </button>
              )}
            </div>
          </div>
          <div className={styles.authFooter}>
            <span>
              登入後，表示您同意本公司的
              <Link href="#">服務條款</Link>
              以及
              <Link href="#">隱私權政策</Link>
            </span>
            <div className={styles.registerContainer}>
              {isLogin && <span>還沒註冊帳號嗎？</span>}
              {isLogin && <Link href="/user/register">註冊</Link>}
              {!isLogin && <span>已經有註冊了嗎？</span>}
              {!isLogin && <Link href="/user/login">登入</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
