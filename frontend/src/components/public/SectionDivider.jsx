import './SectionDivider.css';

/**
 * The site's one recurring signature element. Used between major sections
 * instead of a plain <hr> - a thin double rule with a small circular
 * accent, echoing the banded eaves of dancheong temple painting.
 */
export default function SectionDivider({ tone = 'red' }) {
  return (
    <div className={`section-divider tone-${tone}`} role="presentation" aria-hidden="true">
      <span className="section-divider-line" />
      <span className="section-divider-dot" />
      <span className="section-divider-line" />
    </div>
  );
}
