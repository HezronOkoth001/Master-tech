
import './AdminDashboard.css'
import AdminProjects from './AdminProjects'
import AdminWorkspaceSections from './AdminWorkspaceSections'
import { useEffect, useState } from 'react'

const WORKSPACE_STORAGE_KEY = 'masters-tech-workspace'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_URL = `${API_BASE_URL}/api/projects`
const WORKSPACE_API_URL = `${API_BASE_URL}/api/workspace`

const emptyWorkspaceData = {
  Clients: [],
  Leads: [],
  Tasks: [],
  Invoices: [],
  Payments: [],
  Messages: [],
  Reviews: [],
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
              onChange={(records) => updateWorkspaceSection(activePage, records)}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
