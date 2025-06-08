import connectToDatabase from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();
  const todos = await Todo.find();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { task } = await req.json();
  await connectToDatabase();
  const newTodo = await Todo.create({ task });
  return NextResponse.json(newTodo);
}
