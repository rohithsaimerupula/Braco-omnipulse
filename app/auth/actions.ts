'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  
  // Fake auth for Turso/Hackathon mode
  const cookieStore = await cookies();
  cookieStore.set('session', email, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  
  const cookieStore = await cookies();
  cookieStore.set('session', email, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
  redirect('/dashboard')
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/sign-in')
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get('session')?.value || null;
}
