import SellerComponent from "../../components/seller-component";
import React, { useState, useEffect } from "react";

export default function SellerHome({}) {
  const [windowWidth, setwindowWidth] = useState(false);
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

  return (
    <div>
      <div>
        <SellerComponent
          windowWidth={windowWidth}
          setwindowWidth={setwindowWidth}
        />
      </div>
    </div>
  );
}
