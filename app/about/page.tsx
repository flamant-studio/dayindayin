import Image from "next/image";
import styles from "./page.module.css";

export const metadata = { title: "Bio — Day In Day In" };

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Stine Weirsøe Flamant</h1>
        <p className={styles.sub}>Contemporary artist · Copenhagen</p>
      </section>

      <section className={styles.bio}>
        <div className={styles.image}>
          <Image src="/images/placeholder-profile.jpg" alt="Stine Weirsøe Flamant" width={520} height={650} style={{ objectFit: "cover", width: "100%", height: "auto" }} />
        </div>
        <div className={styles.text}>
          <p>
            We all have <em>superpowers</em>. Mine is making something out of nothing. Colour is the fabric of my entire being.
            I am curious about &ldquo;the human condition&rdquo; — how to be human in these strange times, and what humanity looks like when you observe from the edges or from deep within.
          </p>
          <p>
            My disability (chronic autoimmune pain syndrome) and my personal history is the canvas for every artwork I create.
            I consider myself an outsider artist.
          </p>
          <p>
            Sometimes my art is literal — working with words and sentences taken from what I see and read, enlarging them on embroidery fabric.
            Sometimes the political aspect is more subtle or more personal.
          </p>
          <p>
            I am a textile artist involved in a love affair with embroidery and hand tufting.
            Slowly and gently, my artistic voice sounds more and more familiar to me.
          </p>
        </div>
      </section>
    </div>
  );
}
