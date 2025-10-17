const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'vicki@admin.com' },
        update: {},
        create: {
            email: 'vicki@admin.com',
            name: 'Vicki Admin',
            password: hashedPassword,
        },
    });

    console.log('Vicki user created:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });