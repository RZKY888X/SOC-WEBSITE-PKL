import prisma from "./prisma";

export async function getTicketsByStatusAndRange(statuses, range) {
  const days = range === "1 Day" ? 1 : range === "7 Days" ? 7 : 30;
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  return await prisma.ticket.findMany({
    where: {
      status: { in: statuses },
      createdAt: {
        gte: sinceDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
