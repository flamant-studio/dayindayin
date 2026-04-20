import styles from "./page.module.css";

export const metadata = { title: "Practical — Day In Day In" };

export default function Practical() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Practical</h1>
      </section>
      <div className={styles.content}>
        <section>
          <h2>Shipping & Delivery</h2>
          <p>Information about shipping times and costs will go here.</p>
        </section>
        <section>
          <h2>Returns</h2>
          <p>Return policy information will go here.</p>
        </section>
        <section>
          <h2>Commissions</h2>
          <p>Information about commissioned works will go here.</p>
        </section>
        <section>
          <h2>Copyright</h2>
          <p>All art and photos by Stine Weirsøe Flamant. Please don&apos;t reproduce without authorisation.</p>
        </section>
      </div>
    </div>
  );
}
