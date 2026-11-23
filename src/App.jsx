import './App.css'
import AdminDashboard from './AdminDashboard'
import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const REVIEWS_API_URL = `${API_BASE}/api/reviews`
const PROMOTION_API_URL = `${API_BASE}/api/public/promotion`

const services = [
  {
    number: '01',
    title: 'Website Design & Development',
    description: 'Give your business a home on the internet. I design and build clean, modern websites that explain what you offer, help visitors trust your business and make it easy for them to contact you.',
    outcome: 'Whether you are starting from scratch or improving an existing website, we can shape it around your business and the people you want to reach.',
    features: ['Business and company websites', 'Landing pages for products or services', 'Website redesigns and improvements', 'Mobile-friendly layouts and contact options'],
    icon: '⌘',
  },
  {
    number: '02',
    title: 'SEO & Google Visibility',
    description: 'A good website should be easy for people to find. I help improve how your business appears in search results and on Google, so potential customers can discover what you offer when they are looking.',
    outcome: 'We focus on the important details that help search engines understand your website and help customers find useful information about your business.',
    features: ['Search engine optimisation (SEO)', 'Google Business Profile guidance', 'Google Search and Maps visibility', 'Website content and page improvements'],
    icon: '↗',
  },
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



const uiInspiration = [
  { title: 'Modern business website', type: 'Business website', image: 'https://1design.fr/media/generated/portfolio-hero-case-wall-v2.jpg', source: 'https://1design.fr/portfolio', credit: '1Design' },
  { title: 'Creative website layouts', type: 'Landing pages', image: 'https://assets-global.website-files.com/63a9fb94e473f36dbe99c1b1/651bc93137c3b28745d3c59a_xDLVzpjYRLmCOZs6M1u7.png', source: 'https://www.manypixels.co/blog/web-design/web-design-inspiration', credit: 'ManyPixels' },
  { title: 'E-commerce management interface', type: 'Business management UI', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/834404108113299.5fb6bb0a6877a.png', source: 'https://www.behance.net/gallery/108113299/E-Commerce-Admin-Dashboard-UI', credit: 'Behance · E-Commerce Admin UI' },
  { title: 'Restaurant booking experience', type: 'Restaurant & booking', image: 'https://cdn.dribbble.com/userupload/45452362/file/4214527580621af952e5c27ea7ea8323.png?resize=2048x1536&vertical=center', source: 'https://dribbble.com/tags/restaurant-booking', credit: 'Dribbble' },
  { title: 'Online store dashboard', type: 'E-commerce', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/a0b047185096789.655dcf28b90d0.jpg', source: 'https://www.behance.net/gallery/185096789/E-commerce-Online-Shop-Dashboard-UI-Design', credit: 'Behance · Online Shop UI' },
  { title: 'Fashion store website', type: 'E-commerce website', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4dc26c107646469.604471a0ef54a.jpg', source: 'https://www.behance.net/gallery/107646469/E-commerce-website-landing-page-design-UI-UX-Design', credit: 'Behance · E-commerce Landing' },
  { title: 'Property listings interface', type: 'Real estate', image: 'https://www.webocreators.com/img/UI-UX-Design-Project-3.jpg', source: 'https://www.webocreators.com/ui-ux-design', credit: 'Webocreators' },
  { title: 'Restaurant management system', type: 'Restaurant dashboard', image: 'https://unicornconnectedappsblob.blob.core.windows.net/poddle-capps/permanent/general/product-a1c08b51-5feb-4c6f-9cf7-9fc361526bde.png', source: 'https://kornex.ai/', credit: 'Kornex' },
  { title: 'Digital restaurant menu', type: 'Restaurant & ordering', image: 'https://www.qrea.pro/qrea-cover.png', source: 'https://www.qrea.pro/', credit: 'Qrea' },
  { title: 'Shopping and checkout flow', type: 'E-commerce platform', image: 'https://cdn.ostad.app/public/upload/2026-04-15T08-53-30.173Z-11.png', source: 'https://ostad.app/course/mern/projects/3', credit: 'Ostad' },
  { title: 'Business analytics interface', type: 'Business management UI', image: 'https://nextjs.spruko.com/ynex/demo/img/ltr-main/screen2.png', source: 'https://nextjs.spruko.com/ynex/', credit: 'Ynex dashboard' },
  { title: 'UI inspiration collection', type: 'Mixed website UI', image: 'https://cdn.prod.website-files.com/613f261bb8fac770ce93134d/65d7928ddd80fa417b1d7b66_sitesweb.webp', source: 'https://www.slidor.agency/', credit: 'Slidor' },
  { title: 'Modern interface moodboard', type: 'Mixed UI concepts', image: 'https://legiit-service.s3.amazonaws.com/0c51a37492e70b72b9c73aed0be65260/344bf1245b40ea1af2d86143ef13ae86.jpg', source: 'https://legiit.com/shnabil/design-modern-professional-ui-ux', credit: 'Legiit · UI/UX Showcase' },
  { title: 'Dark and bold web layouts', type: 'Creative websites', image: 'https://uithings.com/media/uithings/what-is-framer-1.jpg', source: 'https://uithings.com/what-is-framer', credit: 'UI Things' },
  { title: 'Website design inspiration board', type: 'Website inspiration', image: 'https://layers-uploads-prod.s3.eu-west-2.amazonaws.com/487b4d33-9b95-4a91-a0cf-9cfdc50726bb-Frame-1000002915.jpg', source: 'https://muz.li/inspiration/homepage/', credit: 'Muzli' },
  { title: 'Pinterest-style discovery layout', type: 'Visual discovery UI', image: 'https://assets.justinmind.com/wp-content/uploads/2025/03/pinterest-infinite-scroll-example.png', source: 'https://www.justinmind.com/ui-design/infinite-scroll', credit: 'Justinmind' },
]

const sampleSites = [
  { id: 'business', number: '01', title: 'Business & Corporate', category: 'Business website', description: 'A clean, professional website for a company that wants to explain its services, build trust and receive enquiries.', features: ['Company overview', 'Services and team', 'Contact enquiries'], style: 'preview-business-ui' },
  { id: 'shop', number: '02', title: 'Online Store', category: 'E-commerce', description: 'A product-focused online shop with product cards, categories, prices and a clear shopping experience.', features: ['Product catalogue', 'Shopping cart layout', 'Promotions and offers'], style: 'preview-shop-ui' },
  { id: 'restaurant', number: '03', title: 'Restaurant & Café', category: 'Food and hospitality', description: 'A welcoming design for restaurants, cafés and food businesses to display menus and make it easy to get in touch.', features: ['Menu highlights', 'Food photography layout', 'Reservations and location'], style: 'preview-food-ui' },
  { id: 'education', number: '04', title: 'School & Learning', category: 'Education website', description: 'An organised learning platform for schools, training centres and online courses.', features: ['Courses and programmes', 'Learning information', 'Student enquiries'], style: 'preview-learning-ui' },
  { id: 'property', number: '05', title: 'Real Estate', category: 'Property website', description: 'A visual property listing website for agents and property businesses to showcase available homes and spaces.', features: ['Property listings', 'Price and location details', 'Viewing enquiries'], style: 'preview-property-ui' },
  { id: 'booking', number: '06', title: 'Booking & Appointments', category: 'Booking website', description: 'A simple booking experience for salons, consultants, clinics and service providers who accept appointments.', features: ['Service selection', 'Available time slots', 'Booking requests'], style: 'preview-booking-ui' },
  { id: 'dashboard', number: '07', title: 'Business Management System', category: 'Web application UI', description: 'A structured dashboard for managing business information, customers, tasks, payments and reports.', features: ['Summary cards', 'Data tables', 'Management tools'], style: 'preview-dashboard-ui' },
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
      <div className="sample-dashboard-main"><div className="sample-dashboard-top">Workspace overview <small>Your business at a glance</small></div><div className="sample-dashboard-stats"><i><small>REVENUE</small><b>KES 84,500</b></i><i><small>ORDERS</small><b>128</b></i><i><small>CUSTOMERS</small><b>64</b></i></div><div className="sample-dashboard-chart"><b>Performance overview</b><div><i /><i /><i /><i /><i /><i /><i /></div></div></div>
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
  const [activeSampleTab, setActiveSampleTab] = useState('samples')
  const requestedPathname = window.location.pathname.replace(/\/$/, '') || '/'
  const pathname = requestedPathname === '/portfolio' ? '/sample-sites' : requestedPathname
  if (requestedPathname === '/portfolio') window.history.replaceState(null, '', '/sample-sites')
  const whatsappLink = 'https://wa.me/254700806728?text=' + encodeURIComponent('Hello Masters Tech, I would like to know more about your services.')

  useEffect(() => {
    const pages = {
      '/': ['Masters Tech | Website Development, Security & SEO', 'Masters Tech helps businesses build professional websites, improve website security and grow online visibility through SEO and Google Maps.'],
      '/about': ['About Hezron Okoth | Masters Tech Website Development & SEO', 'Meet Hezron Okoth, the person behind Masters Tech. Learn about professional website development, SEO and Google visibility services for businesses.'],
      '/services': ['Website Design, Development & SEO Services | Masters Tech', 'Explore Masters Tech website design and development, search engine optimisation, and Google visibility services for businesses.'],
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
              <div className="homepage-promotion-emblem" aria-hidden="true"><span>✦</span><strong>{promotion.discountPercent}%</strong><small>SAVINGS</small></div>
              <div className="homepage-promotion-content">
                <span className="homepage-promotion-kicker"><i /> A LITTLE SOMETHING FOR YOUR BUSINESS</span>
                <div className="homepage-promotion-copy">
                  <strong>{promotion.discountPercent}% <span>OFF</span></strong>
                  <b>{promotion.message}</b>
                  <small>On {promotion.appliesTo}{promotion.endsAt ? ` · Offer ends ${new Date(`${promotion.endsAt}T00:00:00`).toLocaleDateString()}` : ''}</small>
                </div>
              </div>
              <a href={'https://wa.me/254700806728?text=' + encodeURIComponent(`Hello Masters Tech, I saw your ${promotion.discountPercent}% promotion and would like to claim the offer.`)} target="_blank" rel="noreferrer">Claim your offer <span>↗</span></a>
            </div>
          </section>
        )}
<section className="hero hero-showcase" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              DIGITAL EXPERIENCES FOR AMBITIOUS BUSINESSES
            </div>
            <h1>
              Your business.
              <br />
              <span>Built to stand out.</span>
            </h1>
            <p className="hero-description">
              We create modern websites that make your business look professional,
              connect with customers and get discovered on Google.
            </p>
            <p className="hero-extra-copy">
              Your website should do more than look good. It should tell your story,
              make it easy for people to choose you, and turn curious visitors into real enquiries.
            </p>
            <div className="hero-benefit-points">
              <span><i>✓</i> Designed around your business</span>
              <span><i>✓</i> Easy to use on every screen</span>
              <span><i>✓</i> Built to help customers take action</span>
            </div>
            <div className="hero-actions">
              <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
                Let's build your website <span>↗</span>
              </a>
              <a className="button-secondary" href="/sample-sites">
                Explore our designs <span>↓</span>
              </a>
            </div>
            <a className="hero-whatsapp-link" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Chat with Masters Tech on WhatsApp">
              <svg viewBox="0 0 32 32" role="img" aria-hidden="true"><path d="M16 3.2A12.7 12.7 0 0 0 5.1 22.4L3.4 28.7l6.5-1.7A12.8 12.8 0 1 0 16 3.2Z" /><path d="M12.1 10.2c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.5 1.5-1.5 3.6s1.5 4.1 1.7 4.4c.2.3 2.9 4.6 7.1 6.2 3.5 1.4 4.2 1.1 5 .9.8-.1 2.5-1 2.9-2 .4-1 .4-1.8.3-2-.1-.2-.4-.3-.8-.5l-2.8-1.4c-.4-.2-.7-.2-1 .2-.3.4-1.1 1.4-1.4 1.7-.3.3-.5.3-.9.1-.4-.2-1.8-.7-3.4-2.1-1.3-1.1-2.1-2.5-2.4-2.9-.2-.4 0-.6.2-.8l.7-.8c.2-.3.3-.5.5-.8.1-.3 0-.6 0-.8l-1.2-2.9Z" /></svg>
              <span>Prefer WhatsApp? <strong>Chat with us directly</strong></span>
              <span className="hero-whatsapp-arrow">↗</span>
            </a>
            <div className="hero-note">
              <span className="note-line" />
              <span>WEBSITE DEVELOPMENT · SEO · GOOGLE VISIBILITY</span>
            </div>
          </div>

          <div className="hero-visual hero-ui-stage" aria-label="Animated showcase of website designs on laptop screens">
            <div className="showcase-aura" />
            <div className="ui-float ui-float-left">
              <div className="ui-window-bar"><i /><i /><i /><span>shop-online.co.ke</span></div>
              <div className="ui-shop-preview"><small>NEW COLLECTION</small><b>Find your<br />everyday style.</b><span>SHOP NOW ↗</span><div className="ui-product-shapes"><i /><i /><i /></div></div>
            </div>
            <div className="ui-float ui-float-right">
              <div className="ui-window-bar"><i /><i /><i /><span>business dashboard</span></div>
              <div className="ui-dashboard-preview"><b>Overview</b><div className="ui-stat-row"><i /><i /><i /></div><div className="ui-chart"><i /><i /><i /><i /><i /><i /><i /></div><small>Performance at a glance</small></div>
            </div>
            <div className="hero-laptop">
              <div className="laptop-screen">
                <div className="laptop-browser-bar"><i /><i /><i /><span>yourbusiness.co.ke</span></div>
                <div className="laptop-site-preview">
                  <div className="laptop-site-nav"><b>YOUR BRAND<span>.</span></b><small>HOME　 ABOUT　 SERVICES　 CONTACT</small></div>
                  <div className="laptop-site-hero">
                    <div className="laptop-site-copy"><small>WELCOME TO YOUR NEXT CHAPTER</small><b>Make your<br />business shine.</b><span>DISCOVER MORE ↗</span></div>
                    <div className="laptop-site-art" aria-hidden="true"><div className="laptop-art-orbit"><i /><i /><i /></div><div className="laptop-art-card"><small>GROW ONLINE</small><b>+48%</b><span>More visibility</span><div /></div></div>
                  </div>
                  <div className="laptop-site-bottom">
                    <div><i>✦</i><span><b>Stand out online</b><small>A polished first impression</small></span></div>
                    <div><i>↗</i><span><b>Reach more people</b><small>Be easier to discover</small></span></div>
                    <div><i>◎</i><span><b>Built for every screen</b><small>Mobile-friendly design</small></span></div>
                  </div>
                </div>
              </div>
              <div className="laptop-base"><span /></div>
            </div>
            <div className="showcase-chip showcase-chip-top"><span>✦</span> Beautiful, responsive design</div>
            <div className="showcase-chip showcase-chip-bottom"><span>↗</span> Made to grow your business</div>
          </div>
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
        <PublicReviewForm />
      </>
    ),
    '/about': (
      <>
        <PageIntro label="THE PERSON BEHIND MASTERS TECH" title={<>Thoughtful websites. <span>Real business purpose.</span></>} description="I'm Hezron, the person behind Masters Tech. I help businesses turn their ideas into professional websites and make it easier for customers to find them online." />
        <section className="about-section about-founder-section section-padding" id="about">
          <div className="about-founder-visual">
            <div className="about-founder-orbit about-founder-orbit-one" />
            <div className="about-founder-orbit about-founder-orbit-two" />
            <div className="about-founder-monogram">H<span>.</span></div>
            <div className="about-founder-caption"><span className="about-founder-live-dot" /> INDEPENDENT WEB DEVELOPER</div>
            <div className="about-founder-side-note">IDEAS INTO<br /><strong>ONLINE EXPERIENCES</strong></div>
          </div>
          <div className="about-content about-founder-copy">
            <span className="section-label">HELLO, I'M HEZRON OKOTH</span>
            <h2>I build digital experiences that help businesses <span>move forward.</span></h2>
            <p>
              I created Masters Tech around a simple idea: every business deserves
              a professional online presence that explains what it offers, builds
              confidence and makes it easy for customers to take the next step.
            </p>
            <p>
              I enjoy turning ideas into clean, useful and responsive websites.
              From planning the layout and designing the experience to building
              the pages and making sure they work across phones, tablets and
              computers, I focus on the details that make a website feel complete.
            </p>
            <p>
              I believe in clear communication, practical solutions and taking
              time to understand what each business is trying to achieve. You
              work directly with me, so your ideas and feedback stay part of the
              process from beginning to end.
            </p>
            <a className="text-link" href={whatsappLink} target="_blank" rel="noreferrer">Let's talk about your idea <span>↗</span></a>
          </div>
        </section>

        <section className="about-services-section section-padding">
          <div className="about-section-heading">
            <span className="section-label">WHAT MASTERS TECH DOES</span>
            <h2>More than a website. <span>A better way to show up online.</span></h2>
            <p>I focus on the essential digital tools that help customers understand your business, trust what they see and find you when they search.</p>
          </div>
          <div className="about-service-grid">
            <article className="about-service-card">
              <span className="about-service-number">01 / BUILD</span>
              <div className="about-service-icon">⌘</div>
              <h3>Website design & development</h3>
              <p>Professional, mobile-friendly websites shaped around your business, your customers and the services you provide.</p>
              <ul><li>Business and company websites</li><li>Landing pages and redesigns</li><li>Clear pages that guide visitors to contact you</li></ul>
            </article>
            <article className="about-service-card about-service-card-featured">
              <span className="about-service-number">02 / GET FOUND</span>
              <div className="about-service-icon">↗</div>
              <h3>SEO & Google visibility</h3>
              <p>Practical improvements that help search engines understand your website and help potential customers discover your business.</p>
              <ul><li>Search-friendly page structure and content</li><li>On-page SEO improvements</li><li>Google Business Profile and Maps visibility guidance</li></ul>
            </article>
            <article className="about-service-card">
              <span className="about-service-number">03 / IMPROVE</span>
              <div className="about-service-icon">✦</div>
              <h3>Useful digital experiences</h3>
              <p>Thoughtful details that make your website easier to use and help visitors move from browsing to making an enquiry.</p>
              <ul><li>Responsive layouts for different screens</li><li>Simple navigation and clear calls to action</li><li>Performance and usability improvements</li></ul>
            </article>
          </div>
        </section>

        <section className="about-process-section section-padding">
          <div className="about-process-intro">
            <span className="section-label">HOW I WORK</span>
            <h2>Clear steps. <span>Careful work.</span></h2>
            <p>No confusing technical talk. I'll keep you involved and explain what we're building at every stage.</p>
          </div>
          <div className="about-process-list">
            <div><span>01</span><section><h3>We understand your business</h3><p>We discuss your goals, audience, services and what you want your website to achieve.</p></section></div>
            <div><span>02</span><section><h3>Plan, design and build</h3><p>I shape the structure and visual direction, then build a responsive website around your needs.</p></section></div>
            <div><span>03</span><section><h3>Prepare you for online visibility</h3><p>I apply search-friendly foundations and help you take practical steps towards being found on Google.</p></section></div>
          </div>
        </section>

        <section className="about-final-cta section-padding">
          <div><span className="section-label">HAVE A PROJECT IN MIND?</span><h2>Let's make your business <span>stand out online.</span></h2><p>Tell me what you're working on. We can talk through your idea and the right next step.</p></div>
          <div className="about-final-actions"><a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">Start a WhatsApp chat <span>↗</span></a><a className="button-secondary" href="/sample-sites">Explore website designs <span>→</span></a></div>
        </section>
      </>
    ),
    '/services': (
      <>
        <PageIntro
          label="HOW I CAN HELP YOUR BUSINESS"
          title={<>Let's make it easier for customers to <span>find and choose you.</span></>}
          description="Whether you need a website for a new idea or want more people to discover your existing business online, you're in the right place. Explore what I can help you with, then let's talk about what makes sense for your goals."
        />
        <section className="services-section section-padding" id="services">
          <div className="section-heading">
            <div>
              <span className="section-label">WHAT I CAN HELP WITH</span>
              <h2>Simple digital solutions. <span>Made for real businesses.</span></h2>
            </div>
            <p>
              You don't need to understand all the technical details. Start with
              what you want your business to achieve, and we can work out the
              right approach together.
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
                <div className="service-outcome">{service.outcome}</div>
                <span className="service-includes-label">WHAT WE CAN WORK ON</span>
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
                  Let's discuss this <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="services-journey-section section-padding">
          <div className="services-journey-heading">
            <span className="section-label">A FRIENDLY, STRAIGHTFORWARD PROCESS</span>
            <h2>From your first idea to <span>something people can use.</span></h2>
            <p>
              Every business is different, so I take time to understand what
              you need before suggesting a solution. Here's what getting started
              together can look like.
            </p>
          </div>
          <div className="services-journey-grid">
            <article>
              <span>01</span>
              <h3>Tell me about your business</h3>
              <p>Share what you do, who you want to reach and what you would like your website or online presence to achieve. You can come with a clear plan or just a starting idea.</p>
            </article>
            <article>
              <span>02</span>
              <h3>We plan the right solution</h3>
              <p>We'll talk through the pages, features and style that make sense for your goals. I'll explain the options in simple language so you know what to expect.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Build, review and improve</h3>
              <p>I'll work on the agreed solution, share progress and make room for your feedback. The aim is to give your business a useful online presence you feel comfortable sharing.</p>
            </article>
          </div>
        </section>

        <section className="services-help-section section-padding">
          <div>
            <span className="section-label">NOT SURE WHERE TO START?</span>
            <h2>That's completely <span>okay.</span></h2>
            <p>
              You don't have to choose a service before reaching out. Maybe you
              need a website, maybe you want more people to find your business
              on Google, or maybe you're still figuring out the idea. Tell me a
              little about it and we'll take it one step at a time.
            </p>
          </div>
          <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
            Tell me what you have in mind <span>↗</span>
          </a>
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
          <div className="sample-sites-tabs" role="tablist" aria-label="Website design collections">
            <button type="button" role="tab" aria-selected={activeSampleTab === 'samples'} className={activeSampleTab === 'samples' ? 'active' : ''} onClick={() => setActiveSampleTab('samples')}>Our sample sites</button>
            <button type="button" role="tab" aria-selected={activeSampleTab === 'inspiration'} className={activeSampleTab === 'inspiration' ? 'active' : ''} onClick={() => setActiveSampleTab('inspiration')}>Explore more UIs <span>15 designs</span></button>
          </div>
          {activeSampleTab === 'samples' ? (
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
          ) : (
            <div className="ui-inspiration-grid">
              {uiInspiration.map((item) => (
                <article className="ui-inspiration-card" key={item.title}>
                  <a className="ui-inspiration-image" href={item.source} target="_blank" rel="noreferrer" aria-label={`Open original source for ${item.title}`}>
                    <img src={item.image} alt={`${item.title} interface design example`} loading="lazy" referrerPolicy="no-referrer" />
                    <span>View source ↗</span>
                  </a>
                  <div className="ui-inspiration-info">
                    <small>{item.type}</small>
                    <h3>{item.title}</h3>
                    <p>Image reference: {item.credit}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="sample-sites-note">The Explore more UIs gallery displays externally sourced design inspiration. Images remain hosted by their original publishers and belong to their respective creators. Select an image to visit its source. Use these examples as inspiration for a custom design, not as finished Masters Tech projects.</p>
          <p className="sample-sites-note">Our sample-site concepts above are starting points, not live websites or completed client projects. Your final website can be customised to your content, brand and requirements.</p>
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
