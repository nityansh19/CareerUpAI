const RESEND_URL = "https://api.resend.com/emails";

async function sendVerificationEmail(email, code) {
  if (process.env.NODE_ENV === "test") return { id: "test-email" };
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from)
    throw Object.assign(
      new Error("Email verification is temporarily unavailable."),
      { status: 503 },
    );
  let response;
  try {
    response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Verify your CareerUpAI email",
        text: `Your CareerUpAI verification code is ${code}. It expires in 15 minutes. If you did not request this, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#111827"><h2 style="margin:0 0 12px">Verify your CareerUpAI email</h2><p style="line-height:1.6">Enter this 6-digit code to finish creating your account:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${code}</div><p style="line-height:1.6;color:#4b5563">The code expires in 15 minutes. If you did not request it, you can ignore this email.</p></div>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw Object.assign(
      new Error("We could not send the verification email. Please try again."),
      { status: 503 },
    );
  }
  if (!response.ok)
    throw Object.assign(
      new Error("We could not send the verification email. Please try again."),
      { status: 503 },
    );
  return response.json().catch(() => ({}));
}

module.exports = { sendVerificationEmail };
