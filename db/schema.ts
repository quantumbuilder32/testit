import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, integer, date, text, varchar, boolean, json } from "drizzle-orm/pg-core";

//rules when adding schemas
//nameoftable plural
//nameoftable relations
//many to many - make a third table - link back each one to one
//one to many - can use normal many relation - then link back with a foreign key 
// typeof users.$inferSelect; //infer type to make schemas


export const feedlyDatabaseResults = pgTable("feedlyDatabaseResults", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    description: text("description").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    website: varchar("website", { length: 255 }).notNull(),
    feedId: varchar("feedId", { length: 255 }).notNull(),
    searchTerm: varchar("searchTerm", { length: 255 }).notNull(),

    score: integer("score").notNull(),
    estimatedEngagement: integer("estimatedEngagement").notNull(),

    lastUpdated: varchar("lastUpdated", { length: 255 }).notNull(),
    updated: varchar("updated", { length: 255 }).notNull(),

    topics: json("topics").$type<string[]>().notNull(),
},
    (table) => {
        return {
            idIndex: index("idIndex").on(table.id),
            scoreIndex: index("scoreIndex").on(table.score),
            estimatedEngagementIndex: index("estimatedEngagementIndex").on(table.estimatedEngagement),
            searchTermIndex: index("searchTermIndex").on(table.searchTerm),
        };
    })
// export const usersRelations = relations(users, ({ many }) => ({
// }));
// typeof feedlyDatabaseResults.$inferSelect; //infer type to make schemas


