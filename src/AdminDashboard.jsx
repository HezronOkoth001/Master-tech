
import './AdminDashboard.css'
import AdminProjects from './AdminProjects'
import AdminWorkspaceSections from './AdminWorkspaceSections'
import { useEffect, useState } from 'react'

const WORKSPACE_STORAGE_KEY = 'masters-tech-workspace'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_URL = `${API_BASE_URL}/api/projects`
const WORKSPACE_API_URL = `${API_BASE_URL}/api/workspace`

const starterPricing = [
  { id: 'price-landing', name: 'Landing page development', category: 'Website packages', price: 10000, billing: 'One-time', description: 'Home, about, services and contact sections', status: 'Active' },
  { id: 'price-basic-business', name: 'Basic business website', category: 'Website packages', price: 18000, billing: 'One-time', description: 'A small multi-page business website', status: 'Active' },
  { id: 'price-standard-business', name: 'Standard business website', category: 'Website packages', price: 25000, billing: 'One-time', description: 'A more complete business website', status: 'Active' },
  { id: 'price-advanced-business', name: 'Advanced business website', category: 'Website packages', price: 35000, billing: 'One-time', description: 'A larger website with additional functionality', status: 'Active' },
  { id: 'price-starter-shop', name: 'Starter e-commerce website', category: 'Website packages', price: 45000, billing: 'One-time', description: 'Online catalogue, cart and checkout foundation', status: 'Active' },
  { id: 'price-standard-shop', name: 'Standard e-commerce website', category: 'Website packages', price: 65000, billing: 'One-time', description: 'Online store with expanded shop management', status: 'Active' },
  { id: 'price-custom-app', name: 'Custom web application', category: 'Website packages', price: 100000, billing: 'From', description: 'Price depends on scope and requirements', status: 'Active' },
  { id: 'price-co-ke', name: '.co.ke domain registration', category: 'Domain', price: 1000, billing: 'Annual', description: 'Estimated first-year registration; confirm provider price', status: 'Active' },
  { id: 'price-com', name: '.com domain registration', category: 'Domain', price: 2000, billing: 'Annual', description: 'Estimated first-year registration; confirm provider price', status: 'Active' },
  { id: 'price-host-basic', name: 'Basic website hosting', category: 'Hosting', price: 3000, billing: 'Annual', description: 'Basic hosting budget; confirm provider plan', status: 'Active' },
  { id: 'price-host-standard', name: 'Standard website hosting', category: 'Hosting', price: 6000, billing: 'Annual', description: 'Higher hosting budget; confirm provider plan', status: 'Active' },
  { id: 'price-extra-page', name: 'Additional website page', category: 'Website features', price: 1500, billing: 'One-time', description: 'Each additional page', status: 'Active' },
  { id: 'price-contact-form', name: 'Contact form', category: 'Website features', price: 1000, billing: 'One-time', description: 'Website enquiry form', status: 'Active' },
  { id: 'price-whatsapp', name: 'WhatsApp integration', category: 'Website features', price: 500, billing: 'One-time', description: 'Click-to-chat WhatsApp button', status: 'Active' },
  { id: 'price-gallery', name: 'Image gallery', category: 'Website features', price: 1500, billing: 'One-time', description: 'Organised image gallery', status: 'Active' },
  { id: 'price-blog', name: 'Blog section', category: 'Website features', price: 2500, billing: 'One-time', description: 'Blog listing and article layout', status: 'Active' },
  { id: 'price-admin', name: 'Admin dashboard', category: 'Website features', price: 5000, billing: 'One-time', description: 'Content or records management area', status: 'Active' },
  { id: 'price-booking', name: 'Booking functionality', category: 'Website features', price: 5000, billing: 'From', description: 'Price depends on booking workflow', status: 'Active' },
  { id: 'price-maps', name: 'Google Maps integration', category: 'SEO & Google visibility', price: 1000, billing: 'One-time', description: 'Map embed and location details', status: 'Active' },
  { id: 'price-seo', name: 'Basic SEO setup', category: 'SEO & Google visibility', price: 2000, billing: 'One-time', description: 'Titles, descriptions and indexing basics', status: 'Active' },
  { id: 'price-gbp', name: 'Google Business Profile setup', category: 'SEO & Google visibility', price: 2000, billing: 'One-time', description: 'Profile setup or optimisation; client access required', status: 'Active' },
  { id: 'price-mpesa', name: 'M-Pesa payment integration', category: 'Website features', price: 8000, billing: 'From', description: 'Depends on provider, API and checkout requirements', status: 'Active' },
  { id: 'price-care-basic', name: 'Basic care plan', category: 'Maintenance plans', price: 1500, billing: 'Monthly', description: 'Basic updates and website checks', status: 'Active' },
  { id: 'price-care-standard', name: 'Standard care plan', category: 'Maintenance plans', price: 3000, billing: 'Monthly', description: 'Updates, backups and small content changes', status: 'Active' },
  { id: 'price-care-premium', name: 'Premium care plan', category: 'Maintenance plans', price: 5000, billing: 'Monthly', description: 'Priority support and more frequent maintenance', status: 'Active' },
]

