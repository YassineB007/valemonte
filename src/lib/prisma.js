import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

function makePrisma() {
    const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        max: 10,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
