import Head from "next/head";
import NavBarComponent from "./navs/navBar-component";
import MemberBarComponent from "./navs/memberBar-component";
import styles from "../styles/navStyles/navBar.module.scss";
import React, { useState, useEffect } from "react";
import AuthService from "../service/auth.service";

export default function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);
  return (
    <div>
      <Head>
        <meta name="description" content="Online Shopping Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Online Shopping Website</title>
      </Head>
      <header>
        <div className={styles.header}>
          <NavBarComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />

          <MemberBarComponent />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
