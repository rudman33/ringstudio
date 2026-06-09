import { Resend } from 'resend'
import type { Inquiry, Account } from '../types'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── New inquiry notification to jeweler ──
export async function sendNewInquiryEmail(inquiry: Inquiry, account: Account) {
  const adminUrl = `https://${account.subdomain}.${process.env.NEXT_PUBLIC_APP_DOMAIN}/admin/inquiries/${inquiry.id}`

  await resend.emails.send({
    from: 'Ring Studio <notifications@ringstudio.com>',
    to: account.notification_email || account.email,
    subject: `New ring inquiry from ${inquiry.customer_name} — ${inquiry.reference_code}`,
    html: `
      <h2>New ring design inquiry</h2>
      <p><strong>Customer:</strong> ${inquiry.customer_name} (${inquiry.customer_email})</p>
      <p><strong>Reference:</strong> ${inquiry.reference_code}</p>
      <p><strong>Ring type:</strong> ${inquiry.ring_type || '—'}</p>
      <p><strong>Selections:</strong> ${JSON.stringify(inquiry.selections, null, 2)}</p>
      <p><strong>Budget:</strong> ${inquiry.budget_range || '—'}</p>
      <p><strong>Timeline:</strong> ${inquiry.timeline || '—'}</p>
      ${inquiry.notes ? `<p><strong>Notes:</strong> ${inquiry.notes}</p>` : ''}
      <br>
      <a href="${adminUrl}" style="background:#B5966D;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
        View in admin panel
      </a>
    `,
  })
}

// ── Confirmation email to customer ──
export async function sendInquiryConfirmationEmail(inquiry: Inquiry, account: Account) {
  await resend.emails.send({
    from: `${account.business_name} <notifications@ringstudio.com>`,
    to: inquiry.customer_email,
    subject: `We received your ring design — ${inquiry.reference_code}`,
    html: `
      <h2>Thank you, ${inquiry.customer_name.split(' ')[0]}!</h2>
      <p>We've received your ring design inquiry and will be in touch within 24 hours.</p>
      <p><strong>Your reference number:</strong> ${inquiry.reference_code}</p>
      <br>
      <p>— The team at ${account.business_name}</p>
    `,
  })
}
