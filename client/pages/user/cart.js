import CartComponent from "../../components/cart-component";
import styles from "../../styles/cart.module.scss";

export default function Cart({}) {
  return (
    <div>
      <div className={styles.container}>
        <CartComponent />
      </div>
    </div>
  );
}
