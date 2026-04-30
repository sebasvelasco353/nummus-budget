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

export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
