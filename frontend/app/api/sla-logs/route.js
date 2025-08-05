// frontend/app/api/sla-logs/route.js

export async function GET() {
    try {
      const res = await fetch("http://localhost:3001/api/sla-logs"); // Pastikan port backend benar
      const data = await res.json();
      return Response.json(data);
    } catch (error) {
      console.error("Gagal fetch SLA logs:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  