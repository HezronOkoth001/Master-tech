import { useEffect, useMemo, useState } from 'react'
import './AdminWorkspaceSections.css'

const leadStages = ['New', 'Contacted', 'Qualified', 'Proposal sent', 'Negotiation', 'Won']
const stageProgress = { New: 10, Contacted: 25, Qualified: 40, 'Proposal sent': 55, Negotiation: 75, Won: 100, Lost: 0 }

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
    description: 'Track each enquiry from first contact through price discussions and a confirmed deal.',
    fields: [
      { name: 'name', label: 'Lead / contact name', required: true },
      { name: 'company', label: 'Company / business' },
      { name: 'contact', label: 'Email or phone', required: true },
      { name: 'service', label: 'Service interested in', type: 'select', options: ['Website Development', 'Website Security', 'SEO & Online Visibility', 'Other'] },
      { name: 'source', label: 'Enquiry source', type: 'select', options: ['WhatsApp', 'Website', 'Facebook', 'Referral', 'Phone call', 'Other'] },
      { name: 'status', label: 'Sales stage', type: 'select', options: [...leadStages, 'Lost'] },
      { name: 'quotedPrice', label: 'Your quoted price (KES)', type: 'number' },
      { name: 'clientOffer', label: "Client's proposed price (KES)", type: 'number' },
      { name: 'nextFollowUp', label: 'Next follow-up date', type: 'date' },
      { name: 'objections', label: 'Client concerns / objections', type: 'textarea' },
      { name: 'notes', label: 'Discussion notes / next action', type: 'textarea' },
    ],
    columns: ['name', 'company', 'service', 'status', 'quotedPrice', 'clientOffer', 'nextFollowUp'],
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
  Pricing: {
    title: 'Pricing catalogue',
    description: 'Manage your standard website packages, domain and hosting estimates, add-ons, SEO services and maintenance plans.',
    fields: [
      { name: 'name', label: 'Service / package name', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Website packages', 'Domain', 'Hosting', 'Website features', 'SEO & Google visibility', 'Maintenance plans', 'Other'] },
      { name: 'price', label: 'Standard price (KES)', type: 'number', required: true },
      { name: 'billing', label: 'Billing frequency', type: 'select', options: ['One-time', 'Annual', 'Monthly', 'From'] },
      { name: 'description', label: 'Description / what is included', type: 'textarea' },
      { name: 'status', label: 'Availability', type: 'select', options: ['Active', 'Inactive'] },
    ],
    columns: ['name', 'category', 'price', 'billing', 'status'],
  },
  Invoices: {
    title: 'Invoices & quotations',
    description: 'Prepare professional quotations and invoices, print or save them as PDF, and track payment status.',
    fields: [
      { name: 'documentType', label: 'Document type', type: 'select', options: ['Quotation', 'Invoice'] },
      { name: 'invoiceNumber', label: 'Document number', required: true },
      { name: 'client', label: 'Client / business name', required: true },
      { name: 'clientEmail', label: 'Client email', type: 'email' },
      { name: 'clientPhone', label: 'Client phone / WhatsApp' },
      { name: 'issueDate', label: 'Issue date', type: 'date', required: true },
      { name: 'dueDate', label: 'Due date / quotation valid until', type: 'date', required: true },
      { name: 'taxRate', label: 'Tax rate (%)', type: 'number' },
      { name: 'status', label: 'Document / payment status', type: 'select', options: ['Draft', 'Sent', 'Accepted', 'Partially paid', 'Paid', 'Overdue', 'Cancelled'] },
      { name: 'notes', label: 'Notes, scope or payment terms', type: 'textarea' },
    ],
    columns: ['documentType', 'invoiceNumber', 'client', 'totalAmount', 'dueDate', 'status'],
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
  return Object.fromEntries(schema.fields.map((field) => [field.name, field.name === 'currency' ? 'KES' : field.name === 'documentType' ? 'Quotation' : field.name === 'status' && schema.title === 'Invoices & quotations' ? 'Draft' : '']))
}

function money(value) {
  return 'KES ' + Number(value || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function nextDocumentNumber(records) {
  const highest = records.reduce((max, record) => {
    const match = String(record.invoiceNumber || '').match(/^MT-(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return 'MT-' + String(highest + 1).padStart(4, '0')
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function AdminWorkspaceSections({ section, records = [], clients = [], pricing = [], onChange }) {
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
  const [lineItems, setLineItems] = useState([{ description: 'Website design and development', quantity: '1', unitPrice: '' }])
  const savedPromotion = records.find((record) => record.recordType === 'promotion')
  const [promotionPercent, setPromotionPercent] = useState(() => Number(savedPromotion?.discountPercent) || 20)
  const [promotionMessage, setPromotionMessage] = useState(() => savedPromotion?.message || 'Get a special discount on your next website project.')
  const [promotionEndsAt, setPromotionEndsAt] = useState(() => savedPromotion?.endsAt || '')
  const [promotionAppliesTo, setPromotionAppliesTo] = useState(() => savedPromotion?.appliesTo || 'Website development services')
  const [promotionEnabled, setPromotionEnabled] = useState(() => savedPromotion?.status === 'Active')

  useEffect(() => {
    if (section !== 'Pricing') return
    const currentPromotion = records.find((record) => record.recordType === 'promotion')
    setPromotionPercent(Number(currentPromotion?.discountPercent) || 20)
    setPromotionMessage(currentPromotion?.message || 'Get a special discount on your next website project.')
    setPromotionEndsAt(currentPromotion?.endsAt || '')
    setPromotionAppliesTo(currentPromotion?.appliesTo || 'Website development services')
    setPromotionEnabled(currentPromotion?.status === 'Active')
  }, [section, records])

  const catalogueRecords = records.filter((record) => record.recordType !== 'promotion')
  const visibleRecords = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return records.filter((record) => record.recordType !== 'promotion')
    return records.filter((record) => record.recordType !== 'promotion' && Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(term)))
  }, [records, search])

  const subtotal = lineItems.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.unitPrice) || 0), 0)
  const taxRate = Math.min(100, Math.max(0, Number(form.taxRate) || 0))
  const discountValue = Math.max(0, Number(form.discountValue) || 0)
  const discountAmount = form.discountType === 'Percentage'
    ? Math.min(subtotal, subtotal * Math.min(100, discountValue) / 100)
    : form.discountType === 'Fixed amount' ? Math.min(subtotal, discountValue) : 0
  const taxableSubtotal = Math.max(0, subtotal - discountAmount)
  const taxAmount = taxableSubtotal * taxRate / 100
  const totalAmount = taxableSubtotal + taxAmount

  async function savePublicPromotion() {
    const promotionRecord = {
      id: 'public-promotion',
      recordType: 'promotion',
      name: 'Public website promotion',
      category: 'Promotion',
      discountPercent: promotionPercent,
      message: promotionMessage.trim() || 'Get a special discount on your next website project.',
      endsAt: promotionEndsAt,
      appliesTo: promotionAppliesTo.trim() || 'Website development services',
      status: promotionEnabled ? 'Active' : 'Inactive',
    }
    try {
      await onChange([...catalogueRecords, promotionRecord])
      setMessage(promotionEnabled ? `${promotionPercent}% public promotion saved and activated.` : 'Public promotion saved as inactive.')
    } catch (error) {
      setMessage(error.message || 'Could not save the public promotion.')
    }
  }

  function resetForm() {
    setForm(emptyForm(schema))
    setLineItems([{ description: 'Website design and development', quantity: '1', unitPrice: '' }])
    setEditingId(null)
    setFormOpen(false)
  }

  function openNewForm() {
    const defaults = schema.singleRecord && records[0] ? { ...emptyForm(schema), ...records[0] } : emptyForm(schema)
    if (section === 'Invoices') {
      defaults.invoiceNumber = nextDocumentNumber(records)
      defaults.issueDate = new Date().toISOString().slice(0, 10)
      defaults.discountType = 'None'
      defaults.discountValue = '0'
    }
    setForm(defaults)
    setLineItems([{ description: 'Website design and development', quantity: '1', unitPrice: '' }])
    setEditingId(schema.singleRecord && records[0] ? records[0].id : null)
    setFormOpen(true)
  }

  async function saveRecord(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const record = { ...form, id: editingId ?? String(Date.now()) }
    if (section === 'Invoices') {
      record.lineItems = lineItems.filter((item) => item.description.trim()).map((item) => ({ ...item, quantity: Math.max(1, Number(item.quantity) || 1), unitPrice: Math.max(0, Number(item.unitPrice) || 0) }))
      record.amount = Number(subtotal.toFixed(2))
      record.discountType = form.discountType || 'None'
      record.discountValue = Number(discountValue.toFixed(2))
      record.discountAmount = Number(discountAmount.toFixed(2))
      record.taxRate = String(taxRate)
      record.taxableSubtotal = Number(taxableSubtotal.toFixed(2))
      record.taxAmount = Number(taxAmount.toFixed(2))
      record.totalAmount = Number(totalAmount.toFixed(2))
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
    if (section === 'Invoices') setLineItems(record.lineItems?.length ? record.lineItems : [{ description: 'Website services', quantity: '1', unitPrice: String(record.amount || '') }])
    setEditingId(record.id)
    setFormOpen(true)
  }

  async function updateReviewStatus(record, status) {
    const nextRecords = records.map((item) =>
      String(item.id) === String(record.id) ? { ...item, status } : item
    )
    setMessage('')
    try {
      await onChange(nextRecords)
      setMessage(status === 'Approved'
        ? 'Review approved. It can now appear on the public website.'
        : status === 'Hidden'
          ? 'Review hidden from the public website.'
          : 'Review status updated.')
    } catch (error) {
      setMessage(error.message || 'Could not update this review.')
    }
  }

  function printDocument(record) {
    const type = record.documentType || 'Invoice'
    const rows = (record.lineItems || [{ description: record.notes || 'Professional services', quantity: 1, unitPrice: record.amount || 0 }]).map((item) => {
      const quantity = Number(item.quantity) || 1
      const unitPrice = Number(item.unitPrice) || 0
      const detail = [item.category, item.billing && item.billing !== 'One-time' ? item.billing : ''].filter(Boolean).join(' · ')
      return '<tr><td>' + escapeHtml(item.description) + (detail ? '<div style="color:#777;font-size:11px;margin-top:4px">' + escapeHtml(detail) + '</div>' : '') + '</td><td>' + quantity + '</td><td>' + money(quantity * unitPrice) + '</td></tr>'
    }).join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(type)} ${escapeHtml(record.invoiceNumber)}</title><style>
      *{box-sizing:border-box}body{font:14px Arial,sans-serif;color:#202124;margin:0;padding:42px}main{max-width:800px;margin:auto}.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #d4af37;padding-bottom:22px}.brand{font-size:27px;font-weight:800;letter-spacing:1px}.gold{color:#a98513}.tag{font-size:28px;font-weight:800;letter-spacing:2px}.muted{color:#666;font-size:12px;line-height:1.6}.details{display:flex;justify-content:space-between;gap:30px;margin:28px 0}.details>div{flex:1}.label{font-size:11px;color:#777;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}table{width:100%;border-collapse:collapse;margin-top:25px}th{background:#f3f0e6;text-align:left}th,td{padding:13px 12px;border-bottom:1px solid #ddd}.totals{width:310px;margin:22px 0 0 auto}.totals div{display:flex;justify-content:space-between;padding:7px 0}.grand{font-size:19px;font-weight:800;border-top:2px solid #d4af37;margin-top:8px;padding-top:13px!important}.notes{white-space:pre-wrap;margin-top:30px;padding:16px;background:#f7f7f7;line-height:1.6}.footer{border-top:1px solid #ddd;margin-top:40px;padding-top:16px;text-align:center;color:#666;font-size:12px}@media print{body{padding:0}button{display:none}@page{size:A4;margin:18mm}}</style></head><body><main>
      <div class="top"><div><div class="brand">MASTERS <span class="gold">TECH</span></div><div class="muted">Website Development & Digital Solutions</div></div><div class="tag">${escapeHtml(type.toUpperCase())}</div></div>
      <div class="details"><div><div class="label">Prepared for</div><strong>${escapeHtml(record.client)}</strong><div class="muted">${escapeHtml(record.clientEmail)}<br>${escapeHtml(record.clientPhone)}</div></div><div><div class="label">Document details</div><strong>No: ${escapeHtml(record.invoiceNumber)}</strong><div class="muted">Date: ${escapeHtml(record.issueDate)}<br>${type === 'Quotation' ? 'Valid until' : 'Due date'}: ${escapeHtml(record.dueDate)}<br>Status: ${escapeHtml(record.status)}</div></div></div>
      <table><thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="totals"><div><span>Subtotal</span><strong>${money(record.amount)}</strong></div>${Number(record.discountAmount) > 0 ? '<div><span>Client discount</span><strong>-' + money(record.discountAmount) + '</strong></div>' : ''}<div><span>Taxable amount</span><strong>${money(record.taxableSubtotal ?? (Number(record.amount || 0) - Number(record.discountAmount || 0)))}</strong></div><div><span>Tax (${escapeHtml(record.taxRate || 0)}%)</span><strong>${money(record.taxAmount)}</strong></div><div class="grand"><span>Total</span><span>${money(record.totalAmount)}</span></div></div>
      ${record.notes ? '<div class="notes"><strong>Notes / terms</strong><br>' + escapeHtml(record.notes) + '</div>' : ''}
      <div class="footer">Thank you for considering Masters Tech. We appreciate your business.</div><p class="muted" style="text-align:center">Use your browser's Print option and choose "Save as PDF" to create a PDF copy.</p><button onclick="window.print()">Print / Save as PDF</button>
      </main></body></html>`
    const documentWindow = window.open('', '_blank')
    if (!documentWindow) {
      setMessage('Your browser blocked the document preview. Allow pop-ups for this site and try again.')
      return
    }
    documentWindow.document.open()
    documentWindow.document.write(html)
    documentWindow.document.close()
    documentWindow.focus()
  }

  async function sendClientMessage(event) {
    event.preventDefault()
    const recipient = clients.find((client) => String(client.id) === String(recipientId))
    if (!recipient) { setMessage('Select a client before preparing a message.'); return }
    const destination = outgoingChannel === 'WhatsApp' ? recipient.phone : recipient.email
    if (!destination?.trim()) {
      setMessage(outgoingChannel === 'WhatsApp' ? 'This client does not have a phone number. Add one in the Clients tab first.' : 'This client does not have an email address. Add one in the Clients tab first.')
      return
    }
    if (!outgoingMessage.trim()) { setMessage('Write your message before continuing.'); return }
    const cleanPhone = String(destination).replace(/[^0-9]/g, '')
    if (outgoingChannel === 'WhatsApp' && cleanPhone.length < 8) { setMessage('The saved phone number does not look valid. Include the country code, for example 2547XXXXXXXX.'); return }
    const messageWindow = window.open('about:blank', '_blank')
    setSending(true)
    setMessage('')
    const logEntry = { id: String(Date.now()), recipient: recipient.name, contact: destination, channel: outgoingChannel, message: outgoingMessage.trim(), status: 'Ready to send', direction: 'Outgoing', createdAt: new Date().toISOString() }
    try {
      await onChange([logEntry, ...records])
      const url = outgoingChannel === 'WhatsApp' ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(outgoingMessage.trim())}` : `mailto:${destination.trim()}?subject=${encodeURIComponent('Message from Masters Tech')}&body=${encodeURIComponent(outgoingMessage.trim())}`
      if (messageWindow) messageWindow.location.href = url
      else { setMessage('Your browser blocked the new tab. Allow pop-ups for this site and try again.'); return }
      setOutgoingMessage('')
      setMessage(`Message prepared for ${recipient.name}. Complete the send in ${outgoingChannel}, then update its status to Sent here.`)
    } catch (error) {
      if (messageWindow) messageWindow.close()
      setMessage(error.message || 'Could not save the message record.')
    } finally { setSending(false) }
  }

  async function deleteRecord(record) {
    const label = record.name || record.title || record.invoiceNumber || record.reference || record.sender || record.customer || 'this record'
    if (!window.confirm('Delete ' + label + '? This cannot be undone.')) return
    setMessage('')
    try {
      await onChange(records.filter((item) => String(item.id) !== String(record.id)))
      setMessage('Record deleted from the database.')
    } catch (error) { setMessage(error.message || 'Could not delete this record.') }
  }

  function updateLineItem(index, key, value) {
    setLineItems((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))
  }

  async function convertQuotation(record) {
    const invoice = {
      ...record,
      id: String(Date.now()),
      documentType: 'Invoice',
      invoiceNumber: nextDocumentNumber(records),
      issueDate: new Date().toISOString().slice(0, 10),
      status: 'Draft',
      convertedFrom: record.invoiceNumber,
    }
    try {
      await onChange([invoice, ...records])
      setMessage('Quotation converted to a new draft invoice. Review it and update the due date before issuing.')
    } catch (error) {
      setMessage(error.message || 'Could not convert this quotation.')
    }
  }

  return (
    <div className="workspace-manager">
      <div className="workspace-toolbar">
        <div><h2>{schema.title}</h2><p>{schema.description}</p></div>
        <button className="admin-view-site" onClick={formOpen ? resetForm : openNewForm}>
          {formOpen ? 'Cancel' : schema.singleRecord && records.length ? 'Edit settings' : '+ Add ' + (section === 'Tasks' ? 'task' : section === 'Clients' ? 'client' : section === 'Leads' ? 'lead' : section === 'Invoices' ? 'document' : section === 'Payments' ? 'payment' : section === 'Messages' ? 'message' : section === 'Reviews' ? 'review' : 'settings')}
        </button>
      </div>

      {section === 'Pricing' && (
        <section className="admin-panel public-promotion-editor">
          <div className="public-promotion-heading">
            <div><h3>Homepage promotion</h3><p>Choose a public discount and control whether it appears on your website. This does not change your standard catalogue prices.</p></div>
            <span className={promotionEnabled ? 'promotion-status is-active' : 'promotion-status'}>{promotionEnabled ? 'ACTIVE' : 'INACTIVE'}</span>
          </div>
          <div className="promotion-choice-row" role="group" aria-label="Choose public discount percentage">
            {[20, 50].map((percent) => (
              <button key={percent} type="button" className={promotionPercent === percent ? 'promotion-choice selected' : 'promotion-choice'} onClick={() => setPromotionPercent(percent)}>{percent}% OFF</button>
            ))}
          </div>
          <div className="workspace-form-grid">
            <label className="workspace-field workspace-field-wide">Offer message
              <input value={promotionMessage} onChange={(event) => setPromotionMessage(event.target.value)} maxLength={180} placeholder="e.g. Save on your new business website" />
            </label>
            <label className="workspace-field">Offer applies to
              <input value={promotionAppliesTo} onChange={(event) => setPromotionAppliesTo(event.target.value)} maxLength={120} placeholder="e.g. Website development services" />
            </label>
            <label className="workspace-field">Offer end date (optional)
              <input type="date" value={promotionEndsAt} onChange={(event) => setPromotionEndsAt(event.target.value)} />
            </label>
          </div>
          <label className="promotion-toggle"><input type="checkbox" checked={promotionEnabled} onChange={(event) => setPromotionEnabled(event.target.checked)} /> Show this promotion on the public homepage</label>
          <p className="message-composer-help">The homepage will hide the offer after its end date. Apply the discount manually when preparing an eligible client's quotation.</p>
          <div className="project-form-actions"><button className="admin-view-site" type="button" onClick={savePublicPromotion}>Save promotion</button></div>
        </section>
      )}

      {section === 'Messages' && (
        <form className="admin-panel workspace-form message-composer" onSubmit={sendClientMessage}>
          <h3>Send a message to a client</h3>
          <p className="message-composer-help">Choose a saved client and a channel. The message will open in WhatsApp or your email app for you to review and send.</p>
          <div className="workspace-form-grid">
            <label className="workspace-field">Client<select value={recipientId} onChange={(event) => setRecipientId(event.target.value)} required><option value="">Select a client...</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
            <label className="workspace-field">Channel<select value={outgoingChannel} onChange={(event) => setOutgoingChannel(event.target.value)}><option value="WhatsApp">WhatsApp</option><option value="Email">Email</option></select></label>
            <label className="workspace-field workspace-field-wide">Message<textarea value={outgoingMessage} onChange={(event) => setOutgoingMessage(event.target.value)} rows={4} maxLength={2000} placeholder="Write the message you want to send..." required /></label>
          </div>
          {clients.length === 0 && <p className="message-composer-help">There are no saved clients yet. Add a client with a phone number or email address in the Clients tab first.</p>}
          <div className="project-form-actions"><button className="admin-view-site" type="submit" disabled={sending || clients.length === 0}>{sending ? 'Preparing...' : outgoingChannel === 'WhatsApp' ? 'Open WhatsApp' : 'Open email'}</button></div>
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
                    <option value="">Select...</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}
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
            <>
              {pricing.length === 0 && <p className="message-composer-help">Your pricing catalogue is empty. Add your standard packages and services in the Pricing tab first, or enter custom lines below.</p>}
              <div className="invoice-items-editor">
                <div className="invoice-items-heading"><h3>Services / items</h3><button type="button" className="invoice-add-item" onClick={() => setLineItems((items) => [...items, { description: '', category: 'Other', quantity: '1', unitPrice: '' }])}>+ Add custom line</button></div>
                <div className="invoice-catalogue-picker">
                  <label className="workspace-field">Add from your pricing catalogue
                    <select defaultValue="" onChange={(event) => {
                      const selected = pricing.find((item) => String(item.id) === event.target.value)
                      if (selected) setLineItems((items) => [...items, { description: selected.name, category: selected.category, billing: selected.billing, quantity: '1', unitPrice: String(selected.price) }])
                      event.target.value = ''
                    }}>
                      <option value="">Choose a package or service...</option>
                      {pricing.filter((item) => item.recordType !== 'promotion' && item.status !== 'Inactive').map((item) => <option key={item.id} value={item.id}>{item.category} — {item.name} ({money(item.price)} / {item.billing})</option>)}
                    </select>
                  </label>
                  <small>Catalogue prices are starting prices. You can change the quantity and unit price for this client's quotation without changing the catalogue.</small>
                </div>
                {lineItems.map((item, index) => (
                  <div className="invoice-item-row" key={index}>
                    <label className="workspace-field">Description<input value={item.description} onChange={(event) => updateLineItem(index, 'description', event.target.value)} placeholder="e.g. Website development" required /><small>{item.category || 'Custom item'}{item.billing && item.billing !== 'One-time' ? ' · ' + item.billing : ''}</small></label>
                    <label className="workspace-field">Qty<input type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateLineItem(index, 'quantity', event.target.value)} required /></label>
                    <label className="workspace-field">Unit price (KES)<input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateLineItem(index, 'unitPrice', event.target.value)} required /></label>
                    <button type="button" className="invoice-remove-item" onClick={() => setLineItems((items) => items.length > 1 ? items.filter((_, itemIndex) => itemIndex !== index) : items)} aria-label="Remove line item">×</button>
                  </div>
                ))}
              </div>
              <div className="invoice-discount-panel">
                <h3>Client-specific offer / negotiation</h3>
                <p className="message-composer-help">This discount is saved only on this quotation or invoice. It does not change your standard catalogue prices or apply to other clients.</p>
                <div className="workspace-form-grid">
                  <label className="workspace-field">Discount type
                    <select value={form.discountType || 'None'} onChange={(event) => setForm((old) => ({ ...old, discountType: event.target.value }))}>
                      <option>None</option><option>Percentage</option><option>Fixed amount</option>
                    </select>
                  </label>
                  <label className="workspace-field">Discount value {form.discountType === 'Percentage' ? '(%)' : '(KES)'}
                    <input type="number" min="0" max={form.discountType === 'Percentage' ? '100' : undefined} step="0.01" value={form.discountValue ?? '0'} onChange={(event) => setForm((old) => ({ ...old, discountValue: event.target.value }))} />
                  </label>
                </div>
                {discountAmount > 0 && <p className="message-composer-help">Client discount: <strong>{money(discountAmount)}</strong>. This is a private negotiated offer for the named client.</p>}
              </div>
              <div className="invoice-calculation">
                <span>Subtotal: <strong>{money(subtotal)}</strong></span>
                <span>Client discount: <strong>-{money(discountAmount)}</strong></span>
                <span>Taxable amount: <strong>{money(taxableSubtotal)}</strong></span>
                <span>Tax ({taxRate}%): <strong>{money(taxAmount)}</strong></span>
                <span>Final total: <strong>{money(totalAmount)}</strong></span>
              </div>
              <p className="message-composer-help">For tax, enter the rate that applies to your business and this transaction. The system calculates it; it does not determine your tax obligations.</p>
            </>
          )}

          {section === 'Leads' && (
            <div className="lead-progress-preview">
              <div className="lead-progress-label"><strong>Negotiation progress</strong><span>{stageProgress[form.status] ?? 10}%</span></div>
              <div className="lead-progress-track"><span style={{ width: (stageProgress[form.status] ?? 10) + '%' }} /></div>
              <small>{form.status === 'Won' ? 'Deal agreed — ready to prepare an invoice.' : form.status === 'Lost' ? 'This opportunity is marked as lost.' : 'Move the sales stage forward as the conversation develops.'}</small>
            </div>
          )}

          <div className="project-form-actions">
            <button className="admin-view-site" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save ' + (section === 'Settings' ? 'settings' : section === 'Invoices' ? 'document' : section === 'Tasks' ? 'task' : section === 'Leads' ? 'lead' : 'record')}</button>
            <button className="project-cancel-button" type="button" onClick={resetForm} disabled={saving}>Cancel</button>
          </div>
        </form>
      )}

      <div className="workspace-list-heading"><div><strong>{catalogueRecords.length}</strong> {catalogueRecords.length === 1 ? 'record' : 'records'}</div>{!schema.singleRecord && <input aria-label={'Search ' + section} className="workspace-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={'Search ' + section.toLowerCase() + '...'} />}</div>

      {visibleRecords.length === 0 ? (
        <div className="admin-panel workspace-empty"><span>✳</span><h3>{search ? 'No matching records' : 'Nothing here yet'}</h3><p>{search ? 'Try a different search term.' : 'Add a record to start managing this section.'}</p>{!search && <button className="admin-view-site" onClick={openNewForm}>+ Add first record</button>}</div>
      ) : (
        <div className="admin-panel workspace-table-wrap"><div className="workspace-table-scroll"><table className="workspace-table">
          <thead><tr>{schema.columns.map((key) => <th key={key}>{key === 'totalAmount' ? 'Total (KES)' : schema.fields.find((field) => field.name === key)?.label || key}</th>)}{section === 'Leads' && <th>Progress</th>}<th>Actions</th></tr></thead>
          <tbody>{visibleRecords.map((record) => (
            <tr key={record.id}>
              {schema.columns.map((key) => <td key={key}>{key === 'rating' ? '★'.repeat(Math.max(0, Math.min(5, Number(record[key]) || 0))) : key === 'totalAmount' ? money(record.totalAmount) : key === 'amount' && section === 'Invoices' ? money(record.amount) : key === 'submittedAt' && record[key] ? new Date(record[key]).toLocaleString() : key === 'quotedPrice' || key === 'clientOffer' ? (record[key] ? money(record[key]) : '—') : (record[key] || '—')}</td>)}
              {section === 'Leads' && <td><div className="lead-table-progress"><div className="lead-progress-track"><span style={{ width: (stageProgress[record.status] ?? 10) + '%' }} /></div><small>{stageProgress[record.status] ?? 10}%</small></div></td>}
              <td className="workspace-row-actions">
                {section === 'Reviews' && record.status !== 'Approved' && (
                  <button className="review-approve-button" onClick={() => updateReviewStatus(record, 'Approved')}>Approve</button>
                )}
                {section === 'Reviews' && record.status !== 'Hidden' && (
                  <button className="review-hide-button" onClick={() => updateReviewStatus(record, 'Hidden')}>Hide</button>
                )}
                <button onClick={() => editRecord(record)}>{section === 'Reviews' ? 'Edit / update' : 'Edit'}</button>
                {section === 'Invoices' && <button onClick={() => printDocument(record)}>Preview / PDF</button>}
                {section === 'Invoices' && record.documentType === 'Quotation' && record.status === 'Accepted' && <button onClick={() => convertQuotation(record)}>Create invoice</button>}
                {!schema.singleRecord && <button className="managed-delete-button" onClick={() => deleteRecord(record)}>Delete</button>}
              </td>
            </tr>
          ))}</tbody>
        </table></div></div>
      )}
    </div>
  )
}

export default AdminWorkspaceSections
