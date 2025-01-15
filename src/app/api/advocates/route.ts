import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(req: Request) {
  // Uncomment this line to use a database
  // const data = await db.select().from(advocates);

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  if (page < 1 || limit < 1) {
    return new Response(JSON.stringify({ error: "Invalid page or limit" }), { status: 400 });
  }

  const skip = (page - 1) * limit;

  const paginatedData = advocateData.slice(skip, skip + limit);

  const totalCount = advocateData.length;

  return new Response(
    JSON.stringify({
      data: paginatedData,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
