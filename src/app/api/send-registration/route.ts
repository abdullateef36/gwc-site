import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { TeamMember } from "@/lib/registration";

interface RegistrationData {
  tournamentTitle: string;
  tournamentDate: string;
  tournamentPrize: string;
  teamName: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  teamMembers: TeamMember[];
  additionalNotes?: string;
}

export async function POST(request: Request) {
  try {
    const data: RegistrationData = await request.json();

    // Create transporter (use your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Format team members list
    const teamMembersList = data.teamMembers
      .map(
        (member: TeamMember, index: number) =>
          `
      <div style="margin-bottom: 15px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
        <strong>Member ${index + 1}:</strong><br/>
        Name: ${member.name}<br/>
        Email: ${member.email}<br/>
        Game Tag: ${member.gameTag}
      </div>
    `
      )
      .join("");

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Your admin email
      subject: `New Tournament Registration: ${data.tournamentTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E10600; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .info-row { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #E10600; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #E10600; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎮 New Tournament Registration</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">Tournament:</span> ${data.tournamentTitle}
              </div>
              <div class="info-row">
                <span class="label">Date:</span> ${data.tournamentDate}
              </div>
              <div class="info-row">
                <span class="label">Prize Pool:</span> ${data.tournamentPrize}
              </div>
              
              <h2 style="color: #E10600; margin-top: 30px;">Team Information</h2>
              <div class="info-row">
                <span class="label">Team Name:</span> ${data.teamName}
              </div>
              
              <h3 style="color: #E10600;">Captain Details</h3>
              <div class="info-row">
                <span class="label">Name:</span> ${data.captainName}<br/>
                <span class="label">Email:</span> ${data.captainEmail}<br/>
                <span class="label">Phone:</span> ${data.captainPhone}
              </div>
              
              <h3 style="color: #E10600;">Team Members</h3>
              ${teamMembersList}
              
              ${
                data.additionalNotes
                  ? `
              <h3 style="color: #E10600;">Additional Notes</h3>
              <div style="padding: 15px; background: #f5f5f5; border-radius: 8px;">
                ${data.additionalNotes}
              </div>
              `
                  : ""
              }
              
              <div class="footer">
                <p>Registered at: ${new Date().toLocaleString()}</p>
                <p>Please review and approve this registration in your admin panel.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email to captain (confirmation)
    const captainMailOptions = {
      from: process.env.EMAIL_USER,
      to: data.captainEmail,
      subject: `Registration Confirmed: ${data.tournamentTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E10600; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .info-box { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #E10600; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ Registration Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.captainName},</p>
              
              <p>Thank you for registering your team <strong>${data.teamName}</strong> for the <strong>${data.tournamentTitle}</strong>!</p>
              
              <div class="info-box">
                <h3 style="color: #E10600; margin-top: 0;">Tournament Details</h3>
                <strong>Date:</strong> ${data.tournamentDate}<br/>
                <strong>Prize Pool:</strong> ${data.tournamentPrize}
              </div>
              
              <p>Your registration is currently <strong>pending review</strong>. We will send you an email once your registration has been approved.</p>
              
              <p>In the meantime, please ensure all team members are prepared and available for the tournament date.</p>
              
              <div class="footer">
                <p>If you have any questions, please reply to this email.</p>
                <p><strong>Good luck and see you in the arena! 🎮</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(captainMailOptions);

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}