import { getTicketsByStatusAndRange } from "@/lib/ticketService"; // Pastikan file ini ada

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const rangeParam = searchParams.get("range");

  const statuses = statusParam ? statusParam.split(",") : [];
  const range = rangeParam || "7 Days";

  try {
    const tickets = await getTicketsByStatusAndRange(statuses, range);
    return new Response(JSON.stringify(tickets), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gagal fetch tickets:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
    