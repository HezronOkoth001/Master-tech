import { useEffect, useState } from 'react'
import './AdminDashboard.css'
import AdminProjects from './AdminProjects'

const PROJECTS_STORAGE_KEY = 'masters-tech-projects'

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
  { name: 'Settings', icon: '⚙' },
]

const starterProjects = [
  {
    id: 'business-website-concept',
    name: 'Business Website Concept',
    category: 'Website Development',
    description: 'A demonstration business website project.',
    website: '',
    status: 'Demo',
  },
  {
    id: 'website-security-concept',
    name: 'Website Security Concept',
    category: 'Website Security',
    description: 'A demonstration website security project.',
    website: '',
    status: 'Demo',
  },
  {
    id: 'master-kenyan-sign-language',
    name: 'Master Kenyan Sign Language',
    category: 'Web Application',
    description: 'A learning platform for Kenyan Sign Language resources.',
    website: 'https://master-kenyan-sign-language-x4v8y7m-netwe.vercel.app/',
    status: 'Completed',
  },
]

function loadProjects() {
  try {
    const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (savedProjects === null) return starterProjects

    const parsedProjects = JSON.parse(savedProjects)
    return Array.isArray(parsedProjects) ? parsedProjects : starterProjects
  } catch {
    return starterProjects
  }
}

function AdminDashboard() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [projects, setProjects] = useState(loadProjects)

  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

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
                  <strong>00</strong>
                  <small>Client records</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Open leads</span>
                    <span className="admin-stat-icon">◎</span>
                  </div>
                  <strong>00</strong>
                  <small>Potential customers</small>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Pending tasks</span>
                    <span className="admin-stat-icon">✓</span>
                  </div>
                  <strong>00</strong>
                  <small>Tasks to complete</small>
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

                  {projects.length > 0 ? projects.slice(0, 3).map((project) => (
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
                </section>
              </div>

              <div className="admin-notice">
                <span className="notice-icon">i</span>
                <div>
                  <strong>Dashboard preview</strong>
                  <p>
                    Project records are saved in this browser.
                    Other workspace records use demonstration data.
                  </p>
                </div>
              </div>
            </>
          ) : activePage === 'Projects' ? (
            <AdminProjects projects={projects} setProjects={setProjects} />
          ) : (
            <section className="admin-panel admin-placeholder">
              <span className="placeholder-icon">✳</span>
              <h2>{activePage} management</h2>
              <p>
                This section is ready for its next development stage.
                We'll add its forms, tables, and actions step by step.
              </p>

              <button
                className="admin-view-site"
                onClick={() => setActivePage('Dashboard')}
              >
                Return to dashboard
              </button>
            </section>
          )}
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
