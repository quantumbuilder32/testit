import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"

require('dotenv').config()

const queryClient = postgres(process.env.DATABASE_URL as string)
export const db = drizzle(queryClient, { schema });