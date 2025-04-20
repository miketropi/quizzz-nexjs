import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_GMAIL_USER,
    pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, text, html, from } = body;

    // Validate required fields
    if (!subject || (!text && !html)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and either text or html' },
        { status: 400 }
      );
    } 

    // Configure email options
    const mailOptions = {
      from: from || process.env.NEXT_PUBLIC_GMAIL_USER,
      to: to || process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      subject,
      text,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        messageId: info.messageId,
        message: 'Email sent successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send email', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}
