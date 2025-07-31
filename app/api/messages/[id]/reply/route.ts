import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { reply } = await request.json();
    if (!reply || typeof reply !== 'string' || reply.trim().length < 2) {
      return NextResponse.json({ error: 'Réponse invalide.' }, { status: 400 });
    }

    // Récupérer le message et l'utilisateur
    const message = await prisma.message.findUnique({
      where: { id: Number(params.id) },
      include: { user: { select: { email: true, name: true } } }
    });
    if (!message || !message.user?.email) {
      return NextResponse.json({ error: 'Message ou utilisateur introuvable.' }, { status: 404 });
    }

    // Configurer le transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Envoyer l'email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: message.user.email,
      subject: `Réponse à votre message - Team Office`,
      text: reply,
      html: `<p>Bonjour ${message.user.name || ''},</p><p>${reply.replace(/\n/g, '<br>')}</p><p>Cordialement,<br>L'équipe Team Office</p>`
    });

    // (Optionnel) Enregistrer la réponse dans la base
    await prisma.message.update({
      where: { id: message.id },
      data: { status: 'PROCESSED' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de la réponse." }, { status: 500 });
  }
}
