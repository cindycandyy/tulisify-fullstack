// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function handler(request: NextRequest) {
  if (request.method === "GET") {
    // TODO: Implement GET logic here
    return new NextResponse("GET method not implemented", { status: 501 });
  } else if (request.method === "POST") {
    // TODO: Implement POST logic here
    return new NextResponse("POST method not implemented", { status: 501 });
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 })
  }
}
