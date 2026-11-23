import './App.css'
import AdminDashboard from './AdminDashboard'
import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
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
        <a href="/sample-sites">Sample Sites</a>
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


const sampleSites = [
  { id: 'business', number: '01', title: 'Business & Corporate', category: 'Business website', description: 'A clean, professional website for a company that wants to explain its services, build trust and receive enquiries.', features: ['Company overview', 'Services and team', 'Contact enquiries'], style: 'preview-business-ui' },
  { id: 'shop', number: '02', title: 'Online Store', category: 'E-commerce', description: 'A product-focused online shop with product cards, categories, prices and a clear shopping experience.', features: ['Product catalogue', 'Shopping cart layout', 'Promotions and offers'], style: 'preview-shop-ui' },
  { id: 'restaurant', number: '03', title: 'Restaurant & Café', category: 'Food and hospitality', description: 'A welcoming design for restaurants, cafés and food businesses to display menus and make it easy to get in touch.', features: ['Menu highlights', 'Food photography layout', 'Reservations and location'], style: 'preview-food-ui' },
  { id: 'education', number: '04', title: 'School & Learning', category: 'Education website', description: 'An organised learning platform for schools, training centres and online courses.', features: ['Courses and programmes', 'Learning information', 'Student enquiries'], style: 'preview-learning-ui' },
  { id: 'property', number: '05', title: 'Real Estate', category: 'Property website', description: 'A visual property listing website for agents and property businesses to showcase available homes and spaces.', features: ['Property listings', 'Price and location details', 'Viewing enquiries'], style: 'preview-property-ui' },
  { id: 'booking', number: '06', title: 'Booking & Appointments', category: 'Booking website', description: 'A simple booking experience for salons, consultants, clinics and service providers who accept appointments.', features: ['Service selection', 'Available time slots', 'Booking requests'], style: 'preview-booking-ui' },
  { id: 'dashboard', number: '07', title: 'Admin Dashboard', category: 'Web application UI', description: 'A structured dashboard for managing business information, customers, tasks, payments and reports.', features: ['Summary cards', 'Data tables', 'Management tools'], style: 'preview-dashboard-ui' },
]

function SampleSitePreview({ type }) {
  if (type === 'preview-shop-ui') return (
    <div className="sample-browser sample-shop">
      <div className="sample-browser-bar"><i /><i /><i /><span>YOURSTORE.COM</span></div>
      <div className="sample-shop-nav"><b>SHOP<span>NOW.</span></b><small>NEW IN　 WOMEN　 MEN　 HOME</small><strong>⌕　♙　▢</strong></div>
      <div className="sample-shop-hero"><div><small>THE NEW COLLECTION</small><b>Find your<br />everyday style.</b><em>SHOP COLLECTION　↗</em></div><div className="sample-fashion-shape"><i /><b /></div></div>
      <div className="sample-product-row"><i /><i /><i /></div>
    </div>
  )
  if (type === 'preview-food-ui') return (
    <div className="sample-browser sample-food">
      <div className="sample-browser-bar"><i /><i /><i /><span>THEGARDEN.CAFE</span></div>
      <div className="sample-food-nav"><b>the garden.</b><small>MENU　 OUR STORY　 FIND US</small></div>
      <div className="sample-food-hero"><small>FRESH · LOCAL · MADE WITH LOVE</small><b>Good food.<br />Good mood.</b><span>EXPLORE OUR MENU　↗</span></div>
      <div className="sample-food-menu"><i /><i /><i /></div>
    </div>
  )
  if (type === 'preview-learning-ui') return (
    <div className="sample-browser sample-learning">
      <div className="sample-browser-bar"><i /><i /><i /><span>LEARNHUB.ACADEMY</span></div>
      <div className="sample-learning-nav"><b>learn<span>hub.</span></b><small>COURSES　 ABOUT　 RESOURCES</small></div>
      <div className="sample-learning-hero"><div><small>LEARN SOMETHING NEW</small><b>Skills for your<br />next chapter.</b><span>EXPLORE COURSES</span></div><div className="sample-learning-art"><i>✦</i><b>LEARN<br />GROW<br />ACHIEVE</b></div></div>
      <div className="sample-learning-bottom"><i /><i /><i /></div>
    </div>
  )
  if (type === 'preview-property-ui') return (
    <div className="sample-browser sample-property">
      <div className="sample-browser-bar"><i /><i /><i /><span>HOMESPACES.CO</span></div>
      <div className="sample-property-nav"><b>H<span>O</span>ME / SPACE</b><small>BUY　 RENT　 SELL</small></div>
      <div className="sample-property-hero"><small>FIND A PLACE TO CALL HOME</small><b>Spaces that<br />feel like yours.</b><div className="sample-property-search">Location　⌄　 Property type　⌄　 <strong>SEARCH</strong></div></div>
      <div className="sample-property-list"><i /><i /></div>
    </div>
  )
  if (type === 'preview-booking-ui') return (
    <div className="sample-browser sample-booking">
      <div className="sample-browser-bar"><i /><i /><i /><span>BOOKMYTIME.COM</span></div>
      <div className="sample-booking-nav"><b>studio<span>+</span></b><small>SERVICES　 OUR TEAM　 CONTACT</small></div>
      <div className="sample-booking-hero"><div><small>YOUR TIME, YOUR WAY</small><b>Make time<br />for yourself.</b><span>BOOK AN APPOINTMENT</span></div><div className="sample-calendar"><b>SELECT A DATE</b><div> M　 T　 W　 T　 F</div><strong> 12　13　14　15　16</strong><small>AVAILABLE TIMES</small><i>09:00　 11:30　 14:00</i></div></div>
    </div>
  )
  if (type === 'preview-dashboard-ui') return (
    <div className="sample-browser sample-dashboard">
      <div className="sample-dashboard-side"><b>◈　WORKSPACE</b><span>▦　 Overview</span><span>▤　 Projects</span><span>♙　 Customers</span><span>▧　 Reports</span></div>
      <div className="sample-dashboard-main"><div className="sample-dashboard-top">Dashboard <small>Welcome back, Admin</small></div><div className="sample-dashboard-stats"><i><small>REVENUE</small><b>KES 84,500</b></i><i><small>ORDERS</small><b>128</b></i><i><small>CUSTOMERS</small><b>64</b></i></div><div className="sample-dashboard-chart"><b>Performance overview</b><div><i /><i /><i /><i /><i /><i /><i /></div></div></div>
    </div>
  )
  return (
    <div className="sample-browser sample-business">
      <div className="sample-browser-bar"><i /><i /><i /><span>YOURBUSINESS.CO.KE</span></div>
      <div className="sample-business-nav"><b>BRAND<span>.</span></b><small>HOME　 ABOUT　 SERVICES　 CONTACT</small></div>
      <div className="sample-business-hero"><small>WELCOME TO YOUR BUSINESS</small><b>Ideas into<br />experiences.</b><p>A professional online home for your brand.</p><span>DISCOVER MORE　↗</span></div>
      <div className="sample-business-bottom"><i /><i /><i /></div>
    </div>
  )
}

