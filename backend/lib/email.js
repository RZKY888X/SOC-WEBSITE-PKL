import nodemailer from "nodemailer";

export async function sendInvitationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // bisa disesuaikan, misal pakai smtp lainnya
    auth: {
      user: process.env.EMAIL_USER, // email pengirim
      pass: process.env.EMAIL_PASS, // password app atau app password
    },
  });

  const activationLink = `https://your-frontend-domain.com/activate?token=${token}`;

  const mailOptions = {
    from: `"SOC Dashboard" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Invitation to SOC Dashboard",
    html: `
  <p>Hello,</p>
  <p>You have been invited to SOC Dashboard as <strong>${role}</strong>.</p>
  <p>Please open the activation page at the following link:</p>
  <p><a href="http://localhost:3000/activate">http://localhost:3000/activate</a></p>
  <p>Then enter the following token to activate your account:</p>
  <p><code style="font-size: 18px; color: #2b2b2b;">${token}</code></p>
  <p>This token is valid until you activate your account.</p>
`,

  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw new Error("Failed to send email");
  }
}
