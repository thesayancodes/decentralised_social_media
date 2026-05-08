const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({ select: { id: true, content: true } });
  console.log(posts);
  await prisma.$disconnect();
}

main().catch(console.error);
