const SiteFooter = () => (
  <footer className="footer py-5 mt-5">
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-4">
          <h5>Pırıl Koltuk Yıkama</h5>
          <p>Profesyonel ekip, son teknoloji makineler ve %100 müşteri memnuniyeti garantisi.</p>
        </div>
        <div className="col-md-4 mb-4">
          <h5>Hızlı Linkler</h5>
          <ul className="list-unstyled">
            <li>
              <a href="/portfoy">Çalışmalarımız</a>
            </li>
            <li>
              <a href="/iletisim">İletişim</a>
            </li>
            <li>
              <a href="/hakkimda">Hakkımızda</a>
            </li>
          </ul>
        </div>
        <div className="col-md-4 mb-4">
          <h5>İletişim</h5>
          <p>
            <i className="fas fa-map-marker-alt me-2" />
            İstanbul, Türkiye
          </p>
          <p>
            <i className="fas fa-phone me-2" />
            +90 555 000 00 00
          </p>
          <p>
            <i className="fas fa-envelope me-2" />
            info@piril.com
          </p>
        </div>
      </div>
      <hr />
      <div className="text-center">
        <small>&copy; 2025 Pırıl Koltuk Yıkama. Tüm hakları saklıdır.</small>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
