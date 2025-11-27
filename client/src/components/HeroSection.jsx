const HeroSection = ({ title, subtitle, primaryText, secondaryText, primaryHref = '/iletisim', secondaryHref = '/portfoy' }) => (
  <header className="hero-section text-center">
    <div className="container">
      <h1 className="display-5 fw-bold mb-3">{title}</h1>
      <p className="lead mb-4">{subtitle}</p>
      <a href={primaryHref} className="btn btn-primary btn-lg me-2">
        {primaryText}
      </a>
      <a href={secondaryHref} className="btn btn-outline-light btn-lg">
        {secondaryText}
      </a>
    </div>
  </header>
);

export default HeroSection;
