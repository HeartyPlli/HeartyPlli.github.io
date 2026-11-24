import { asset } from "../lib/assets";

export default function PageBanner({ eyebrow, title, children }) {
  return (
    <section className="page-banner">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{children}</p></div>
      <img src={asset("01/top.png")} alt="" className="banner-ornament" />
    </section>
  );
}
