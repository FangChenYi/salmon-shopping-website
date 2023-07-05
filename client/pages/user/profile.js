import AuthService from "../../service/auth.service";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/profileStyles/profile.module.scss";

export default function Profile({}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);

    if (!user) {
      localStorage.setItem("redirectPath", "/user/profile");
      router.push("/user/login");
    }
  }, []);

  return (
    <div>
      {currentUser && (
        <div className={styles.profile}>
          <div className={styles.profileContainer}>
            <div className={styles.profileItem}>
              <p>以下是您的個人資料</p>
            </div>
            <div className={styles.profileItem}>
              <span>
                姓名：
                {currentUser.user.username}
              </span>
            </div>
            <div className={styles.profileItem}>
              <span>
                電子信箱：
                {currentUser.user.email}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
