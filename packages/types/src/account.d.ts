export type Account = {
  accountName: string,
  bankName: string,
  currency: "COP" | "USD" | "EUR" | "GBP",
  accountType: "savings" | "checking" | "credit",
  createdBy: string,
  createdAt: Date,
  lastModifiedAt: Date
}
