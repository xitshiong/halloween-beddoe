import NightWeb from "@/components/night-web";
import ShinyButton from "@/components/effects/shiny-button";
import { party, rsvpHint, rsvpHref } from "@/lib/party";
import styles from "./invite.module.css";

export default function Home() {
  return (
    <main className={styles.scene}>
      <div className={styles.night} aria-hidden="true">
        <div className={styles.web}>
          <NightWeb />
        </div>
        <span className={styles.petal} />
        <span className={styles.petal} />
        <span className={styles.petal} />
        <span className={styles.petal} />
      </div>

      <section className={styles.door}>
        <article className={styles.paper}>
          <h1>
            <span className={styles.day}>{party.day}</span>
            <span className={styles.month}>{party.month}</span>
          </h1>
          <p className={styles.when}>{party.when}</p>
          <a className={styles.place} href={party.mapsUrl}>
            {party.address}
          </a>
          <p className={styles.rules}>{party.bring}</p>
          <hr className={styles.split} />
          <p className={styles.after}>
            {party.afterLead}{" "}
            <a className={styles.club} href={party.clubMaps}>
              {party.club}
            </a>
            . {party.afterNote}
          </p>
          <div className={styles.rsvp}>
            <ShinyButton
              href={rsvpHref()}
              label="RSVP on WhatsApp"
              className={styles.cta}
              fillColor="#4c1823"
              labelColor="#f6ead8"
              accentColor="#e7c27a"
              accentSoftColor="#fff1cc"
              cornerRadius={6}
            />
            <p className={styles.note}>{rsvpHint()}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
