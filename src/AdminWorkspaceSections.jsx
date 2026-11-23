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
    description: 'Manage your sales pipeline, record where enquiries came from, and schedule the next follow-up.',
    fields: [
      { name: 'name', label: 'Lead / contact name', required: true },
      { name: 'company', label: 'Company / business' },
      { name: 'contact', label: 'Email or phone', required: true },
      { name: 'service', label: 'Service interested in', type: 'select', options: ['Website Development', 'Website Security', 'SEO & Online Visibility', 'Other'] },
      { name: 'source', label: 'Enquiry source', type: 'select', options: ['WhatsApp', 'Website', 'Facebook', 'Referral', 'Phone call', 'Other'] },
      { name: 'status', label: 'Sales stage', type: 'select', options: ['New', 'Contacted', 'Qualified', 'Proposal sent', 'Negotiation', 'Won', 'Lost'] },
      { name: 'nextFollowUp', label: 'Next follow-up date', type: 'date' },
      { name: 'notes', label: 'Follow-up notes', type: 'textarea' },
    ],
    columns: ['name', 'company', 'service', 'source', 'status', 'nextFollowUp'],
  },
  Tasks: {
    title: 'Work tasks',
    description: 'Create actionable work items, assign responsibility, set deadlines, and track completion.',
    fields: [
      { name: 'title', label: 'Task title', required: true },
      { name: 'project', label: 'Related project' },
      { name: 'client', label: 'Client / business' },
      { name: 'assignedTo', label: 'Assigned to' },
      { name: 'description', label: 'What needs to be done', type: 'textarea' },
      { name: 'dueDate', label: 'Due date', type: 'date', required: true },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
      { name: 'status', label: 'Task progress', type: 'select', options: ['To do', 'In progress', 'Waiting for client', 'Blocked', 'Done'] },
    ],
    columns: ['title', 'project', 'client', 'assignedTo', 'dueDate', 'priority', 'status'],
  },
  Invoices: {
    title: 'Invoices',
    description: 'Track billing, tax, due dates, and payment progress. Saving an invoice here records it; it does not email or collect payment automatically.',
    fields: [
      { name: 'invoiceNumber', label: 'Invoice number', required: true },
      { name: 'client', label: 'Bill to (client)', required: true },
      { name: 'amount', label: 'Subtotal before tax (KES)', type: 'number', required: true },
      { name: 'taxRate', label: 'Tax rate (%)', type: 'number' },
      { name: 'issueDate', label: 'Invoice date', type: 'date', required: true },
      { name: 'dueDate', label: 'Payment due date', type: 'date', required: true },
      { name: 'status', label: 'Payment status', type: 'select', options: ['Draft', 'Issued', 'Partially paid', 'Paid', 'Overdue', 'Cancelled'] },
      { name: 'notes', label: 'Invoice notes / payment terms', type: 'textarea' },
    ],
    columns: ['invoiceNumber', 'client', 'amount', 'taxRate', 'totalAmount', 'dueDate', 'status'],
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
    description: 'Choose a saved client, prepare a message for WhatsApp or email, and keep a record of your conversations.',
    fields: [
      { name: 'recipient', label: 'Recipient name' },
      { name: 'sender', label: 'Sender name' },
      { name: 'contact', label: 'Contact details' },
      { name: 'channel', label: 'Channel', type: 'select', options: ['Website', 'WhatsApp', 'Email', 'Facebook', 'Other'] },
      { name: 'message', label: 'Message / enquiry', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Ready to send', 'Sent', 'Unread', 'Replied', 'Follow up', 'Closed'] },
    ],
    columns: ['recipient', 'sender', 'contact', 'channel', 'message', 'status'],
  },
  Reviews: {
    title: 'Customer reviews',
    description: 'Reviews submitted through the public website appear here automatically. Approve suitable reviews before publishing them.',
    fields: [
      { name: 'customer', label: 'Customer name', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'select', options: ['1', '2', '3', '4', '5'] },
      { name: 'project', label: 'Project / service' },
      { name: 'review', label: 'Review text', type: 'textarea', required: true },
      { name: 'source', label: 'Submitted from' },
      { name: 'submittedAt', label: 'Submitted at' },
      { name: 'status', label: 'Publication status', type: 'select', options: ['Pending approval', 'Approved', 'Hidden'] },
    ],
    columns: ['customer', 'rating', 'project', 'review', 'source', 'submittedAt', 'status'],
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

function AdminWorkspaceSections({ section, records = [], clients = [], onChange }) {
  const schema = schemas[section]
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(() => emptyForm(schema))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [recipientId, setRecipientId] = useState('')
  const [outgoingChannel, setOutgoingChannel] = useState('WhatsApp')
  const [outgoingMessage, setOutgoingMessage] = useState('')
  const [sending, setSending] = useState(false)

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

  async function saveRecord(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const record = { ...form, id: editingId ?? String(Date.now()) }
    if (section === 'Invoices') {
      const subtotal = Math.max(0, Number(record.amount) || 0)
      const taxRate = Math.min(100, Math.max(0, Number(record.taxRate) || 0))
      record.taxRate = String(taxRate)
      record.taxAmount = Number((subtotal * taxRate / 100).toFixed(2))
      record.totalAmount = Number((subtotal + record.taxAmount).toFixed(2))
    }
    const nextRecords = schema.singleRecord
      ? [record]
      : editingId !== null
        ? records.map((item) => String(item.id) === String(editingId) ? record : item)
        : [record, ...records]

    try {
      await onChange(nextRecords)
      resetForm()
      setMessage('Record saved to the database.')
    } catch (error) {
      setMessage(error.message || 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  function editRecord(record) {
    setForm({ ...emptyForm(schema), ...record })
    setEditingId(record.id)
    setFormOpen(true)
  }

  async function sendClientMessage(event) {
    event.preventDefault()
    const recipient = clients.find((client) => String(client.id) === String(recipientId))
    if (!recipient) {
      setMessage('Select a client before preparing a message.')
      return
    }

    const destination = outgoingChannel === 'WhatsApp' ? recipient.phone : recipient.email
    if (!destination?.trim()) {
      setMessage(outgoingChannel === 'WhatsApp'
        ? 'This client does not have a phone number. Add one in the Clients tab first.'
        : 'This client does not have an email address. Add one in the Clients tab first.')
      return
    }
    if (!outgoingMessage.trim()) {
      setMessage('Write your message before continuing.')
      return
    }

    const cleanPhone = String(destination).replace(/[^0-9]/g, '')
    if (outgoingChannel === 'WhatsApp' && cleanPhone.length < 8) {
      setMessage('The saved phone number does not look valid. Include the country code, for example 2547XXXXXXXX.')
      return
    }

    // Open a blank tab during the click event so the browser does not block it after the database save.
    const messageWindow = window.open('about:blank', '_blank')
    setSending(true)
    setMessage('')
    const logEntry = {
      id: String(Date.now()),
      recipient: recipient.name,
      contact: destination,
      channel: outgoingChannel,
      message: outgoingMessage.trim(),
      status: 'Ready to send',
      direction: 'Outgoing',
      createdAt: new Date().toISOString(),
    }

    try {
      await onChange([logEntry, ...records])
      const url = outgoingChannel === 'WhatsApp'
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(outgoingMessage.trim())}`
        : `mailto:${destination.trim()}?subject=${encodeURIComponent('Message from Masters Tech')}&body=${encodeURIComponent(outgoingMessage.trim())}`
      if (messageWindow) {
        messageWindow.location.href = url
      } else {
        setMessage('Your browser blocked the new tab. Allow pop-ups for this site and try again.')
        return
      }
      setOutgoingMessage('')
      setMessage(`Message prepared for ${recipient.name}. Complete the send in ${outgoingChannel}, then update its status to Sent here.`)
    } catch (error) {
      if (messageWindow) messageWindow.close()
      setMessage(error.message || 'Could not save the message record.')
    } finally {
      setSending(false)
    }
  }

  async function deleteRecord(record) {
    const label = record.name || record.title || record.invoiceNumber || record.reference || record.sender || record.customer || 'this record'
    if (!window.confirm('Delete ' + label + '? This cannot be undone.')) return
    setMessage('')
    try {
      await onChange(records.filter((item) => String(item.id) !== String(record.id)))
      setMessage('Record deleted from the database.')
    } catch (error) {
      setMessage(error.message || 'Could not delete this record.')
    }
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

      {section === 'Messages' && (
        <form className="admin-panel workspace-form message-composer" onSubmit={sendClientMessage}>
          <h3>Send a message to a client</h3>
          <p className="message-composer-help">Choose a saved client and a channel. The message will open in WhatsApp or your email app for you to review and send.</p>
          <div className="workspace-form-grid">
            <label className="workspace-field">
              Client
              <select value={recipientId} onChange={(event) => setRecipientId(event.target.value)} required>
                <option value="">Select a client...</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </label>
            <label className="workspace-field">
              Channel
              <select value={outgoingChannel} onChange={(event) => setOutgoingChannel(event.target.value)}>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
              </select>
            </label>
            <label className="workspace-field workspace-field-wide">
              Message
              <textarea value={outgoingMessage} onChange={(event) => setOutgoingMessage(event.target.value)} rows={4} maxLength={2000} placeholder="Write the message you want to send..." required />
            </label>
          </div>
          {clients.length === 0 && <p className="message-composer-help">There are no saved clients yet. Add a client with a phone number or email address in the Clients tab first.</p>}
          <div className="project-form-actions">
            <button className="admin-view-site" type="submit" disabled={sending || clients.length === 0}>{sending ? 'Preparing...' : outgoingChannel === 'WhatsApp' ? 'Open WhatsApp' : 'Open email'}</button>
          </div>
        </form>
      )}

      {message && <p role="status" aria-live="polite">{message}</p>}

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
                  <input type={field.type || 'text'} value={form[field.name] ?? ''} onChange={(event) => setForm((old) => ({ ...old, [field.name]: event.target.value }))} required={field.required} maxLength={field.type === 'number' ? undefined : 250} min={field.type === 'number' ? '0' : undefined} max={field.name === 'taxRate' ? '100' : undefined} step={field.type === 'number' ? '0.01' : undefined} />
                )}
              </label>
            ))}
          </div>
          {section === 'Invoices' && (
            <div className="invoice-calculation">
              <span>Subtotal: <strong>KES {Number(form.amount || 0).toLocaleString('en-KE')}</strong></span>
              <span>Tax ({Math.min(100, Math.max(0, Number(form.taxRate) || 0))}%): <strong>KES {(Math.max(0, Number(form.amount) || 0) * Math.min(100, Math.max(0, Number(form.taxRate) || 0)) / 100).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
              <span>Total due: <strong>KES {(Math.max(0, Number(form.amount) || 0) * (1 + Math.min(100, Math.max(0, Number(form.taxRate) || 0)) / 100)).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
            </div>
          )}
          <div className="project-form-actions">
            <button className="admin-view-site" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save ' + (section === 'Settings' ? 'settings' : section === 'Invoices' ? 'invoice' : section === 'Tasks' ? 'task' : section === 'Leads' ? 'lead' : 'record')}</button>
            <button className="project-cancel-button" type="button" onClick={resetForm} disabled={saving}>Cancel</button>
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
              <thead><tr>{schema.columns.map((key) => <th key={key}>{key === 'totalAmount' ? 'Total (KES)' : schema.fields.find((field) => field.name === key)?.label || key}</th>)}<th>Actions</th></tr></thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <tr key={record.id}>
                    {schema.columns.map((key) => <td key={key}>{key === 'rating' ? '★'.repeat(Math.max(0, Math.min(5, Number(record[key]) || 0))) : key === 'totalAmount' ? (record.totalAmount == null ? '—' : 'KES ' + Number(record.totalAmount).toLocaleString('en-KE')) : key === 'amount' && section === 'Invoices' ? 'KES ' + Number(record.amount || 0).toLocaleString('en-KE') : key === 'submittedAt' && record[key] ? new Date(record[key]).toLocaleString() : (record[key] || '—')}</td>)}
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
