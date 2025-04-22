import admin from '@/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  
  const user = await admin.auth().getUser(id); 
  return NextResponse.json(user); 
}  

