import { Link, useOutletContext } from 'react-router-dom';
import ItemPhoto from '../../components/public/ItemPhoto';
import PhotoPlaceholder from '../../components/public/PhotoPlaceholder';
import SectionDivider from '../../components/public/SectionDivider';
import { getMenu } from '../../api/public';
import { useFetchOnMount } from '../../hooks/useFetchOnMount';
import './Home.css';

export default function Home() {
  const { restaurantInfo } = useOutletContext();
  const { data: categories } = useFetchOnMount(getMenu);

  const previewItems = (categories || [])
    .flatMap((c) => c.items)
    .filter((item) => item.is_featured);

  return (
    <div className="home-page">
      <section className="hero">
        <PhotoPlaceholder
          filename="hero-food-spread.jpg"
          alt="A spread of Lee's signature dishes, banchan, and barley tea on the table"
          aspectRatio="16 / 9"
          className="hero-photo"
        />
        <div className="hero-copy">
          <p className="hero-eyebrow">Louisville, KY · Family-owned since 1980</p>
          <h1>Lee&apos;s Korean Restaurant</h1>
          <p className="hero-sub">
            Louisville&apos;s first Korean restaurant — home-style bulgogi, bibimbap, and banchan,
            made the way the Yi and An families have always made it.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">
              View the menu
            </Link>
            <Link to="/location" className="btn btn-ghost">
              Get directions
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider tone="gold" />

      <section className="home-story">
        <div className="home-story-photo">
          <PhotoPlaceholder
            filename="an-family-interior.jpg"
            alt="The An family in the restaurant's dining room"
            aspectRatio="4 / 3"
          />
        </div>
        <div className="home-story-copy">
          <p className="section-eyebrow">Our story</p>
          <h2>Two families, one kitchen, since 1980.</h2>
          <p>
            Lee&apos;s opened its doors as the very first Korean restaurant in Louisville, started
            by the Yi family. In 2001, the An family — who had just moved from South Korea — took
            over, and they&apos;ve been cooking here ever since. What started as a family kitchen is
            still one today.
          </p>
          <Link to="/about" className="text-link">
            Read the full story →
          </Link>
        </div>
      </section>

      <SectionDivider tone="red" />

      {previewItems.length > 0 && (
        <section className="home-menu-preview">
          <p className="section-eyebrow center">A taste of the menu</p>
          <h2 className="center">Where to start</h2>
          <div className="menu-preview-grid">
            {previewItems.map((item) => (
              <div className="menu-preview-card" key={item.id}>
                <ItemPhoto
                  imageUrl={item.image_url}
                  filename={`menu-${item.name_en.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  alt={item.name_en}
                  aspectRatio="4 / 3"
                />
                <div className="menu-preview-card-body">
                  <div className="menu-preview-card-title">
                    <h3>{item.name_en}</h3>
                    {item.name_kr && <span className="kr-label">{item.name_kr}</span>}
                  </div>
                  <div className="menu-preview-card-meta">
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="center">
            <Link to="/menu" className="btn btn-primary">
              See the full menu
            </Link>
          </div>
        </section>
      )}

      <SectionDivider tone="teal" />

      <section className="home-visit">
        <p className="section-eyebrow center">Plan your visit</p>
        <h2 className="center">Find us on Bishop Lane</h2>
        {restaurantInfo?.address && (
          <p className="center visit-address">{restaurantInfo.address}</p>
        )}
        <p className="center visit-note">
          We&apos;re tucked into a strip mall just off the main road — look for our sign near the
          Ste 107 entrance.
        </p>
        <div className="center">
          <Link to="/location" className="btn btn-primary">
            Directions &amp; hours
          </Link>
        </div>
      </section>
    </div>
  );
}
