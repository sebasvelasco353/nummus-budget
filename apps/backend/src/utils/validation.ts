export function isUser(element: unknown): boolean {
  if (typeof element === "object" &&
    element !== null &&
    "name" in element &&
    "email" in element &&
    "password" in element
  ) {
    return true;
  }
  return false;
}
