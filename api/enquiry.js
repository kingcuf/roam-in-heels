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
      <div style="color:#7A5C45;font-size:14px;margin-bottom:24px;">${escape(p.property || '')}</div>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-top:1px solid #E6D9C7;">
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
    p.property ? `Property: ${p.property}` : '',
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[enquiry] RESEND_API_KEY is not set')
    return res.status(500).json({ error: 'Email service not configured' })
  }

  // Vercel parses JSON bodies automatically when Content-Type is application/json
  const payload = req.body || {}

  if (!payload?.fullName?.trim() || !payload?.mobile?.trim()) {
    return res.status(400).json({ error: 'Name and mobile are required' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENTS,
      subject: `New enquiry — ${payload.fullName}`,
      html: buildHtml(payload),
      text: buildText(payload),
    })

    if (error) {
      console.error('[enquiry] Resend error:', error)
      return res.status(502).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ ok: true, id: data?.id })
  } catch (err) {
    console.error('[enquiry] Send threw:', err)
    return res.status(500).json({ error: 'Send failed' })
  }
}
