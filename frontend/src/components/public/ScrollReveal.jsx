import { useScrollReveal } from '../../hooks/useScrollReveal';
import './ScrollReveal.css';

export default function ScrollReveal({ children, className = '', as: Tag = 'div' }) {
  const [ref, visible] = useScrollReveal();

  return (
    <Tag ref={ref} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </Tag>
  );
}
