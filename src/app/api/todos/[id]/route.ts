import connectToDatabase from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const { task, completed } = await req.json();
  await connectToDatabase();
  const updated = await Todo.findByIdAndUpdate(id, { task, completed }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  await connectToDatabase();
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
