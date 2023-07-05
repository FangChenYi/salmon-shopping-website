import Head from "next/head";
import React, { useState, useEffect } from "react";
import styles from "../styles/layout.module.css";
import NavBarComponent from "../components/navs/navBar-component";
import MemberBarComponent from "../components/navs/memberBar-component";
import Footer from "../components/footer/footer-component";

export default function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Head>
        <meta name="description" content="Online Shopping Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Salmon Shopping Website</title>
      </Head>
      <header>
        <NavBarComponent />
        <MemberBarComponent />
      </header>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}
