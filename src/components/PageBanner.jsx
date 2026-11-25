export default function PageBanner({ eyebrow, title, children }) {
  return (
    <section className="page-banner">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{children}</p></div>
    </section>
  );
}
