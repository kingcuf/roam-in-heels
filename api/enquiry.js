import { Resend } from 'resend'

// Recipients — both hosts get every enquiry.
// NOTE: Until roam-in-heels.com is verified on Resend, only the account-owner
// address can receive mail. Add iitkgp.mansi2024@gmail.com back once the
// domain is verified at resend.com/domains.
const RECIPIENTS = [
  'deependra1997yadav@gmail.com',
  // 'iitkgp.mansi2024@gmail.com', // re-enable after domain verification
]

// Until roam-in-heels.com is verified on Resend, we send from their default
// onboarding sender. Once the domain is verified, change this to e.g.
//   'Roam in Heels <enquiries@roam-in-heels.com>'
const FROM = 'Roam in Heels <onboarding@resend.dev>'

function escape(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

function fmtDateTime(s) {
  if (!s) return ''
  // s is "YYYY-MM-DDTHH:MM" — render as "DD MMM YYYY · HH:MM"
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s)
  if (!m) return s
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${m[3]} ${months[Number(m[2]) - 1]} ${m[1]} · ${m[4]}:${m[5]}`
}

function referralLine(p) {
  if (!p.referralSource) return ''
  if (p.referralSource === 'Others' && p.referralOther) return `Others — ${p.referralOther}`
  return p.referralSource
}

function buildHtml(p) {
  const row = (label, value) => value
    ? `<tr><td style="padding:8px 16px 8px 0;color:#7A5C45;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;width:140px;vertical-align:top;">${label}</td><td style="padding:8px 0;color:#2E1F14;font-size:15px;">${escape(value)}</td></tr>`
    : ''

  return `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#FBF6EF;font-family:-apple-system,BlinkMacSystemFont,'Inter',Helvetica,sans-serif;color:#2E1F14;">
  <table cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;padding:32px 36px;box-shadow:0 8px 24px rgba(104,73,52,.10);">
    <tr><td>
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#B0683C;font-weight:500;">New enquiry</div>
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:600;margin:8px 0 4px;color:#2E1F14;">${escape(p.fullName)}</h1>
      <div style="color:#7A5C45;font-size:14px;margin-bottom:24px;">${escape(p.propertyLabel || p.property || '')}</div>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-top:1px solid #E6D9C7;">
        ${row('Home',      p.propertyLabel)}
        ${row('Mobile',    p.mobile)}
        ${row('Check-in',  fmtDateTime(p.checkIn))}
        ${row('Check-out', fmtDateTime(p.checkOut))}
        ${row('Guests',    p.guests)}
        ${row('Heard via', referralLine(p))}
        ${row('Message',   p.message)}
        ${row('Submitted', p.submittedAt)}
      </table>
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #E6D9C7;font-size:12px;color:#A89684;">
        Sent automatically from roam-in-heels.com
      </div>
    </td></tr>
  </table>
</body></html>`
}

function buildText(p) {
  const ref = referralLine(p)
  return [
    `New enquiry from ${p.fullName}`,
    (p.propertyLabel || p.property) ? `Home: ${p.propertyLabel || p.property}` : '',
    '',
    `Mobile:    ${p.mobile}`,
    p.checkIn  ? `Check-in:  ${fmtDateTime(p.checkIn)}`  : '',
    p.checkOut ? `Check-out: ${fmtDateTime(p.checkOut)}` : '',
    `Guests:    ${p.guests}`,
    ref        ? `Heard via: ${ref}` : '',
    p.message  ? `\nMessage:\n${p.message}` : '',
    '',
    `Submitted: ${p.submittedAt}`,
    '',
    '— roam-in-heels.com',
  ].filter(Boolean).join('\n')
}

/* Files the enquiry in the Roam in Heels dashboard's database (Cloudflare
 * Worker + D1), where it shows up on the app's Action tab. Server-to-server:
 * ENQUIRY_KEY never reaches the browser. */
async function saveToDashboard(payload) {
  const base = process.env.SPIRA_API_URL
  const key = process.env.ENQUIRY_KEY
  if (!base || !key) throw new Error('SPIRA_API_URL / ENQUIRY_KEY not set')
  const r = await fetch(base + '?action=submitEnquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Enquiry-Key': key },
    body: JSON.stringify(payload),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok || !j.ok) throw new Error(j.error || `HTTP ${r.status}`)
  return j.id
}

async function sendEmail(payload) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: RECIPIENTS,
    subject: `New enquiry — ${payload.fullName}${payload.property ? ' · ' + payload.property : ''}`,
    html: buildHtml(payload),
    text: buildText(payload),
  })
  if (error) throw new Error(error.message || 'Resend error')
  return data?.id
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vercel parses JSON bodies automatically when Content-Type is application/json
  const payload = req.body || {}

  if (!payload?.fullName?.trim() || !payload?.mobile?.trim()) {
    return res.status(400).json({ error: 'Name and mobile are required' })
  }

  // Both at once, and either one is enough: a guest should not be told their
  // enquiry failed because the email service hiccuped while the dashboard got it
  // (or the other way round). Each failure is logged for us to look at.
  const [saved, mailed] = await Promise.allSettled([saveToDashboard(payload), sendEmail(payload)])
  if (saved.status === 'rejected') console.error('[enquiry] dashboard save failed:', saved.reason)
  if (mailed.status === 'rejected') console.error('[enquiry] email failed:', mailed.reason)

  if (saved.status === 'rejected' && mailed.status === 'rejected') {
    return res.status(502).json({ error: 'Could not send the enquiry' })
  }
  return res.status(200).json({
    ok: true,
    saved: saved.status === 'fulfilled',
    emailed: mailed.status === 'fulfilled',
  })
}