const emptyWorkspaceData = {
  Clients: [],
  Leads: [],
  Tasks: [],
  Invoices: [],
  Payments: [],
  Messages: [],
  Reviews: [],
  Pricing: starterPricing,
  Settings: [{
    id: 'workspace-settings',
    businessName: 'Masters Tech',
    adminName: 'Administrator',
    email: '',
    phone: '+254700806728',
    currency: 'KES',
  }],
}

const navigation = [
  { name: 'Dashboard', icon: '▦' },
  { name: 'Projects', icon: '▤' },
  { name: 'Clients', icon: '♙' },
  { name: 'Leads', icon: '◎' },
  { name: 'Tasks', icon: '✓' },
  { name: 'Invoices', icon: '▧' },
  { name: 'Payments', icon: '↗' },
  { name: 'Messages', icon: '✉' },
  { name: 'Reviews', icon: '☆' },
  { name: 'Pricing', icon: '▣' },
  { name: 'Settings', icon: '⚙' },
]

function mapProject(project) {
  return {
    id: project.id,
    name: project.title,
    category: project.category,
    description: project.description,
    website: project.project_url || '',
    status: project.status,
  }
}

function AdminDashboard() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [workspaceData, setWorkspaceData] = useState(emptyWorkspaceData)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  const [workspaceError, setWorkspaceError] = useState('')

  useEffect(() => {
    let isActive = true

    async function fetchProjects() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Could not load projects.')

        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('Invalid projects response.')

        if (isActive) setProjects(data.map(mapProject))
      } catch {
        if (isActive) {
          setProjectsError('Projects could not be loaded from the database.')
        }
      } finally {
        if (isActive) setProjectsLoading(false)
      }
    }

    fetchProjects()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadWorkspace() {
      try {
        let legacyData = {}
        try {
          legacyData = JSON.parse(localStorage.getItem(WORKSPACE_STORAGE_KEY) || '{}')
        } catch {
          legacyData = {}
        }

        const sections = Object.keys(emptyWorkspaceData)
        const entries = await Promise.all(sections.map(async (section) => {
          const response = await fetch(`${WORKSPACE_API_URL}/${section.toLowerCase()}`)
          if (!response.ok) throw new Error(`Could not load ${section.toLowerCase()} records.`)
          let records = await response.json()

          // Import records from the previous browser-only version once, when the database section is empty.
          if (records.length === 0 && Array.isArray(legacyData[section]) && legacyData[section].length > 0) {
            const migrationResponse = await fetch(`${WORKSPACE_API_URL}/${section.toLowerCase()}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(legacyData[section]),
            })
            if (!migrationResponse.ok) throw new Error(`Could not migrate ${section.toLowerCase()} records.`)
            records = await migrationResponse.json()
          }

          if (section === 'Settings' && records.length === 0) {
            records = emptyWorkspaceData.Settings
          }
          if (section === 'Pricing' && records.length === 0) {
            records = emptyWorkspaceData.Pricing
            const seedResponse = await fetch(`${WORKSPACE_API_URL}/pricing`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(records),
            })
            if (!seedResponse.ok) throw new Error('Could not save the starter pricing catalogue.')
            records = await seedResponse.json()
          }
          return [section, records]
        }))

        if (isActive) {
          setWorkspaceData(Object.fromEntries(entries))
          // Prevent deleted legacy records from being imported again on a later refresh.
          localStorage.removeItem(WORKSPACE_STORAGE_KEY)
        }
      } catch (error) {
        if (isActive) setWorkspaceError(error.message || 'Could not load workspace records.')
      } finally {
        if (isActive) setWorkspaceLoading(false)
      }
    }

    loadWorkspace()
    return () => { isActive = false }
  }, [])

  // Refresh the review queue whenever the administrator opens the Reviews tab.
  // This prevents reviews submitted while the dashboard is already open from being missed.
  useEffect(() => {
    if (activePage !== 'Reviews' || workspaceLoading) return undefined
    let isActive = true

    async function refreshReviews() {
      try {
        const response = await fetch(`${WORKSPACE_API_URL}/reviews`)
        if (!response.ok) throw new Error('Could not refresh customer reviews.')
        const records = await response.json()
        if (isActive && Array.isArray(records)) {
          setWorkspaceData((previous) => ({ ...previous, Reviews: records }))
        }
      } catch (error) {
        if (isActive) setWorkspaceError(error.message || 'Could not refresh customer reviews.')
      }
    }

    refreshReviews()
    return () => { isActive = false }
  }, [activePage, workspaceLoading])

  async function updateWorkspaceSection(section, records) {
    const response = await fetch(`${WORKSPACE_API_URL}/${section.toLowerCase()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(records),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.detail || `Could not save ${section.toLowerCase()} records.`)
    }

    const savedRecords = await response.json()
    setWorkspaceData((previous) => ({ ...previous, [section]: savedRecords }))
    return savedRecords
  }

  const activeClients = workspaceData.Clients.filter((client) => client.status === 'Active').length
  const openLeads = workspaceData.Leads.filter((lead) => !['Won', 'Lost'].includes(lead.status)).length
  const pendingTasks = workspaceData.Tasks.filter((task) => task.status !== 'Done').length
  const pendingReviews = workspaceData.Reviews.filter((review) => review.status === 'Pending approval').length

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <span className="admin-brand-mark">M</span>
          <span>
            <strong>MASTERS</strong>
            <small>TECH ADMIN</small>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? 'admin-nav-item active'
                  : 'admin-nav-item'
              }
              onClick={() => setActivePage(item.name)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
              {activePage === item.name && (
                <span className="active-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-user-avatar">H</div>
          <div className="admin-user-info">
            <strong>Administrator</strong>
            <small>Masters Tech</small>
          </div>
          <span className="user-menu-icon">⋮</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">WORKSPACE /</span>
            <span className="admin-current-page"> {activePage}</span>
          </div>

          <div className="admin-topbar-actions">
            <span className="admin-status">
              <span /> Workspace
            </span>

            <button
              className="admin-view-site"
              onClick={() => window.open('/', '_blank')}
            >
              View website ↗
            </button>
          </div>
        </header>

        <section className="admin-content">
          {workspaceError && <div className="admin-notice" role="alert"><span className="notice-icon">!</span><div><strong>Workspace connection problem</strong><p>{workspaceError} Check that the backend is running and the database is reachable.</p></div></div>}
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">
                MASTERS TECH MANAGEMENT
              </span>

              <h1>
                {activePage === 'Dashboard'
                  ? 'Dashboard overview'
                  : activePage}
              </h1>

              <p>
                {activePage === 'Dashboard'
                  ? 'Welcome back. Here is an overview of your business workspace.'
                  : 'Manage your ' + activePage.toLowerCase() + ' from one place.'}
              </p>
            </div>

            <span className="admin-date-label">
              ADMIN WORKSPACE
            </span>
          </div>

          {activePage === 'Dashboard' ? (
            <>
              <div className="admin-stats-grid">
                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Total projects</span>
                    <span className="admin-stat-icon">▤</span>
                  </div>
                  <strong>{String(projects.length).padStart(2, '0')}</strong>
                  <small>Portfolio projects added</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Active clients</span>
                    <span className="admin-stat-icon">♙</span>
                  </div>
                  <strong>{String(activeClients).padStart(2, '0')}</strong>
                  <small>Active client records</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Open leads</span>
                    <span className="admin-stat-icon">◎</span>
                  </div>
                  <strong>{String(openLeads).padStart(2, '0')}</strong>
                  <small>Leads still being followed up</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Pending tasks</span>
                    <span className="admin-stat-icon">✓</span>
                  </div>
                  <strong>{String(pendingTasks).padStart(2, '0')}</strong>
                  <small>Tasks not yet completed</small>
                </article>
              </div>

              <div className="admin-dashboard-grid">
                <section className="admin-panel projects-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <h2>Recent projects</h2>
                      <p>Your portfolio overview</p>
                    </div>

                    <button
                      className="admin-text-button"
                      onClick={() => setActivePage('Projects')}
                    >
                      View all ↗
                    </button>
                  </div>

                  {projectsLoading ? (
                    <p>Loading projects...</p>
                  ) : projectsError ? (
                    <p role="status">{projectsError}</p>
                  ) : projects.length > 0 ? projects.slice(0, 3).map((project) => (
                    <div className="admin-project-row" key={project.id}>
                      <span className="admin-project-symbol">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="admin-project-details">
                        <strong>{project.name}</strong>
                        <small>{project.category}</small>
                      </div>
                      <span className={project.status === 'Completed'
                        ? 'admin-completed-badge'
                        : 'admin-project-badge'}>
                        {project.status}
                      </span>
                    </div>
                  )) : (
                    <p className="admin-empty-projects">No projects added yet.</p>
                  )}

                  <button
                    className="admin-add-project"
                    onClick={() => setActivePage('Projects')}
                  >
                    <span>+</span> Manage portfolio projects
                  </button>
                </section>

                <section className="admin-panel activity-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <h2>Quick actions</h2>
                      <p>Common workspace tasks</p>
                    </div>
                  </div>

                  <button
                    className="admin-quick-action"
                    onClick={() => setActivePage('Projects')}
                  >
                    <span className="quick-action-icon">+</span>
                    <span>
                      <strong>Manage projects</strong>
                      <small>Update your portfolio</small>
                    </span>
                    <span className="quick-action-arrow">↗</span>
                  </button>

                  <button
                    className="admin-quick-action"
                    onClick={() => setActivePage('Clients')}
                  >
                    <span className="quick-action-icon">♙</span>
                    <span>
                      <strong>Add a client</strong>
                      <small>Organize client records</small>
                    </span>
                    <span className="quick-action-arrow">↗</span>
                  </button>

                  <button
                    className="admin-quick-action"
                    onClick={() => setActivePage('Tasks')}
                  >
                    <span className="quick-action-icon">✓</span>
                    <span>
                      <strong>Review tasks</strong>
                      <small>Keep your work organized</small>
                    </span>
                    <span className="quick-action-arrow">↗</span>
                  </button>

                  <button
                    className="admin-quick-action admin-review-quick-action"
                    onClick={() => setActivePage('Reviews')}
                  >
                    <span className="quick-action-icon">★</span>
                    <span>
                      <strong>Manage customer reviews</strong>
                      <small>{pendingReviews > 0 ? pendingReviews + ' waiting for your approval' : 'Approve, edit or hide website reviews'}</small>
                    </span>
                    {pendingReviews > 0 && <span className="admin-review-pending-count">{pendingReviews}</span>}
                    <span className="quick-action-arrow">↗</span>
                  </button>
                </section>
              </div>

              <div className="admin-notice">
                <span className="notice-icon">i</span>
                <div>
                  <strong>Dashboard preview</strong>
                  <p>
                    Projects and workspace records are stored in PostgreSQL.
                  </p>
                </div>
              </div>
            </>
          ) : workspaceLoading ? (
            <div className="admin-panel"><p>Loading workspace records from the database...</p></div>
          ) : activePage === 'Projects' ? (
            <AdminProjects projects={projects} setProjects={setProjects} />
          ) : (
            <AdminWorkspaceSections
              section={activePage}
              records={workspaceData[activePage] || []}
              clients={workspaceData.Clients || []}
              pricing={workspaceData.Pricing || []}
              onChange={(records) => updateWorkspaceSection(activePage, records)}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
