import "../styles/global.css";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
