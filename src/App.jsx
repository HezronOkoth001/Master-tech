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
  {
    number: '03',
    title: 'Website Maintenance & Support',
    description: 'A website needs care even after it goes live. I can help keep your website running smoothly, fix issues when something stops working and make updates as your business changes.',
    outcome: 'From small corrections to regular check-ups, maintenance helps keep your website useful, up to date and working as expected.',
    features: ['Fixing broken pages, links and contact forms', 'Updating website content, images and details', 'Checking website performance and functionality', 'Software updates and backup checks'],
    icon: '⚙',
  },
  {
    number: '04',
    title: 'Website Security Assessment',
    description: 'I review your website for common security weaknesses that could put your site or its information at risk. The aim is to identify issues early and help strengthen the areas that need attention.',
    outcome: 'You get a clearer picture of your website’s security and practical steps that can help reduce the risk of unauthorised access and common attacks.',
    features: ['Checking for common website vulnerabilities', 'Reviewing login access and account protection', 'Identifying outdated software and components', 'Checking basic website security settings and HTTPS'],
    icon: '⌑',
  },
]

function PublicReviewForm() {
  const [form, setForm] = useState({ customer: '', rating: '5', project: '', review: '' })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

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

function PublicReviewsShowcase() {
  const [approvedReviews, setApprovedReviews] = useState([])

  useEffect(() => {
    let active = true
    fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/public/reviews')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (active && Array.isArray(data)) setApprovedReviews(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <section className="reviews-section section-padding" id="customer-feedback">
      <div className="section-heading">
        <div>
          <span className="section-label">CUSTOMER FEEDBACK</span>
          <h2>Experiences worth <span>sharing.</span></h2>
        </div>
        <p>Real feedback from customers who have worked with Masters Tech.</p>
      </div>
      {approvedReviews.length > 0 ? (
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
      ) : (
        <div className="reviews-empty-state">
          <span>★ ★ ★ ★ ★</span>
          <strong>Customer experiences will appear here.</strong>
          <p>Once a submitted review is approved, it will be displayed here for visitors to read.</p>
        </div>
      )}
      <div className="reviews-showcase-action">
        <a className="text-link" href="/reviews">Share your experience <span>↗</span></a>
      </div>
    </section>
  )
}

function QuotationRequestPage() {
  const [form, setForm] = useState({
    name: '',
    business: '',
    service: 'Website design & development',
    website: 'I do not have a website yet',
    budget: 'Not sure yet — I would like guidance',
    timeline: 'As soon as possible',
    details: '',
  })

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function sendRequest(event) {
    event.preventDefault()
    const message = [
      'Hello Masters Tech! I would like to request a quotation.',
      '',
      'MY DETAILS',
      'Name: ' + form.name,
      'Business: ' + (form.business.trim() || 'Not provided'),
      '',
      'PROJECT DETAILS',
      'Service needed: ' + form.service,
      'Current website: ' + form.website,
      'Estimated budget: ' + form.budget,
      'Preferred timeline: ' + form.timeline,
      'What I have in mind: ' + form.details,
      '',
      'Please let me know the next steps. Thank you.',
    ].join('\n')
    window.open('https://wa.me/254700806728?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="quotation-page section-padding">
      <div className="quotation-page-heading">
        <span className="section-label">LET'S TALK ABOUT YOUR PROJECT</span>
        <h1>Tell us what <span>you have in mind.</span></h1>
        <p>Answer a few short questions so we can understand what you need before we talk about a quotation. Your answers will be prepared in a WhatsApp message for you to review and send.</p>
      </div>
      <form className="quotation-form" onSubmit={sendRequest}>
        <div className="quotation-form-progress"><span>PROJECT ENQUIRY</span><span>ABOUT 2 MINUTES</span></div>
        <div className="quotation-form-grid">
          <label>
            Your name <span>*</span>
            <input name="name" value={form.name} onChange={updateField} required minLength={2} maxLength={100} placeholder="e.g. Jane Wanjiku" />
          </label>
          <label>
            Business or organisation name
            <input name="business" value={form.business} onChange={updateField} maxLength={120} placeholder="Your business name (if any)" />
          </label>
          <label>
            What service are you interested in? <span>*</span>
            <select name="service" value={form.service} onChange={updateField} required>
              <option>Website design & development</option>
              <option>Online store / e-commerce website</option>
              <option>SEO & Google visibility</option>
              <option>Website maintenance & support</option>
              <option>Website security assessment</option>
              <option>Custom web application / business system</option>
              <option>Not sure — I need advice</option>
            </select>
          </label>
          <label>
            Do you currently have a website?
            <select name="website" value={form.website} onChange={updateField}>
              <option>I do not have a website yet</option>
              <option>Yes, I have a website and want to improve it</option>
              <option>Yes, but it needs fixing or maintenance</option>
              <option>I have a website idea but have not started</option>
            </select>
          </label>
          <label>
            Do you have an estimated budget?
            <select name="budget" value={form.budget} onChange={updateField}>
              <option>Not sure yet — I would like guidance</option>
              <option>Below KES 10,000</option>
              <option>KES 10,000 – 25,000</option>
              <option>KES 25,000 – 50,000</option>
              <option>KES 50,000 – 100,000</option>
              <option>Above KES 100,000</option>
            </select>
          </label>
          <label>
            When would you like to get started?
            <select name="timeline" value={form.timeline} onChange={updateField}>
              <option>As soon as possible</option>
              <option>Within 2–4 weeks</option>
              <option>Within 1–3 months</option>
              <option>Just planning / exploring options</option>
            </select>
          </label>
          <label className="quotation-form-wide">
            Tell us a little about what you want <span>*</span>
            <textarea name="details" value={form.details} onChange={updateField} required minLength={10} maxLength={2000} rows={6} placeholder="What does your business do? What should the website or service help you achieve? You can mention features you have in mind, examples you like, or any questions..." />
            <small>A few sentences are enough. You can share more details later on WhatsApp.</small>
          </label>
        </div>
        <div className="quotation-form-footer">
          <p>Your answers are not submitted to a database. They will be placed in a WhatsApp message that you can review and send.</p>
          <button className="button-primary quotation-submit" type="submit">Continue to WhatsApp <span>↗</span></button>
        </div>
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
        <a href="/"><span className="nav-link-icon" aria-hidden="true">🏠</span><span>Home</span></a>
        <a href="/about"><span className="nav-link-icon" aria-hidden="true">👋</span><span>About</span></a>
        <a href="/services"><span className="nav-link-icon" aria-hidden="true">🛠️</span><span>Services</span></a>
        <a href="/sample-sites"><span className="nav-link-icon" aria-hidden="true">🖥️</span><span>Samples</span></a>
        <a className="nav-review-link" href="/reviews"><span className="nav-link-icon" aria-hidden="true">⭐</span><span>Reviews</span></a>
        <a href="/contact"><span className="nav-link-icon" aria-hidden="true">📩</span><span>Contact</span></a>
      </nav>
      <a className="nav-cta" href="/quotation">Get a quotation <span>↗</span></a>
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

const technologyItems = [
  { mark: '◈', name: 'Docker', detail: 'Containers' },
  { mark: 'aws', name: 'AWS', detail: 'Cloud platform' },
  { mark: '▰', name: 'Azure', detail: 'Cloud platform' },
  { mark: '●', name: 'Android', detail: 'Mobile platform' },
  { mark: '◎', name: 'iOS', detail: 'Mobile platform' },
  { mark: '⚛', name: 'React', detail: 'Web interface' },
  { mark: 'JS', name: 'JavaScript', detail: 'Development' },
  { mark: 'TS', name: 'TypeScript', detail: 'Development' },
  { mark: 'Py', name: 'Python', detail: 'Development' },
  { mark: '◉', name: 'PostgreSQL', detail: 'Database' },
  { mark: 'API', name: 'FastAPI', detail: 'Backend' },
  { mark: '⑂', name: 'Git', detail: 'Version control' },
]

function TechMarquee() {
  return (
    <section className="tech-marquee-section" aria-label="Tools and technology platforms">
      <div className="tech-marquee-heading">
        <span className="section-label">TOOLS & TECHNOLOGY</span>
        <p>Modern tools behind thoughtful digital experiences.</p>
      </div>
      <div className="tech-marquee-window">
        <div className="tech-marquee-track">
          {[0, 1].map((copy) => (
            <div className="tech-marquee-group" key={copy} aria-hidden={copy === 1}>
              {technologyItems.map((item) => (
                <div className="tech-marquee-item" key={item.name}>
                  <span className="tech-marquee-mark">{item.mark}</span>
                  <span className="tech-marquee-name">{item.name}</span>
                  <span className="tech-marquee-detail">{item.detail}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="tech-marquee-edge" aria-hidden="true"><span>BUILT WITH PURPOSE</span><i /></div>
    </section>
  )
}

function HomeServicesSection({ whatsappLink }) {
  const highlights = [
    {
      number: '01',
      tag: 'PLAN · DESIGN · BUILD',
      title: 'Websites made to move your business forward.',
      description: 'A professional online home that explains what you offer, looks great on every screen and makes it simple for customers to get in touch.',
      points: ['Business websites and landing pages', 'Online stores and tailored layouts', 'Responsive design and clear user journeys'],
      visual: 'home-service-visual-web',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Website analytics and business website displayed on a laptop',
      visualLabel: 'YOUR BUSINESS, ONLINE',
      visualTitle: 'A better first impression.',
      visualNote: 'Designed around your brand',
      action: 'Explore website designs',
      href: '/sample-sites',
    },
    {
      number: '02',
      tag: 'BE FOUND · GET DISCOVERED',
      title: 'Help the right people find you on Google.',
      description: 'Make it easier for potential customers to discover your business with useful content and a search-friendly website structure.',
      points: ['Search engine optimisation foundations', 'Google Business Profile guidance', 'Google Search and Maps visibility'],
      visual: 'home-service-visual-search',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Search and website performance analytics on a computer screen',
      visualLabel: 'GOOGLE VISIBILITY',
      visualTitle: 'Make your business easier to find.',
      visualNote: 'Useful information. Clear structure.',
      action: 'Explore SEO services',
      href: '/services',
    },
    {
      number: '03',
      tag: 'ASSESS · PROTECT · MAINTAIN',
      title: 'Keep your website secure, healthy and up to date.',
      description: 'A website needs attention after launch too. We can review its security, check for common weaknesses, update its software and help keep important parts working as expected.',
      points: ['Website security and basic vulnerability checks', 'Software, plugin and content updates', 'Backups, performance and ongoing maintenance'],
      visual: 'home-service-visual-security',
      image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Technician working on a laptop during website maintenance',
      visualLabel: 'WEBSITE CARE',
      visualTitle: 'Stay aware. Stay up to date.',
      visualNote: 'Regular checks and maintenance',
      action: 'Ask about website care',
      href: whatsappLink,
    },
    {
      number: '04',
      tag: 'DESIGNED FOR REAL PEOPLE',
      title: 'A smooth experience on every screen.',
      description: 'Thoughtful layouts, clear navigation and practical details help visitors move around your website with confidence.',
      points: ['Mobile, tablet and desktop layouts', 'Simple navigation and readable content', 'Clear paths to contact your business'],
      visual: 'home-service-visual-experience',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Responsive website design displayed across digital devices',
      visualLabel: 'ONE WEBSITE · EVERY SCREEN',
      visualTitle: 'Comfortable to use, wherever people visit.',
      visualNote: 'Phone · Tablet · Desktop',
      action: 'Talk about your project',
      href: whatsappLink,
    },
  ]

  return (
    <section className="home-services-section section-padding" id="what-we-do">
      <div className="home-services-frame">
        <div className="home-services-frame-top">
          <span><i /> THE MASTERS TECH APPROACH</span>
          <b>DESIGN <i /> DISCOVER <i /> CONNECT</b>
        </div>
        <div className="home-services-heading">
          <div>
            <span className="section-label">WHAT WE DO</span>
            <h2>Build it well. <span>Keep it working well.</span></h2>
          </div>
          <p>From building your website and helping customers find you, to checking its security and keeping it maintained, we support your online presence beyond launch.</p>
        </div>
        <div className="home-services-grid">
          {highlights.map((item) => (
            <article className="home-service-card" key={item.number}>
              <div className="home-service-card-top">
                <span>{item.number} / {item.tag}</span>
                <i aria-hidden="true">↗</i>
              </div>
              <div className={`home-service-visual ${item.visual}`}>
                <img className="home-service-photo" src={item.image} alt={item.imageAlt} loading="lazy" />
                <div className="home-service-photo-shade" />
                <div className="home-service-visual-orbit" />
                <div className="home-service-visual-panel">
                  <small>{item.visualLabel}</small>
                  <strong>{item.visualTitle}</strong>
                  <span>{item.visualNote}</span>
                  <div className="home-service-visual-lines"><i /><i /><i /></div>
                </div>
                <b className="home-service-visual-spark" aria-hidden="true">✦</b>
              </div>
              <div className="home-service-card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul>{item.points.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul>
                <a href={item.href} target={item.href.startsWith('https://') ? '_blank' : undefined} rel={item.href.startsWith('https://') ? 'noreferrer' : undefined}>
                  {item.action}<span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="home-services-quotation">
          <div className="home-services-quotation-copy">
            <span>HAVE A PROJECT IN MIND?</span>
            <h3>Get a quotation for your project.</h3>
            <p>Tell us what you need, and let's discuss a solution that works for your business and budget.</p>
          </div>
          <a href="/quotation">Get a quotation <b>↗</b></a>
        </div>
        <div className="home-services-frame-corner" aria-hidden="true">MT<span>®</span></div>
      </div>
    </section>
  )
}

const homepageArticles = [
  {
    number: '01',
    category: 'THE DIGITAL FIRST IMPRESSION',
    title: 'Your website is often your first handshake.',
    paragraphs: [
      'Before a customer calls, visits your shop or asks for a quotation, they may search for your business online. What they find in those first few seconds can shape how they see your brand. A clear, professional website gives people a place to understand who you are, what you offer and how to take the next step.',
      'That is why good website design is about more than decoration. The words, layout, images, navigation and contact details should work together. Whether you run a growing company, a local service or a new business with a big idea, your online presence should make it easier for the right people to choose you.'
    ],
    takeaway: 'Make the first impression count.',
    link: '/sample-sites',
    linkText: 'See website design ideas',
  },
  {
    number: '02',
    category: 'BEYOND JUST BEING ONLINE',
    title: 'A good business deserves to be found.',
    paragraphs: [
      'Having a website is an important start, but customers also need a way to discover it. Search engines help people find answers, compare options and locate businesses that can solve a problem. Search-friendly website structure, useful page content and accurate business information all help make that journey clearer.',
      'For businesses serving customers in Kenya and across Africa, local visibility can matter just as much as a polished homepage. When your website and Google Business Profile communicate the right information, potential customers have a better chance of finding your services, understanding where you operate and getting in touch.'
    ],
    takeaway: 'Build your presence. Help people discover it.',
    link: '/services',
    linkText: 'Explore SEO and Google visibility',
  },
  {
    number: '03',
    category: 'DESIGNED FOR EVERYDAY CONNECTIONS',
    title: 'Your customers are already browsing on their phones.',
    paragraphs: [
      'People look up businesses while travelling, taking a break, comparing prices or asking friends for recommendations. Often, the phone in their hand is the first place they visit your website. If the text is difficult to read, pages feel crowded or the contact button is hard to find, a potential customer may simply move on.',
      'A thoughtful mobile experience keeps things straightforward. Pages should load sensibly, information should be easy to scan, and important actions should be clear on smaller screens. At Masters Tech, responsive design is part of building a website that works for real people, not just a large computer display.'
    ],
    takeaway: 'A better experience on every screen.',
    link: '/contact',
    linkText: 'Talk about your website',
  },
]

function HomeEditorialSection() {
  return (
    <section className="home-editorial-section section-padding">
      <div className="home-editorial-intro">
        <span className="section-label">A FEW THINGS WORTH KNOWING</span>
        <h2>Digital growth starts with <span>being understood.</span></h2>
        <p>
          The online world can feel crowded. We believe a business does not need
          louder marketing or complicated language to stand out. It needs a clear
          message, a useful website and a simple way for customers to connect.
        </p>
        <div className="home-editorial-manifesto">
          <span>OUR POINT OF VIEW</span>
          <strong>Built for African ambition. Designed to reach further.</strong>
          <p>
            From a new idea taking shape in Nairobi to an established business
            serving customers across the continent, every brand deserves an online
            presence that reflects the care behind its work.
          </p>
        </div>
      </div>
      <div className="home-editorial-articles">
        {homepageArticles.map((article) => (
          <article className="home-editorial-article" key={article.number}>
            <div className="home-editorial-article-meta">
              <span>{article.category}</span>
              <b>{article.number}</b>
            </div>
            <h3>{article.title}</h3>
            {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="home-editorial-takeaway"><i>✦</i><strong>{article.takeaway}</strong></div>
            <a href={article.link}>{article.linkText}<span>↗</span></a>
          </article>
        ))}
      </div>
      <div className="home-editorial-closing">
        <span>GOOD WORK DESERVES A GOOD ONLINE HOME.</span>
        <p>Let's build something that gives people a reason to remember your business.</p>
      </div>
    </section>
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
      '/': ['Masters Tech | Website Development & SEO', 'Masters Tech helps businesses build professional websites and grow online visibility through SEO and Google Maps.'],
      '/about': ['About Hezron Okoth | Masters Tech Website Development & SEO', 'Meet Hezron Okoth, the person behind Masters Tech. Learn about professional website development, SEO and Google visibility services for businesses.'],
      '/services': ['Website Design, Development & SEO Services | Masters Tech', 'Explore Masters Tech website design and development, search engine optimisation, and Google visibility services for businesses.'],
      '/sample-sites': ['Website Design Samples & UI Ideas | Masters Tech', 'Explore sample website designs for business websites, online shops, restaurants, education, property listings and booking platforms. Choose a style for your next website.'],
      '/contact': ['Contact Masters Tech | Request a Website or SEO Service', 'Contact Masters Tech to discuss a business website, SEO, Google Maps visibility or a custom web project.'],\n      '/quotation': ['Request a Quotation | Masters Tech', 'Tell Masters Tech about your website, SEO or digital project and request a quotation.'],
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
    const revealTargets = document.querySelectorAll(
      '.hero-content, .hero-ui-stage, .home-services-heading, .home-service-card, .home-services-quotation, .home-editorial-section, .home-discovery, .tech-marquee'
    )
    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('mt-is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mt-is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' })
    revealTargets.forEach((element, index) => {
      element.classList.add('mt-scroll-reveal')
      element.style.setProperty('--mt-reveal-delay', `${Math.min(index % 4, 3) * 90}ms`)
      observer.observe(element)
    })
    return () => observer.disconnect()
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

  const pageContent = {\n    '/quotation': <QuotationRequestPage />, 
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
              <a className="promotion-claim-button" href={'https://wa.me/254700806728?text=' + encodeURIComponent(`Hello Masters Tech, I saw your ${promotion.discountPercent}% promotion and would like to claim the offer.`)} target="_blank" rel="noreferrer">Claim your offer</a>
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
                Get a quotation <span>↗</span>
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

          <div className="hero-visual hero-ui-stage" aria-label="MacBook-style laptop displaying a futuristic website, surrounded by floating interface cards">
            <div className="showcase-aura" />
            <div className="hero-orbit-ring" aria-hidden="true" />
            <div className="orbit-ui-card orbit-ui-card-top">
              <span className="orbit-ui-icon">⌘</span>
              <span><b>DESIGN SYSTEM</b><small>Clean · Responsive</small></span>
            </div>
            <div className="orbit-ui-card orbit-ui-card-right">
              <span className="orbit-ui-icon">↗</span>
              <span><b>LIVE ANALYTICS</b><small>Growth overview</small></span>
              <i className="orbit-sparkline"><i /><i /><i /><i /><i /><i /></i>
            </div>
            <div className="orbit-ui-card orbit-ui-card-left">
              <span className="orbit-ui-icon">◎</span>
              <span><b>SEO INSIGHTS</b><small>Search visibility</small></span>
            </div>
            <div className="orbit-ui-card orbit-ui-card-bottom">
              <span className="orbit-ui-icon">✦</span>
              <span><b>BUILT FOR PEOPLE</b><small>Every screen, every time</small></span>
            </div>
            <div className="hero-laptop">
              <div className="laptop-screen">
                <div className="macbook-camera" />
                <div className="laptop-matrix-site">
                  <div className="matrix-site-nav">
                    <b><i>◈</i> NEXUS<span> / DIGITAL</span></b>
                    <small>PLATFORM　 SOLUTIONS　 ABOUT</small>
                    <em>LET'S TALK ↗</em>
                  </div>
                  <div className="matrix-site-main">
                    <div className="matrix-site-copy">
                      <small><i /> THE NEXT DIGITAL FRONTIER</small>
                      <h3>Build beyond<br /><span>the ordinary.</span></h3>
                      <p>Intelligent digital experiences for a connected world.</p>
                      <b>EXPLORE THE PLATFORM <i>↗</i></b>
                    </div>
                    <div className="matrix-site-visual" aria-hidden="true">
                      <div className="matrix-visual-orbit matrix-visual-orbit-one" />
                      <div className="matrix-visual-orbit matrix-visual-orbit-two" />
                      <div className="matrix-visual-core">N<span>+</span></div>
                      <i className="matrix-node matrix-node-one" />
                      <i className="matrix-node matrix-node-two" />
                      <i className="matrix-node matrix-node-three" />
                    </div>
                  </div>
                  <div className="matrix-site-footer">
                    <span><i>01</i> DIGITAL STRATEGY</span>
                    <span><i>02</i> CREATIVE TECHNOLOGY</span>
                    <span><i>03</i> CONNECTED EXPERIENCES</span>
                  </div>
                </div>
              </div>
              <div className="laptop-base macbook-base"><span className="macbook-notch" /></div>
            </div>
          </div>
        </section>
<section className="trust-strip">
          <span>WHAT WE HELP YOU DO</span>
          <div><i>✳</i> Build a professional online presence</div>
          <div><i>✳</i> Build trust with a professional website</div>
          <div><i>✳</i> Reach more potential customers</div>
        </section>
        <TechMarquee />
        <HomeServicesSection whatsappLink={whatsappLink} />
        <HomeEditorialSection />
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
        <PublicReviewsShowcase />
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
        <PageIntro label="CONTACT MASTERS TECH" title={<>Let's discuss your <span>next project.</span></>} description="Need a business website, a website refresh or help getting found on Google? Get in touch and tell me what your business needs." />
        <section className="contact-section section-padding" id="contact">
          <span className="section-label">HAVE A PROJECT IN MIND?</span>
          <h2>Let's build something <span>that works for you.</span></h2>
          <p>WhatsApp is the quickest way to reach me. You can also email me or connect through my social profiles.</p>
          <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
            Chat with Masters Tech on WhatsApp <span>↗</span>
          </a>
        </section>
        <section className="contact-details section-padding">
          <div className="contact-primary-method">
            <span className="section-label">MAIN CONTACT</span>
            <h2>Let's talk on WhatsApp</h2>
            <p>For questions, project ideas and enquiries, send me a message directly. I usually recommend WhatsApp for the quickest conversation.</p>
            <a className="button-primary" href={whatsappLink} target="_blank" rel="noreferrer">Chat on WhatsApp <span>↗</span></a>
          </div>
          <div className="contact-other-methods">
            <span className="section-label">OTHER WAYS TO REACH ME</span>
            <h2>Email & social media</h2>
            <p>Prefer email, or want to follow my work and updates? Find me here.</p>
            <a className="contact-method-link" href="mailto:orichohezron@gmail.com"><span className="contact-method-icon brand-icon gmail-icon" aria-hidden="true"><svg viewBox="0 0 48 36" role="img"><path fill="#4285F4" d="M4 34V7l6 4v23z"/><path fill="#34A853" d="M38 34V11l6-4v27z"/><path fill="#EA4335" d="M4 7l6-5 14 11L38 2l6 5-20 16z"/><path fill="#C5221F" d="M4 7l6 4v8l-6-5z"/><path fill="#FBBC04" d="M38 11l6-4v7l-6 5z"/></svg></span><span><small>EMAIL</small><strong>orichohezron@gmail.com</strong></span><b aria-hidden="true">↗</b></a>
            <a className="contact-method-link" href="https://www.instagram.com/hezron.oricho/" target="_blank" rel="noopener noreferrer"><span className="contact-method-icon brand-icon instagram-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><defs><linearGradient id="instagramBrandGradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FFDC80"/><stop offset=".45" stopColor="#F77737"/><stop offset=".72" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/></linearGradient></defs><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="url(#instagramBrandGradient)" strokeWidth="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="url(#instagramBrandGradient)" strokeWidth="2.2"/><circle cx="17.5" cy="6.8" r="1.3" fill="#E1306C"/></svg></span><span><small>INSTAGRAM</small><strong>@hezron.oricho</strong></span><b aria-hidden="true">↗</b></a>
            <a className="contact-method-link" href="https://www.facebook.com/profile.php?id=61595747563710" target="_blank" rel="noopener noreferrer"><span className="contact-method-icon brand-icon facebook-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><path fill="currentColor" d="M13.5 21v-8h2.8l.4-3.1h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z"/></svg></span><span><small>FACEBOOK</small><strong>Hezron Okoth · Facebook profile</strong></span><b aria-hidden="true">↗</b></a>
            <a className="contact-method-link" href="https://www.reddit.com/user/Hezron_oricho/" target="_blank" rel="noopener noreferrer"><span className="contact-method-icon brand-icon reddit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><path fill="currentColor" d="M20.5 12.1c0-1.1-.9-2-2-2-.5 0-.9.2-1.3.5-1.2-.8-2.8-1.3-4.5-1.4l.8-3.7 2.6.6a1.7 1.7 0 1 0 .2-1.1l-3.2-.7a.6.6 0 0 0-.7.5l-1 4.4c-1.7.1-3.3.6-4.5 1.4a2 2 0 1 0-2.5 3.1 4.1 4.1 0 0 0-.1.9c0 3 3.5 5.4 7.8 5.4s7.8-2.4 7.8-5.4c0-.3 0-.6-.1-.9.5-.4.7-.9.7-1.6M9 14a1.1 1.1 0 1 1 0-2.2A1.1 1.1 0 0 1 9 14m6.3 3.1a5.1 5.1 0 0 1-6.6 0 .5.5 0 0 1 .7-.7 4 4 0 0 0 5.2 0 .5.5 0 1 1 .7.7m-.3-3.1a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2"/></svg></span><span><small>REDDIT</small><strong>u/Hezron_oricho</strong></span><b aria-hidden="true">↗</b></a>
          </div>
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
