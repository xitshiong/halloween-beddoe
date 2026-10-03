import Countdown from "@/components/countdown";
import NightWeb from "@/components/night-web";
import Pumpkin from "@/components/pumpkin";
import ShinyButton from "@/components/effects/shiny-button";
import { party, rsvpHint, rsvpHref } from "@/lib/party";
import styles from "./page.module.css";

const plan = [
  {
    time: "6:00",
    meridiem: "pm",
    title: "Doors open at Beddoe",
    body: `Costumes on, drinks out. ${party.address}, Clayton.`,
  },
  {
    time: "10:30",
    meridiem: "pm",
    title: "Into the city",
    body: "Pre-drinks wrap up and we head to Collins Street together.",
  },
];

function Rsvp({ big = false }: { big?: boolean }) {
  return (
    <ShinyButton
      href={rsvpHref()}
      label="RSVP on WhatsApp"
      className={big ? styles.ctaBig : styles.cta}
      fillColor="#7a1408"
      labelColor="#f3e6cf"
      accentColor="#ff5a1f"
      accentSoftColor="#ffd27a"
      cornerRadius={4}
    />
  );
}

export default function Home() {
  return (
    <main id="top">
        <section className={styles.hero}>
          <div className={styles.glow} aria-hidden="true">
            <Pumpkin className={styles.pumpkin} />
          </div>
          <div className={styles.halftone} aria-hidden="true" />
          <div className={styles.web} aria-hidden="true">
            <NightWeb />
          </div>

          <div className={styles.heroInner}>
            <h1 className={styles.title}>
              <span className={styles.titleTop}>Halloween</span>
              <span className={styles.titleBottom}>at Beddoe</span>
            </h1>
            <p className={styles.heroMeta}>
              <span>Friday 30 October 2026</span>
              <span>{party.address}, Clayton</span>
            </p>
            <Countdown />
            <div className={styles.heroActions}>
              <Rsvp />
              <a href="#plan" className={styles.ghost}>
                See the plan
              </a>
            </div>
          </div>
        </section>

        <section id="plan" className={styles.plan}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>The night</h2>
            <p className={styles.scrawl}>one house, one club, no early exits</p>
          </div>
          <ol className={styles.steps}>
            {plan.map((step) => (
              <li key={step.title} className={styles.step}>
                <p className={styles.time}>
                  {step.time}
                  <small>{step.meridiem}</small>
                </p>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="bring" className={styles.bring}>
          <h2 className={styles.h2}>Bring</h2>
          <div className={styles.bringGrid}>
            <div className={styles.costume}>
              <p className={styles.costumeWord}>A costume</p>
              <p className={styles.costumeNote}>Required. No costume, no entry.</p>
            </div>
            <div className={styles.bringItem}>
              <h3>Your own drinks</h3>
              <p>Alcohol or otherwise. BYO, and bring enough to share a round.</p>
            </div>
            <div className={styles.bringItem}>
              <h3>Snacks</h3>
              <p>Anything you can put on the table for everyone.</p>
            </div>
            <div className={styles.bringItem}>
              <h3>A Havoc ticket and ID</h3>
              <p>
                Ms Collins is 18+.{" "}
                <a href={party.ticketsUrl} target="_blank" rel="noopener noreferrer">
                  Get a ticket on Eventbrite
                </a>{" "}
                before it sells out.
              </p>
            </div>
          </div>
        </section>

        <section id="where" className={styles.where}>
          <h2 className={styles.h2}>Where</h2>
          <div className={styles.whereGrid}>
            <div className={styles.mapFrame}>
              <iframe
                title="Map of 3/41 Beddoe Avenue, Clayton"
                src={party.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.places}>
              <div className={styles.place}>
                <p className={styles.placeWhen}>From 6pm</p>
                <h3>{party.address}</h3>
                <p>{party.suburb}</p>
                <a href={party.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </div>
              <div className={styles.place}>
                <p className={styles.placeWhen}>After 10pm</p>
                <h3>{party.club}</h3>
                <p>{party.clubAddress}</p>
                <a href={party.clubMaps} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.final}>
          <div className={styles.finalGlow} aria-hidden="true" />
          <p className={styles.kicker}>Tell us you&rsquo;re in</p>
          <h2 className={styles.finalTitle}>Are you coming?</h2>
          <Rsvp big />
          <p className={styles.hint}>{rsvpHint()}</p>
        </section>

      <footer className={styles.footer}>
        <p>Halloween at Beddoe, Friday 30 October 2026.</p>
        <p>See you in costume.</p>
      </footer>
    </main>
  );
}
