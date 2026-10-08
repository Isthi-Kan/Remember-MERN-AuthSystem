export const EMAIL_VERIFY_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6fb; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06); border: 1px solid #eef2f6;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); padding: 36px 30px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.18); width: 56px; height: 56px; border-radius: 14px; line-height: 56px; text-align: center; margin: 0 auto 16px auto;">
                <span style="font-size: 26px;">🔐</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Confirm your email address to activate your account</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 30px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #475569;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #475569;">
                Thank you for signing up! To complete your email verification for <strong style="color: #1e293b;">{{email}}</strong>, please enter the 6-digit verification code below:
              </p>

              <!-- OTP Code Display -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #f8fafc; border: 2px dashed #c7d2fe; border-radius: 12px; padding: 18px 24px; display: inline-block; min-width: 230px; text-align: center;">
                      <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6366f1; margin-bottom: 8px;">Your Verification Code</span>
                      <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1e1b4b; font-family: 'Courier New', Courier, monospace; display: block; margin-left: 8px;">{{otp}}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 18px;">
                      ⏱️ <strong>Note:</strong> This verification code is valid for <strong>24 hours</strong>. Never share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; line-height: 22px; color: #64748b;">
                If you did not register for an account, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                Authentication System
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This is an automated message, please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const PASSWORD_RESET_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6fb; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06); border: 1px solid #eef2f6;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 36px 30px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.18); width: 56px; height: 56px; border-radius: 14px; line-height: 56px; text-align: center; margin: 0 auto 16px auto;">
                <span style="font-size: 26px;">🔑</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Password Reset Request</h1>
              <p style="margin: 8px 0 0 0; color: #fee2e2; font-size: 14px;">Use the code below to reset your account password</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 30px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #475569;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #475569;">
                We received a request to reset the password for your account associated with <strong style="color: #1e293b;">{{email}}</strong>. Use this 6-digit code to proceed:
              </p>

              <!-- OTP Code Display -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #fef2f2; border: 2px dashed #fca5a5; border-radius: 12px; padding: 18px 24px; display: inline-block; min-width: 230px; text-align: center;">
                      <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #ef4444; margin-bottom: 8px;">Password Reset OTP</span>
                      <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #7f1d1d; font-family: 'Courier New', Courier, monospace; display: block; margin-left: 8px;">{{otp}}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 18px;">
                      ⏱️ <strong>Important:</strong> This reset code will expire in <strong>15 minutes</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 14px 18px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
                  🛡️ <strong>Didn't request this?</strong> If you did not make this request, someone else might have entered your email by mistake. Your account is still secure and you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                Authentication System
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This is an automated message, please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