function App() {
  const [promotion, setPromotion] = useState(null)
  const requestedPathname = window.location.pathname.replace(/\/$/, '') || '/'
  const pathname = requestedPathname === '/portfolio' ? '/sample-sites' : requestedPathname
  if (requestedPathname === '/portfolio') window.history.replaceState(null, '', '/sample-sites')
  const whatsappLink = 'https://wa.me/254700806728?text=' + encodeURIComponent('Hello Masters Tech, I would like to know more about your services.')

  useEffect(() => {
    const pages = {
      '/': ['Masters Tech | Website Development, Security & SEO', 'Masters Tech helps businesses build professional websites, improve website security and grow online visibility through SEO and Google Maps.'],
      '/about': ['About Masters Tech | Digital Solutions for Businesses', 'Learn about Masters Tech, our approach to website development, website security and helping businesses improve their online presence.'],
      '/services': ['Website Development, Security & SEO Services | Masters Tech', 'Explore Masters Tech services: business website development, website maintenance and security, search engine optimization and Google Maps visibility.'],
      '/sample-sites': ['Website Design Samples & UI Ideas | Masters Tech', 'Explore sample website designs for business websites, online shops, restaurants, education, property listings and booking platforms. Choose a style for your next website.'],
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
              <a className="button-secondary" href="/services">
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
            <a href="/sample-sites">Explore sample UIs <span>↗</span></a>
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
    '/sample-sites': (
      <>
        <PageIntro label="SAMPLE SITES & UI IDEAS" title={<>Explore website styles for <span>your next idea.</span></>} description="Browse different website layouts and visual styles. These samples help you explain what you like and help us understand the kind of website you want us to build." />
        <section className="sample-sites-section section-padding">
          <div className="section-heading">
            <div>
              <span className="section-label">DESIGN INSPIRATION</span>
              <h2>What type of website do you <span>have in mind?</span></h2>
            </div>
            <p>Choose a sample as a starting point. We can adjust the colours, sections and features to suit your business.</p>
          </div>
          <div className="sample-sites-grid">
            {sampleSites.map((sample) => (
              <article className="sample-site-card" key={sample.id}>
                <div className={`sample-site-visual ${sample.style}`}>
                  <SampleSitePreview type={sample.style} />
                  <span className="sample-visual-tag">UI CONCEPT</span>
                </div>
                <div className="sample-site-info">
                  <div className="sample-site-meta"><span>{sample.category}</span><small>{sample.number}</small></div>
                  <h2>{sample.title}</h2>
                  <p>{sample.description}</p>
                  <ul>{sample.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
                  <a className="sample-site-action" href={`https://wa.me/254700806728?text=${encodeURIComponent(`Hello Masters Tech, I am interested in the ${sample.title} sample UI. I would like to discuss a similar website for my business.`)}`} target="_blank" rel="noreferrer">Discuss this design <span>↗</span></a>
                </div>
              </article>
            ))}
          </div>
          <p className="sample-sites-note">These are visual design concepts to help you choose a direction. They are not live websites or completed client projects. Your final website can be customised to your content, brand and requirements.</p>
        </section>
        <section className="inner-content-section section-padding">
          <h2>Have a different design in mind?</h2>
          <p>Send us a reference, describe your idea or choose one of the samples above. We can discuss a design that fits your business.</p>
          <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">Discuss your website idea <span>↗</span></a>
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
