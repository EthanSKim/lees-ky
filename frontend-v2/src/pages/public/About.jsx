import PhotoPlaceholder from '../../components/public/PhotoPlaceholder';
import SectionDivider from '../../components/public/SectionDivider';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <p className="section-eyebrow center">Our story</p>
        <h1 className="center">Two families, one kitchen</h1>
      </section>

      <section className="about-block">
        <div className="about-block-copy">
          <h2>1980: the first Korean restaurant in Louisville</h2>
          <p>
            Lee&apos;s started as a family business, opened by Mr. and Mrs. Yi. At the time, there
            wasn&apos;t another Korean restaurant in the city — Lee&apos;s was the first. It was
            built the way most family restaurants are: on long hours, home recipes, and a room that
            felt like an extension of the family&apos;s own kitchen. Over the years, the Yi
            family&apos;s children grew up in the restaurant and eventually took it over themselves.
          </p>
        </div>
        <PhotoPlaceholder
          filename="restaurant-history-1980s.jpg"
          alt="Archival-style photo representing the restaurant's early years"
          aspectRatio="4 / 3"
        />
      </section>

      <SectionDivider tone="red" />

      <section className="about-block reverse">
        <div className="about-block-copy">
          <h2>2001: the An family takes over</h2>
          <p>
            In 2001, Lee&apos;s was sold to Mr. and Mrs. An, a family who had just moved from South
            Korea. They&apos;ve run the restaurant ever since, keeping the recipes and the spirit of
            the original kitchen while making it their own. What was already a family-run restaurant
            simply passed from one Korean family to another — the through-line was never the name on
            the door, it was the cooking.
          </p>
        </div>
        <PhotoPlaceholder
          filename="an-family-portrait.jpg"
          alt="The An family, current owners of the restaurant"
          aspectRatio="4 / 3"
        />
      </section>

      <SectionDivider tone="gold" />

      <section className="about-block">
        <div className="about-block-copy">
          <h2>A room that still feels like home</h2>
          <p>
            The dining room got a refresh around the restaurant&apos;s 35th anniversary, with help
            from a University of Louisville interior design professor — but the goal was never to
            make it feel new. It was to make sure it still felt like the same welcoming room
            regulars have been coming back to for decades. Grab a seat, ask for your spice level,
            and let us bring out the banchan.
          </p>
        </div>
        <PhotoPlaceholder
          filename="dining-room-interior.jpg"
          alt="The restaurant's dining room"
          aspectRatio="4 / 3"
        />
      </section>
    </div>
  );
}
