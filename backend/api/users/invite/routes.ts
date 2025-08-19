import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export async function POST(req: Request) {
  const { email, role } = await req.json();
  const token = generateToken();

  try {
    // Simpan user dengan status inactive
    await prisma.user.create({
      data: {
        email,
        role,
        status: 'inactive',
        token_aktivasi: token,
      },
    });

    // Kirim email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const activationUrl = `${process.env.BASE_URL}/activate?token=${token}`;

    await transporter.sendMail({
      from: `"SOC Dashboard" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Invitation to activate your account',
      html: `
        <p>You have been invited as <strong>${role}</strong>.</p>
        <p>Click the link below to activate your account:</p>
        <a href="${activationUrl}">${activationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return NextResponse.json({ message: 'Invitation sent successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error sending invitation' }, { status: 500 });
  }
}
