import Link from "next/link";
import { Icon } from "./BookingUI";

export default function StayStory() {
  return (
    <section className="ref-container stay-story" id="life-at-snip">
      <div className="stay-story-heading">
        <div>
          <span className="ref-step ref-step-green">
            MORE THAN A PLACE TO STAY
          </span>
          <h2>A day full of their favourite things.</h2>
        </div>
        <p>
          A familiar routine, room to stretch, and people who care. Here’s the
          rhythm of a Snip & Style sleepover.
        </p>
      </div>
      <div className="stay-routine">
        {[
          [
            "01",
            "Fresh air & happy sniffs",
            "Lawn walks and supervised play, with space to explore at their own pace.",
            "paw",
          ],
          [
            "02",
            "Their food. Their routine.",
            "Bring their usual food and feeding instructions to keep mealtimes familiar.",
            "heart",
          ],
          [
            "03",
            "A little play. A cosy nap.",
            "Enrichment, gentle attention, and quiet rest in their own cage-free space.",
            "home",
          ],
          [
            "04",
            "A hello from your best friend",
            "Daily photo and video updates on WhatsApp, so you can stay close from afar.",
            "phone",
          ],
        ].map(([number, title, text, icon]) => (
          <article key={number}>
            <div>
              <span>{number}</span>
              <Icon name={icon} size={24} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="stay-care-notes">
        <div>
          <Icon name="bag" size={23} />
          <div>
            <h3>Pack a little piece of home.</h3>
            <p>
              Vaccination record, usual food, medication instructions, and a
              favourite toy or blanket. Tell us about nerves, sensitivities, and
              special care before your visit.
            </p>
            <Link href="/safety">Read our pet-care guidelines ↗</Link>
          </div>
        </div>
        <div>
          <Icon name="pin" size={23} />
          <div>
            <h3>Need a lift or a look around?</h3>
            <p>
              Visit our Kanakapura Road studio before booking. Pet-cab pickup
              and drop can be discussed with the team; availability and charges
              are confirmed separately.
            </p>
            <a href="tel:+919739887770">Talk to our team ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
