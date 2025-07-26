import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma/client";
import schema from "../Schema";
export async function GET(request: NextRequest,
  { params }: { params: { id: number } }) {
    const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });
    if(!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }
    return NextResponse.json(user);
  
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const body = await request.json();
  const validation = schema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  })
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

 
  const updatedUser = await prisma.user.update({
    where: { id: Number(user.id) },
    data: {
      name: body.name,
      email: body.email,
    },
  });
  return NextResponse.json(updatedUser, { status: 200 });
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 400 }
    );
  }
  await prisma.user.delete({
    where: { id: Number(params.id) },
  });
  
  return NextResponse.json({ message: "User deleted successfully" });
}