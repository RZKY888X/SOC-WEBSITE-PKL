import { sendInvitationEmail } from "../lib/email.js"; // pastikan path sesuai

export async function inviteUser(req, res) {
  const { email, role } = req.body;

  try {
    const token = generateToken();

    const newUser = await prisma.user.create({
      data: {
        email,
        role,
        token,
      },
    });

    await sendInvitationEmail(email, token); // kirim email undangan

    res.status(201).json({ message: "User invited successfully" });
  } catch (error) {
    console.error("Invite error:", error);
    res.status(500).json({ message: "Failed to invite user" });
  }
}
