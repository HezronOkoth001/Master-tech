import { useMemo, useState } from 'react'
import './AdminWorkspaceSections.css'

const schemas = {
  Clients: {
    title: 'Client records',
    description: 'Keep contact details and project relationships in one place.',
    fields: [
      { name: 'name', label: 'Client name', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone / WhatsApp' },
      { name: 'company', label: 'Company / organisation' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Completed'] },
    ],
    columns: ['name', 'company', 'email', 'phone', 'status'],
  },
  Leads: {
    title: 'Potential customers',
    description: 'Track enquiries and follow up with people interested in your services.',
    fields: [
      { name: 'name', label: 'Lead name', required: true },
      { name: 'service', label: 'Service interested in', type: 'select', options: ['Website Development', 'Website Security', 'SEO & Online Visibility', 'Other'] },
      { name: 'contact', label: 'Email or phone' },
      { name: 'source', label: 'Where they found you', type: 'select', options: ['WhatsApp', 'Website', 'Facebook', 'Referral', 'Other'] },
      { name: 'status', label: 'Lead status', type: 'select', options: ['New', 'Contacted', 'In discussion', 'Won', 'Lost'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: ['name', 'service', 'contact', 'source', 'status'],
  },
  Tasks: {
    title: 'Work tasks',
    description: 'Plan work, set deadlines, and track progress.',
    fields: [
      { name: 'title', label: 'Task title', required: true },
      { name: 'project', label: 'Related project' },
      { name: 'dueDate', label: 'Due date', type: 'date' },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
      { name: 'status', label: 'Task status', type: 'select', options: ['To do', 'In progress', 'Done'] },
    ],
    columns: ['title', 'project', 'dueDate', 'priority', 'status'],
  },
  Invoices: {
    title: 'Invoices',
    description: 'Record amounts owed and invoice due dates. This does not send invoices or collect money.',
    fields: [
      { name: 'invoiceNumber', label: 'Invoice number', required: true },
      { name: 'client', label: 'Client name', required: true },
      { name: 'amount', label: 'Amount (KES)', type: 'number', required: true },
      { name: 'issueDate', label: 'Issue date', type: 'date' },
      { name: 'dueDate', label: 'Due date', type: 'date' },
      { name: 'status', label: 'Invoice status', type: 'select', options: ['Draft', 'Sent', 'Partially paid', 'Paid', 'Overdue'] },
    ],
    columns: ['invoiceNumber', 'client', 'amount', 'dueDate', 'status'],
  },
  Payments: {
    title: 'Payment records',
    description: 'Record payments you have received and link them to a client or invoice.',
    fields: [
      { name: 'reference', label: 'Payment reference', required: true },
      { name: 'client', label: 'Client name' },
      { name: 'amount', label: 'Amount (KES)', type: 'number', required: true },
      { name: 'method', label: 'Payment method', type: 'select', options: ['M-Pesa', 'Bank transfer', 'Cash', 'Other'] },
      { name: 'date', label: 'Payment date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Received', 'Pending', 'Failed', 'Refunded'] },
    ],
    columns: ['reference', 'client', 'amount', 'method', 'date', 'status'],
  },
  Messages: {
    title: 'Enquiries and messages',
    description: 'Manually record enquiries received through WhatsApp, email, or your website.',
    fields: [
      { name: 'sender', label: 'Sender name', required: true },
      { name: 'contact', label: 'Contact details' },
      { name: 'channel', label: 'Channel', type: 'select', options: ['Website', 'WhatsApp', 'Email', 'Facebook', 'Other'] },
      { name: 'message', label: 'Message / enquiry', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Unread', 'Replied', 'Follow up', 'Closed'] },
    ],
    columns: ['sender', 'contact', 'channel', 'message', 'status'],
  },
  Reviews: {
    title: 'Customer reviews',
    description: 'Record customer feedback. Reviews added here are private records and are not published to the public website yet.',
    fields: [
      { name: 'customer', label: 'Customer name', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'select', options: ['1', '2', '3', '4', '5'] },
      { name: 'project', label: 'Project / service' },
      { name: 'review', label: 'Review text', type: 'textarea', required: true },
      { name: 'status', label: 'Review status', type: 'select', options: ['Pending approval', 'Approved', 'Hidden'] },
    ],
    columns: ['customer', 'rating', 'project', 'review', 'status'],
  },
  Settings: {
    title: 'Workspace settings',
    description: 'Update the basic business details used for this local admin workspace.',
    fields: [
      { name: 'businessName', label: 'Business name', required: true },
      { name: 'adminName', label: 'Administrator name', required: true },
      { name: 'email', label: 'Business email', type: 'email' },
      { name: 'phone', label: 'Business phone / WhatsApp' },
      { name: 'currency', label: 'Default currency', type: 'select', options: ['KES', 'USD', 'EUR', 'GBP'] },
    ],
    columns: ['businessName', 'adminName', 'email', 'phone', 'currency'],
    singleRecord: true,
  },
}

function emptyForm(schema) {
  return Object.fromEntries(schema.fields.map((field) => [field.name, field.name === 'currency' ? 'KES' : '']))
}

function AdminWorkspaceSections({ section, records = [], onChange }) {
  const schema = schemas[section]
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(() => emptyForm(schema))

  const visibleRecords = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return records
    return records.filter((record) => Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(term)))
  }, [records, search])

  function resetForm() {
    setForm(emptyForm(schema))
    setEditingId(null)
    setFormOpen(false)
  }

  function openNewForm() {
    setForm(schema.singleRecord && records[0] ? { ...emptyForm(schema), ...records[0] } : emptyForm(schema))
    setEditingId(schema.singleRecord && records[0] ? records[0].id : null)
    setFormOpen(true)
  }

  function saveRecord(event) {
    event.preventDefault()
    const record = { ...form, id: editingId ?? Date.now() }
    if (schema.singleRecord) {
      onChange([record])
    } else if (editingId !== null) {
      onChange(records.map((item) => item.id === editingId ? record : item))
    } else {
      onChange([record, ...records])
    }
    resetForm()
  }

  function editRecord(record) {
    setForm({ ...emptyForm(schema), ...record })
    setEditingId(record.id)
    setFormOpen(true)
  }

  function deleteRecord(record) {
    const label = record.name || record.title || record.invoiceNumber || record.reference || record.sender || record.customer || 'this record'
    if (!window.confirm('Delete ' + label + '? This cannot be undone.')) return
    onChange(records.filter((item) => item.id !== record.id))
  }

  return (
    <div className="workspace-manager">
      <div className="workspace-toolbar">
        <div>
          <h2>{schema.title}</h2>
          <p>{schema.description}</p>
        </div>
        <button className="admin-view-site" onClick={formOpen ? resetForm : openNewForm}>
          {formOpen ? 'Cancel' : schema.singleRecord && records.length ? 'Edit settings' : '+ Add ' + (section === 'Tasks' ? 'task' : section === 'Clients' ? 'client' : section === 'Leads' ? 'lead' : section === 'Invoices' ? 'invoice' : section === 'Payments' ? 'payment' : section === 'Messages' ? 'message' : section === 'Reviews' ? 'review' : 'settings')}
        </button>
      </div>

      {formOpen && (
        <form className="admin-panel workspace-form" onSubmit={saveRecord}>
          <h3>{editingId !== null ? 'Edit ' + section.toLowerCase().replace(/s$/, '') : 'Add ' + section.toLowerCase().replace(/s$/, '')}</h3>
          <div className="workspace-form-grid">
            {schema.fields.map((field) => (
              <label className={field.type === 'textarea' ? 'workspace-field workspace-field-wide' : 'workspace-field'} key={field.name}>
                {field.label}{field.required ? ' *' : ''}
                {field.type === 'select' ? (
                  <select value={form[field.name] ?? ''} onChange={(event) => setForm((old) => ({ ...old, [field.name]: event.target.value }))} required={field.required}>
                    <option value="">Select...</option>
                    {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea value={form[field.name] ?? ''} onChange={(event) => setForm((old) => ({ ...old, [field.name]: event.target.value }))} required={field.required} rows={3} maxLength={2000} />
                ) : (
                  <input type={field.type || 'text'} value={form[field.name] ?? ''} onChange={(event) => setForm((old) => ({ ...old, [field.name]: event.target.value }))} required={field.required} maxLength={field.type === 'number' ? undefined : 250} min={field.type === 'number' ? '0' : undefined} step={field.type === 'number' ? '0.01' : undefined} />
                )}
              </label>
            ))}
          </div>
          <div className="project-form-actions">
            <button className="admin-view-site" type="submit">Save {section === 'Settings' ? 'settings' : 'record'}</button>
            <button className="project-cancel-button" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="workspace-list-heading">
        <div><strong>{records.length}</strong> {records.length === 1 ? 'record' : 'records'}</div>
        {!schema.singleRecord && <input aria-label={'Search ' + section} className="workspace-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={'Search ' + section.toLowerCase() + '...'} />}
      </div>

      {visibleRecords.length === 0 ? (
        <div className="admin-panel workspace-empty">
          <span>✳</span>
          <h3>{search ? 'No matching records' : 'Nothing here yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Add a record to start managing this section.'}</p>
          {!search && <button className="admin-view-site" onClick={openNewForm}>+ Add first record</button>}
        </div>
      ) : (
        <div className="admin-panel workspace-table-wrap">
          <div className="workspace-table-scroll">
            <table className="workspace-table">
              <thead><tr>{schema.columns.map((key) => <th key={key}>{schema.fields.find((field) => field.name === key)?.label || key}</th>)}<th>Actions</th></tr></thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <tr key={record.id}>
                    {schema.columns.map((key) => <td key={key}>{key === 'rating' ? '★'.repeat(Math.max(0, Math.min(5, Number(record[key]) || 0))) : (record[key] || '—')}</td>)}
                    <td className="workspace-row-actions">
                      <button onClick={() => editRecord(record)}>Edit</button>
                      {!schema.singleRecord && <button className="managed-delete-button" onClick={() => deleteRecord(record)}>Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminWorkspaceSections
