import { NextRequest, NextResponse } from "next/server";
import schema from "./Schema";
import { prisma } from "@/prisma/client";
// Cette fonction doit être async car elle effectue une opération de base de données
// avec Prisma. Les opérations de base de données sont asynchrones et retournent des Promises
// qui doivent être awaited. De plus, elle doit retourner une NextResponse.
export async function GET() {
   const users = await prisma.user.findMany(
  //{
  //   where: {
  //     isActive: true,
  //   },
  // }
  );
  
  // Retourner les utilisateurs trouvés en format JSON
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = schema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const user= await prisma.user.findUnique({
    where: { email: body.email },
  })
    if (user) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    }
  });
  return NextResponse.json(newUser, { status: 200 });
}

