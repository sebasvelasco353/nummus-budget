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

/*
 * 
 * One lowercase letter
 * One uppercase letter
 * One digit (0-9)
 * One special character from [@$!%*?&]
 * At least 8 characters
 *
 */
export function validatePassword(pwd: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(pwd);
}
