import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/prisma/client";
export async function GET() {
   const products = await prisma.product.findMany(
  //{
  //   where: {
  //     isActive: true,
  //   },
  // }
  );
  
  // Retourner les utilisateurs trouvés en format JSON
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = schema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const product = await prisma.product.findFirst({
    where: { name: body.name },
  });
  if (product) {
    return NextResponse.json({ error: "Product name already exists" }, { status: 400 });
  }
  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price, 
    }
  });
  return NextResponse.json(newProduct, { status: 201 });
}