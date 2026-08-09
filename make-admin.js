const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'azizullahrahi877@gmailo.com' },
    data: { role: 'ADMIN' }
  });
  console.log('Role updated to ADMIN successfully!');
}

main().catch(console.error).finally(() => prisma.disconnect());