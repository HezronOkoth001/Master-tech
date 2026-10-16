
import { useState } from 'react'

const emptyProject = {
  name: '',
  category: 'Website Development',
  description: '',
  website: '',
  status: 'Completed',
}

function AdminProjects({ projects, setProjects }) {
  const [form, setForm] = useState(emptyProject)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  function saveProject(event) {
    event.preventDefault()

    const project = {
      ...form,
      id: editingId ?? Date.now(),
    }

    if (editingId !== null) {
      setProjects((previous) =>
        previous.map((item) =>
          item.id === editingId ? project : item
        )
      )
    } else {
      setProjects((previous) => [project, ...previous])
    }

    resetForm()
  }

  function editProject(project) {
    setForm({
      name: project.name,
      category: project.category,
      description: project.description,
      website: project.website,
      status: project.status,
    })

    setEditingId(project.id)
    setFormOpen(true)
  }

  function deleteProject(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmed) return

    setProjects((previous) =>
      previous.filter((project) => project.id !== id)
    )
  }

  function resetForm() {
    setForm(emptyProject)
    setEditingId(null)
    setFormOpen(false)
  }

  return (
    <div className="projects-management">
      <div className="projects-toolbar">
        <div>
          <h2>Portfolio projects</h2>
          <p>Add and manage the projects displayed in your workspace.</p>
        </div>

        <button
          className="admin-view-site"
          onClick={() => {
            if (formOpen) {
              resetForm()
            } else {
              setForm(emptyProject)
              setEditingId(null)
              setFormOpen(true)
            }
          }}
        >
          {formOpen ? 'Cancel' : '+ Add project'}
        </button>
      </div>

      {formOpen && (
        <form className="project-form admin-panel" onSubmit={saveProject}>
          <h3>{editingId !== null ? 'Edit project' : 'Add a new project'}</h3>

          <label>
            Project name *
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Business Website"
              required
              maxLength={100}
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={updateField}
            >
              <option>Website Development</option>
              <option>Website Security</option>
              <option>SEO & Online Visibility</option>
              <option>Web Application</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Description *
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Explain what you built and what it does."
              required
              rows={4}
              maxLength={1000}
            />
          </label>

          <label>
            Website URL (optional)
            <input
              name="website"
              type="url"
              value={form.website}
              onChange={updateField}
              placeholder="https://example.com"
            />
          </label>

          <label>
            Project status
            <select
              name="status"
              value={form.status}
              onChange={updateField}
            >
              <option>Completed</option>
              <option>In progress</option>
              <option>Demo</option>
            </select>
          </label>

          <div className="project-form-actions">
            <button className="admin-view-site" type="submit">
              {editingId !== null ? 'Save changes' : 'Save project'}
            </button>

            <button
              className="project-cancel-button"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="projects-count">
        <strong>{projects.length}</strong>
        <span>{projects.length === 1 ? 'project saved' : 'projects saved'}</span>
      </div>

      {projects.length === 0 ? (
        <div className="admin-panel projects-empty">
          <span>▤</span>
          <h3>No projects added yet</h3>
          <p>
            Add your first project to start organizing your portfolio.
          </p>
          <button
            className="admin-view-site"
            onClick={() => setFormOpen(true)}
          >
            + Add your first project
          </button>
        </div>
      ) : (
        <div className="managed-projects-grid">
          {projects.map((project) => (
            <article className="admin-panel managed-project-card" key={project.id}>
              <div className="managed-project-top">
                <span className="admin-project-symbol">
                  {project.name.charAt(0).toUpperCase()}
                </span>

                <span className="managed-project-status">
                  {project.status}
                </span>
              </div>

              <span className="managed-project-category">
                {project.category}
              </span>

              <h3>{project.name}</h3>
              <p>{project.description}</p>

              {project.website && (
                <a
                  className="managed-project-link"
                  href={project.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit website ↗
                </a>
              )}

              <div className="managed-project-actions">
                <button onClick={() => editProject(project)}>
                  Edit
                </button>

                <button
                  className="managed-delete-button"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminProjects
