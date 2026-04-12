import { pgTable, decimal, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

const accountTypeEnum = pgEnum("account_type", ["savings", "checking", "credit"]);
const currencyEnum = pgEnum("currency", ["USD", "EUR", "GBP", "COP"]);
const recurringPeriodEnum = pgEnum("recurring_period", ["weekly", "monthly", "yearly"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  passwordHash: text("password_hash").notNull(),
});

export const refreshTokensTable = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const accountsTable = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  bankName: text("bank_name").notNull(),
  currency: currencyEnum("currency").notNull().default("COP"),
  accountType: accountTypeEnum("account_type").notNull(),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastModifiedAt: timestamp("last_modified_at").notNull().defaultNow(),
});

export const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const expensesTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
  recordedBy: uuid("recorded_by").notNull().references(() => usersTable.id),
  accountId: uuid("account_id").notNull().references(() => accountsTable.id),
  categoryId: uuid("category_id").notNull().references(() => categoriesTable.id),
});

export const incomeTable = pgTable("income", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
  accountId: uuid("account_id").notNull().references(() => accountsTable.id),
});

export const goalsTable = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
});

export const goalContributionsTable = pgTable("goal_contributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").notNull().references(() => goalsTable.id),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasksTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
  completedBy: uuid("completed_by").references(() => usersTable.id),
  completedAt: timestamp("completed_at"),
});

export const taskAssignmentsTable = pgTable("task_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").notNull().references(() => tasksTable.id),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
});

export const goalsUsersTable = pgTable("goals_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").notNull().references(() => goalsTable.id),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const recurringPaymentsTable = pgTable("recurring_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  period: recurringPeriodEnum("period").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").notNull().references(() => usersTable.id),
  accountId: uuid("account_id").notNull().references(() => accountsTable.id),
  categoryId: uuid("category_id").notNull().references(() => categoriesTable.id),
});
