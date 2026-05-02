const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const convs = await prisma.conversation.findMany({ take: 5 });
    console.log('SUCCESS: Found', convs.length, 'conversations');
    if (convs.length > 0) {
      console.log('First conv:', JSON.stringify({ id: convs[0].id, status: convs[0].status, channel: convs[0].channel }, null, 2));
    }
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Users count:', users.length);
    const contacts = await prisma.contact.findMany({ take: 5 });
    console.log('Contacts count:', contacts.length);
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
