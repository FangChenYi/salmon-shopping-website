import CartComponent from "../../components/carts/cart-component";
import styles from "../../styles/cartStyles/cart.module.scss";

export default function Cart({}) {
  return (
    <div>
      <div className={styles.container}>
        <CartComponent />
      </div>
    </div>
  );
}
