import { getMenu } from '../../api/public';
import CornerOrnament from '../../components/public/CornerOrnament';
import './Menu.css';
import { useFetchOnMount } from '../../hooks/useFetchOnMount';

function categoryAnchor(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function Menu() {
  const { data: categories, status } = useFetchOnMount(getMenu);

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <p className="section-eyebrow center">The menu</p>
        <h1 className="center">What we cook</h1>
        <p className="center menu-intro">
          🌶️ marks a spicy dish. Ask your server if you&apos;d like anything milder or spicier than
          listed.
        </p>
      </section>

      {status === 'loading' && <p className="center menu-state">Loading the menu…</p>}

      {status === 'error' && (
        <p className="center menu-state">
          We couldn&apos;t load the menu right now. Please call us or try again shortly.
        </p>
      )}

      {status === 'success' && categories.length === 0 && (
        <p className="center menu-state">
          The menu isn&apos;t published yet — please call for current offerings.
        </p>
      )}

      {status === 'success' && categories.length > 0 && (
        <>
          <nav className="category-nav" aria-label="Jump to menu category">
            {categories.map((category) => (
              <a key={category.id} href={`#${categoryAnchor(category.name)}`}>
                {category.name}
              </a>
            ))}
          </nav>

          <div className="menu-categories-grid">
            {categories.map((category) => (
              <section
                key={category.id}
                id={categoryAnchor(category.name)}
                className="menu-category-panel"
              >
                <h2 className="menu-category-title">
                  <span>{category.name}</span>
                </h2>
                <ul className="menu-item-list">
                  {category.items.map((item) => (
                    <li className="menu-list-item" key={item.id}>
                      <div className="menu-list-item-row">
                        <span className="menu-list-item-name">
                          {item.name_en}
                          {item.name_kr && <span className="kr-label"> {item.name_kr}</span>}
                        </span>
                        <span className="menu-list-item-leader" aria-hidden="true" />
                        <span className="menu-list-item-price">${item.price.toFixed(2)}</span>
                      </div>
                      {item.description && (
                        <p className="menu-list-item-description">{item.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
                <CornerOrnament
                  corner="bottom-left"
                  className="panel-ornament panel-ornament-left"
                />
                <CornerOrnament
                  corner="bottom-right"
                  className="panel-ornament panel-ornament-right"
                />
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
