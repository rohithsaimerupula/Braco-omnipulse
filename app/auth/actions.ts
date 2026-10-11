'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { turso } from '@/lib/turso'
import nodemailer from 'nodemailer'

async function ensureAuthTables() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT
    )
  `);
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS otps (
      email TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `);
}

async function generateAndSendOtpEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

  try {
    await ensureAuthTables();

    await turso.execute({
      sql: `INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?) 
            ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at`,
      args: [normalizedEmail, code, expiresAt]
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Braco OmniPulse" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your OmniPulse Verification Code",
      text: `Your verification code is: ${code}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Braco OmniPulse</h2>
          <p>Your one-time verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #183B2B;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to send OTP:", err);
    return { error: "Failed to send OTP email. Please check your Gmail credentials in .env.local" };
  }
}

/**
 * SIGN IN: Only allow sending OTP if the email has ALREADY been registered via Sign Up.
 */
export async function sendOtp(rawEmail: string) {
  const email = (rawEmail || "").trim().toLowerCase();
  if (!email) return { error: "Email is required" };

  try {
    await ensureAuthTables();

    const existingUser = await turso.execute({
      sql: "SELECT email, name FROM users WHERE LOWER(email) = ?",
      args: [email]
    });

    if (existingUser.rows.length === 0) {
      return {
        error: "No account found for this email. Please Sign Up first before signing in to the dashboard."
      };
    }

    return await generateAndSendOtpEmail(email);
  } catch (err: any) {
    console.error(err);
    return { error: "Unable to verify account status. Please try again." };
  }
}

/**
 * SIGN UP: Block duplicate registrations with the same email.
 * Once a user signs up with an email, they cannot sign up again with that same email.
 */
export async function registerUserAndSendOtp(formData: FormData) {
  const rawEmail = (formData.get('email') as string) || "";
  const name = ((formData.get('name') as string) || "").trim();
  const company = ((formData.get('company') as string) || "").trim();
  const email = rawEmail.trim().toLowerCase();

  if (!email || !name) return { error: "Email and Full Name are required" };

  try {
    await ensureAuthTables();

    // Check if email is already registered
    const existing = await turso.execute({
      sql: "SELECT email FROM users WHERE LOWER(email) = ?",
      args: [email]
    });

    if (existing.rows.length > 0) {
      return {
        error: "This email is already registered! You cannot sign up again with the same email. Please go to Sign In."
      };
    }

    // Insert new user (strictly INSERT, no overwrite)
    await turso.execute({
      sql: "INSERT INTO users (email, name, company) VALUES (?, ?, ?)",
      args: [email, name, company]
    });

    // Send OTP to verify and complete login
    return await generateAndSendOtpEmail(email);
  } catch (err: any) {
    console.error(err);
    if (String(err?.message || "").includes("UNIQUE constraint failed")) {
      return {
        error: "This email is already registered! You cannot sign up again with the same email. Please go to Sign In."
      };
    }
    return { error: "Failed to register user." };
  }
}

/**
 * Verify OTP and create authenticated session cookie (only for registered users).
 */
export async function verifyOtpAndLogin(rawEmail: string, code: string) {
  const email = (rawEmail || "").trim().toLowerCase();
  const trimmedCode = (code || "").trim();

  try {
    await ensureAuthTables();

    // Verify user is registered in users table
    const userResult = await turso.execute({
      sql: "SELECT email, name FROM users WHERE LOWER(email) = ?",
      args: [email]
    });

    if (userResult.rows.length === 0) {
      return { error: "Account not found. Please Sign Up first." };
    }

    const result = await turso.execute({
      sql: "SELECT * FROM otps WHERE LOWER(email) = ?",
      args: [email]
    });

    if (result.rows.length === 0) {
      return { error: "No OTP found for this email. Please request a new one." };
    }

    const record = result.rows[0];

    if (record.code !== trimmedCode) {
      return { error: "Invalid OTP code." };
    }

    if (Date.now() > (record.expires_at as number)) {
      return { error: "OTP has expired. Please request a new one." };
    }

    // Delete OTP after successful use
    await turso.execute({
      sql: "DELETE FROM otps WHERE LOWER(email) = ?",
      args: [email]
    });

    // Set authenticated session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', email, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { error: "Verification failed." };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/sign-in');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('session')?.value?.trim().toLowerCase() || null;
  if (!sessionEmail) return null;

  try {
    await ensureAuthTables();
    const userResult = await turso.execute({
      sql: "SELECT email, name, company FROM users WHERE LOWER(email) = ?",
      args: [sessionEmail]
    });

    if (userResult.rows.length === 0) {
      return null;
    }

    return userResult.rows[0].email as string;
  } catch {
    return sessionEmail;
  }
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('session')?.value?.trim().toLowerCase() || null;
  if (!sessionEmail) return null;

  try {
    await ensureAuthTables();
    const userResult = await turso.execute({
      sql: "SELECT email, name, company FROM users WHERE LOWER(email) = ?",
      args: [sessionEmail]
    });

    if (userResult.rows.length === 0) {
      return null;
    }

    const row = userResult.rows[0];
    return {
      email: row.email as string,
      name: (row.name as string) || "",
      company: (row.company as string) || "",
    };
  } catch {
    return null;
  }
}
