import styles from "../../styles/footerStyles/footer.module.scss";

export default function NavStateComponent({}) {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>
            <a href="/">Salmon Shopping Website</a>
            <p>© 2023 Salmon Shopping Website All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
