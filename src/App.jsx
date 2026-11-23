import './App.css'
import AdminDashboard from './AdminDashboard'
import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_URL = `${API_BASE}/api/projects`
const REVIEWS_API_URL = `${API_BASE}/api/reviews`
const PROMOTION_API_URL = `${API_BASE}/api/public/promotion`

const services = [
  { number: '01', title: 'Website Development', description: 'Modern, responsive websites designed to help your business build trust and reach more customers.', features: ['Business websites', 'Landing pages', 'Website redesigns'], icon: '⌘' },
  { number: '02', title: 'Website Security', description: 'Practical security improvements that help protect your website, its data, and your customers.', features: ['Security checks', 'Updates and maintenance', 'Website protection'], icon: '◇' },
  { number: '03', title: 'SEO & Online Visibility', description: 'Help potential customers discover your business through search engines and Google Maps.', features: ['Search engine optimization', 'Google Maps visibility', 'Performance improvements'], icon: '↗' },
]

function PublicReviewForm() {
  const [form, setForm] = useState({ customer: '', rating: '5', project: '', review: '' })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [approvedReviews, setApprovedReviews] = useState([])

  useEffect(() => {
    let active = true
    fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/public/reviews')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (active && Array.isArray(data)) setApprovedReviews(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  async function submitReview(event) {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')
    try {
      const response = await fetch(REVIEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.detail?.[0]?.msg || result?.detail || 'Your review could not be submitted. Please try again.')
      setForm({ customer: '', rating: '5', project: '', review: '' })
      setFeedback('Thank you! Your review has been received and is waiting for approval.')
    } catch (error) {
      setFeedback(error.message || 'Could not submit your review. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="reviews-section section-padding" id="customer-reviews">
      <div className="section-heading">
        <div>
          <span className="section-label">CLIENT FEEDBACK</span>
          <h2>Worked with us? <span>Share your experience.</span></h2>
        </div>
        <p>Your feedback helps others understand what it is like to work with Masters Tech.</p>
      </div>
      {approvedReviews.length > 0 && (
        <div className="approved-reviews-grid">
          {approvedReviews.map((review) => (
            <article className="approved-review-card" key={review.id}>
              <div className="approved-review-stars" aria-label={review.rating + ' out of 5 stars'}>{'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}</div>
              <p>“{review.review}”</p>
              <strong>{review.customer}</strong>
              {review.project && <small>{review.project}</small>}
            </article>
          ))}
        </div>
      )}
      <form className="public-review-form" id="write-review" onSubmit={submitReview}>
        <div className="public-review-grid">
          <label>
            Your name *
            <input value={form.customer} onChange={(event) => setForm((old) => ({ ...old, customer: event.target.value }))} required minLength={2} maxLength={120} placeholder="Enter your name" />
          </label>
          <label>
            Rating *
            <select value={form.rating} onChange={(event) => setForm((old) => ({ ...old, rating: event.target.value }))}>
              <option value="5">★★★★★ — Excellent</option>
              <option value="4">★★★★ — Very good</option>
              <option value="3">★★★ — Good</option>
              <option value="2">★★ — Fair</option>
              <option value="1">★ — Needs improvement</option>
            </select>
          </label>
          <label className="public-review-wide">
            Project or service (optional)
            <input value={form.project} onChange={(event) => setForm((old) => ({ ...old, project: event.target.value }))} maxLength={160} placeholder="e.g. Business website" />
          </label>
          <label className="public-review-wide">
            Your review *
            <textarea value={form.review} onChange={(event) => setForm((old) => ({ ...old, review: event.target.value }))} required minLength={8} maxLength={2000} rows={5} placeholder="Tell us about your experience..." />
          </label>
        </div>
        <div className="public-review-actions">
          <button className="button-primary" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit review'} <span>↗</span></button>
          <span>Your review will be checked before it appears publicly.</span>
        </div>
        {feedback && <p className="public-review-feedback" role="status" aria-live="polite">{feedback}</p>}
      </form>
    </section>
  )
}

function SiteHeader({ whatsappLink }) {
  return (
    <header className="navbar">
      <a className="brand" href="/" aria-label="Masters Tech home">
        <span className="brand-mark">M</span><span><strong>MASTERS</strong><small>TECH</small></span>
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/portfolio">Portfolio</a>
        <a className="nav-review-link" href="/reviews">Reviews</a>
        <a href="/contact">Contact</a>
      </nav>
      <a className="nav-cta" href={whatsappLink} target="_blank" rel="noreferrer">Let's Talk <span>↗</span></a>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      <a className="brand footer-brand" href="/">
        <span className="brand-mark">M</span><span><strong>MASTERS</strong><small>TECH</small></span>
      </a>
      <p>Digital solutions for a stronger online presence.</p>
      <span>© {new Date().getFullYear()} Masters Tech. All rights reserved.</span>
    </footer>
  )
}

function PageIntro({ label, title, description }) {
  return (
    <section className="inner-page-intro">
      <span className="section-label">{label}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function App() {
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [promotion, setPromotion] = useState(null)
  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const whatsappLink = 'https://wa.me/254700806728?text=' + encodeURIComponent('Hello Masters Tech, I would like to know more about your services.')

  useEffect(() => {
    const pages = {
      '/': ['Masters Tech | Website Development, Security & SEO', 'Masters Tech helps businesses build professional websites, improve website security and grow online visibility through SEO and Google Maps.'],
      '/about': ['About Masters Tech | Digital Solutions for Businesses', 'Learn about Masters Tech, our approach to website development, website security and helping businesses improve their online presence.'],
      '/services': ['Website Development, Security & SEO Services | Masters Tech', 'Explore Masters Tech services: business website development, website maintenance and security, search engine optimization and Google Maps visibility.'],
      '/portfolio': ['Website Development Portfolio | Masters Tech', 'View website projects and digital solutions created by Masters Tech for businesses and organisations.'],
      '/contact': ['Contact Masters Tech | Request a Website or SEO Service', 'Contact Masters Tech to discuss a business website, website security, SEO, Google Maps visibility or a custom web project.'],
      '/reviews': ['Customer Reviews | Masters Tech', 'Read customer feedback and share your experience working with Masters Tech.'],
    }
    const [title, description] = pages[pathname] || pages['/']
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = description
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = window.location.origin + (pathname === '/' ? '/' : pathname)
  }, [pathname])

  useEffect(() => {
    let active = true
    fetch(PROMOTION_API_URL)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active && data && Number(data.discountPercent) > 0) setPromotion(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (pathname !== '/portfolio') return undefined
    let active = true
    async function fetchProjects() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Unable to load portfolio projects.')
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('The projects response is invalid.')
        if (active) setProjects(data.map((project) => ({
          id: project.id, name: project.title, category: project.category,
          description: project.description, website: project.project_url || '', status: project.status,
        })))
      } catch {
        if (active) setProjectsError('Projects could not be loaded. Please make sure the backend is running.')
      } finally {
        if (active) setProjectsLoading(false)
      }
    }
    fetchProjects()
    return () => { active = false }
  }, [pathname])

  if (pathname === '/admin') return <AdminDashboard />

  const pageContent = {
    '/': (
      <>
        {promotion && (
          <section className="homepage-promotion" aria-label="Current special offer">
            <div className="homepage-promotion-inner">
              <span className="homepage-promotion-kicker">LIMITED-TIME OFFER</span>
              <div className="homepage-promotion-copy">
                <strong>{promotion.discountPercent}% OFF</strong>
                <span>{promotion.message}</span>
                <small>On {promotion.appliesTo}{promotion.endsAt ? ` · Offer ends ${new Date(`${promotion.endsAt}T00:00:00`).toLocaleDateString()}` : ''}</small>
              </div>
              <a href={'https://wa.me/254700806728?text=' + encodeURIComponent(`Hello Masters Tech, I saw your ${promotion.discountPercent}% promotion and would like to claim the offer.`)} target="_blank" rel="noreferrer">Claim this offer <span>↗</span></a>
            </div>
          </section>
        )}
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
        <section className="home-discovery section-padding">
          <span className="section-label">EXPLORE MASTERS TECH</span>
          <h2>Practical digital services to help your business <span>grow online.</span></h2>
          <div className="discovery-links">
            <a href="/about">Learn about us <span>↗</span></a>
            <a href="/services">Explore our services <span>↗</span></a>
            <a href="/portfolio">View our portfolio <span>↗</span></a>
            <a href="/contact">Contact our team <span>↗</span></a>
          </div>
        </section>
      </>
    ),
    '/about': (
      <>
        <PageIntro label="ABOUT MASTERS TECH" title={<>A practical technology partner for <span>business growth.</span></>} description="We help businesses establish a professional online presence with useful websites, dependable support and better visibility in search." />
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
        <section className="inner-content-section section-padding">
          <h2>Our approach</h2>
          <p>We start by understanding what your business needs, then recommend and build a solution that is clear, useful and suitable for your goals. We value straightforward communication, responsive design and solutions that are easy for customers to use.</p>
          <a className="button-primary" href="/contact">Talk to Masters Tech <span>↗</span></a>
        </section>
      </>
    ),
    '/services': (
      <>
        <PageIntro label="OUR SERVICES" title={<>Digital services built around <span>your business.</span></>} description="From a new business website to search visibility and ongoing website care, explore practical services that help your business reach and serve customers online." />
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
        <section className="inner-content-section section-padding">
          <h2>Not sure what your business needs?</h2>
          <p>Tell us what you want to achieve. We can discuss the right website, maintenance or online visibility solution for your business.</p>
          <a className="button-primary" href="/contact">Request a consultation <span>↗</span></a>
        </section>
      </>
    ),
    '/portfolio': (
      <>
        <PageIntro label="OUR PORTFOLIO" title={<>Selected website projects and <span>digital work.</span></>} description="Explore examples of website development and digital solutions. Each project gives you an idea of the work Masters Tech can deliver." />
<section className="portfolio-section section-padding" id="portfolio">
          <div className="section-heading">
            <div>
              <span className="section-label">OUR PORTFOLIO</span>
              <h2>Projects built with <span>purpose.</span></h2>
            </div>
            <p>
              Explore our demonstrations and completed work. Each project
              shows the kind of digital solutions we can create.
            </p>
          </div>

    <div className="portfolio-grid">
      {projectsLoading && <p>Loading portfolio projects...</p>}

      {projectsError && <p role="status">{projectsError}</p>}
      {projects.map((project, index) => (
        <article className="portfolio-card" key={project.id}>
          <div
            className={`portfolio-preview ${
              index % 3 === 0
                ? 'preview-business'
                : index % 3 === 1
                  ? 'preview-security'
                  : 'preview-education'
            }`}
          >
            <span className="preview-label">
              {project.status === 'Demo'
                ? 'DEMO PROJECT'
                : project.status === 'Completed'
                  ? 'COMPLETED PROJECT'
                  : 'IN PROGRESS'}
            </span>

            <div className="preview-window">
              <span className="preview-brand">{project.name}</span>
              <div className="preview-lines">
                <i />
                <i />
                <i />
              </div>
              <div className="preview-button">{project.category}</div>
            </div>
          </div>

          <div className="portfolio-info">
            <div className="project-meta">
              <span>
                {project.status === 'Demo'
                  ? 'Sample project'
                  : project.status === 'Completed'
                    ? 'Completed project'
                    : 'In progress'}
              </span>
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>

            <h3>{project.name}</h3>
            <p>
              {project.description ||
                'Explore this project to learn more about the services and features.'}
            </p>

            <div className="project-tags">
              <span>{project.category}</span>
              <span>{project.status}</span>
            </div>

            {project.website && (
              <a
                className="service-link project-action"
                href={project.website}
                target="_blank"
                rel="noreferrer"
              >
                View project <span>↗</span>
              </a>
            )}
          </div>
        </article>
      ))}

      {!projectsLoading && !projectsError && projects.length === 0 && (
        <p>No projects have been added to the portfolio yet.</p>
      )}
    </div>
        </section>
      </>
    ),
    '/contact': (
      <>
        <PageIntro label="CONTACT MASTERS TECH" title={<>Let's discuss your <span>next project.</span></>} description="Need a business website, a website refresh, security support or help getting found on Google? Get in touch and tell us what your business needs." />
<section className="contact-section section-padding" id="contact">
          <span className="section-label">HAVE A PROJECT IN MIND?</span>
          <h2>Let's build something <span>that works for you.</span></h2>
          <p>Tell us what your business needs. We'll take it from there.</p>
          <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
            Chat with Masters Tech on WhatsApp <span>↗</span>
          </a>
        </section>
        <section className="contact-details section-padding">
          <div><span className="section-label">WHATSAPP</span><h2>Start a conversation</h2><p>Send a message and tell us about your project.</p><a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">Chat on WhatsApp <span>↗</span></a></div>
          <div><span className="section-label">EMAIL</span><h2>Send an enquiry</h2><p>You can also contact Masters Tech by email.</p><a className="button-secondary" href="mailto:info@masterstech.co.ke">Email Masters Tech <span>↗</span></a></div>
        </section>
      </>
    ),
    '/reviews': (
      <>
        <section className="reviews-page-intro">
          <span className="section-label">MASTERS TECH · CUSTOMER FEEDBACK</span>
          <h1>What customers <span>are saying.</span></h1>
          <p>Read experiences from people who have worked with Masters Tech, or share your own experience.</p>
          <div className="reviews-page-actions">
            <a className="button-secondary" href="#customer-reviews">See customer reviews <span>↓</span></a>
            <a className="button-primary" href="#write-review">Write a review <span>↗</span></a>
          </div>
        </section>
        <PublicReviewForm />
      </>
    ),
  }

  const page = pageContent[pathname] || pageContent['/']
  return (
    <div className="site-wrapper">
      <SiteHeader whatsappLink={whatsappLink} />
      <main>{page}</main>
      <SiteFooter />
    </div>
  )
}

export default App
