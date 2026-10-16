import './App.css'

const services = [
  {
    number: '01',
    title: 'Website Development',
    description:
      'Modern, responsive websites designed to help your business build trust and reach more customers.',
    features: ['Business websites', 'Landing pages', 'Website redesigns'],
    icon: '⌘',
  },
  {
    number: '02',
    title: 'Website Security',
    description:
      'Practical security improvements that help protect your website, its data, and your customers.',
    features: ['Security checks', 'Updates and maintenance', 'Website protection'],
    icon: '◇',
  },
  {
    number: '03',
    title: 'SEO & Online Visibility',
    description:
      'Help potential customers discover your business through search engines and Google Maps.',
    features: ['Search engine optimization', 'Google Maps visibility', 'Performance improvements'],
    icon: '↗',
  },
]

function App() {
  const whatsappLink =
    'https://wa.me/254700806728?text=' +
    encodeURIComponent('Hello Masters Tech, I would like to know more about your services.')

  return (
    <div className="site-wrapper">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="Masters Tech home">
          <span className="brand-mark">M</span>
          <span>
            <strong>MASTERS</strong>
            <small>TECH</small>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href={whatsappLink} target="_blank" rel="noreferrer">
          Let's Talk <span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              YOUR DIGITAL GROWTH PARTNER
            </div>

            <h1>
              Build your future.
              <br />
              <span>Secure your</span>
              <br />
              digital presence.
            </h1>

            <p className="hero-description">
              We help businesses build professional websites, strengthen
              website security, and get discovered online.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
                Discuss your project <span>↗</span>
              </a>
              <a className="button-secondary" href="#services">
                Explore services <span>↓</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line" />
              <span>SMART WEBSITES. STRONGER SECURITY. BETTER VISIBILITY.</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Abstract digital network illustration">
            <div className="visual-glow" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="visual-center">
              <div className="center-shield">M</div>
              <span>MASTERS TECH</span>
              <small>DIGITAL SOLUTIONS</small>
            </div>
            <div className="floating-card card-top">
              <span className="mini-icon">↗</span>
              <span><strong>Online visibility</strong><small>Grow your reach</small></span>
            </div>
            <div className="floating-card card-bottom">
              <span className="mini-icon">✓</span>
              <span><strong>Security first</strong><small>Protection matters</small></span>
            </div>
            <div className="visual-caption">DESIGNED FOR THE DIGITAL WORLD</div>
          </div>

          <div className="hero-index"><span>01</span> / 03</div>
        </section>

        <section className="trust-strip">
          <span>WHAT WE HELP YOU DO</span>
          <div><i>✳</i> Build a professional online presence</div>
          <div><i>✳</i> Protect your digital assets</div>
          <div><i>✳</i> Reach more potential customers</div>
        </section>

        <section className="services-section section-padding" id="services">
          <div className="section-heading">
            <div>
              <span className="section-label">OUR SERVICES</span>
              <h2>Everything your business needs to <span>grow online.</span></h2>
            </div>
            <p>
              Practical digital services focused on your website, your security,
              and your visibility.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-number">{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.features.map((feature) => (
                    <li key={feature}><span>✓</span> {feature}</li>
                  ))}
                </ul>
                <a
                  className="service-link"
                  href={`${whatsappLink}&service=${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Discuss this service <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section section-padding" id="about">
          <div className="about-mark">M<span>.</span></div>
          <div className="about-content">
            <span className="section-label">ABOUT MASTERS TECH</span>
            <h2>Technology should work <span>for your business.</span></h2>
            <p>
              Masters Tech helps businesses establish and improve their online
              presence through web development, website security, and search
              visibility. Our focus is on practical solutions, clear communication,
              and building digital experiences around real business needs.
            </p>
            <a className="text-link" href={whatsappLink} target="_blank" rel="noreferrer">
              Let's discuss your goals <span>↗</span>
            </a>
          </div>
        </section>

        <section className="contact-section section-padding" id="contact">
          <span className="section-label">HAVE A PROJECT IN MIND?</span>
          <h2>Let's build something <span>that works for you.</span></h2>
          <p>Tell us what your business needs. We'll take it from there.</p>
          <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
            Chat with Masters Tech on WhatsApp <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">M</span>
          <span><strong>MASTERS</strong><small>TECH</small></span>
        </a>
        <p>Digital solutions for a stronger online presence.</p>
        <span>© {new Date().getFullYear()} Masters Tech. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default App