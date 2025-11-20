// Prisma Configuration - Ailurus Documentation Platform
// Generated: 2025-11-20
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL") || "postgresql://postgres:postgres@localhost:5432/ailurus_docs?schema=public",
  },
});
