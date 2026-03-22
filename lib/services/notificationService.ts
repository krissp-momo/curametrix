/**
 * CuraMatrix Notification Service
 * Sends SMS via Twilio and Email via SendGrid/SMTP when alerts are generated.
 *
 * Required environment variables:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ALERT_PHONE_NUMBERS
 *   SENDGRID_API_KEY  (or SMTP_HOST/SMTP_USER/SMTP_PASS)
 *   ALERT_EMAIL_ADDRESSES
 */

// ─── SMS via Twilio ──────────────────────────────────────────────────────────

export async function sendSMS(message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const toNumbers = (process.env.ALERT_PHONE_NUMBERS || '').split(',').map(s => s.trim()).filter(Boolean);

  if (!accountSid || !authToken || !fromNumber || toNumbers.length === 0) {
    console.warn('[Notifications] Twilio not configured — skipping SMS.');
    return false;
  }

  let sent = false;

  try {
    // Safely import twilio (handles CJS/ESM interop in Next.js Turbopack)
    const twilioPkg = await import('twilio');
    const twilioClientFactory = twilioPkg.default || twilioPkg;
    const client = twilioClientFactory(accountSid, authToken);

    for (const to of toNumbers) {
      try {
        const msg = await client.messages.create({ body: message, from: fromNumber, to });
        console.log(`[SMS] Sent to ${to}. SID: ${msg.sid}`);
        sent = true;
      } catch (err) {
        console.error(`[SMS] Failed to send to ${to}:`, err);
      }
    }
  } catch (initErr) {
    console.error('[SMS] Failed to initialize Twilio client:', initErr);
  }

  return sent;
}

// ─── Email ───────────────────────────────────────────────────────────────────

export async function sendEmail(subject: string, html: string): Promise<boolean> {
  const toAddresses = (process.env.ALERT_EMAIL_ADDRESSES || '').split(',').map(s => s.trim()).filter(Boolean);
  if (toAddresses.length === 0) {
    console.warn('[Notifications] No email addresses configured — skipping email.');
    return false;
  }

  // SendGrid path
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);
    try {
      await sgMail.default.sendMultiple({
        to: toAddresses,
        from: process.env.ALERT_FROM_EMAIL || 'noreply@curametrix.com',
        subject,
        html,
      });
      console.log(`[Email/SendGrid] Sent to ${toAddresses.join(', ')}`);
      return true;
    } catch (err) {
      console.error('[Email/SendGrid] Failed:', err);
      return false;
    }
  }

  // SMTP fallback (Gmail / Outlook / etc.)
  if (process.env.SMTP_HOST) {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: toAddresses.join(', '),
        subject,
        html,
      });
      console.log(`[Email/SMTP] Sent to ${toAddresses.join(', ')}`);
      return true;
    } catch (err) {
      console.error('[Email/SMTP] Failed:', err);
      return false;
    }
  }

  console.warn('[Notifications] No email provider configured (set SENDGRID_API_KEY or SMTP_HOST).');
  return false;
}

// ─── Unified alert notification ───────────────────────────────────────────────

export async function notifyAlert(title: string, message: string, severity: string): Promise<{
  smsSent: boolean;
  emailSent: boolean;
}> {
  const urgencyEmoji = severity === 'critical' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';
  const smsBody = `${urgencyEmoji} CuraMatrix Alert\n${title}\n${message}`;
  const emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:${severity === 'critical' ? '#DC2626' : severity === 'warning' ? '#D97706' : '#0EA5E9'};padding:20px 28px;color:white;">
        <h2 style="margin:0;font-size:20px;">${urgencyEmoji} ${title}</h2>
        <p style="margin:4px 0 0;opacity:0.85;font-size:13px;">CuraMatrix — Hospital Pharmacy System</p>
      </div>
      <div style="padding:24px 28px;background:#f8fafc;">
        <p style="font-size:15px;color:#1e293b;line-height:1.6;">${message}</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #e2e8f0;" />
        <p style="font-size:12px;color:#64748b;">This is an automated notification from CuraMatrix. Please log in to review and approve actions.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://curametrix-coral.vercel.app'}/dashboard/alerts"
          style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1E3A8A;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">
          View in Dashboard →
        </a>
      </div>
    </div>
  `;

  const [smsSent, emailSent] = await Promise.all([
    sendSMS(smsBody),
    sendEmail(`CuraMatrix: ${title}`, emailHtml),
  ]);

  return { smsSent, emailSent };
}
