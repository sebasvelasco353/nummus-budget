import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (plainText: string): Promise<string> => {
  const hash = await bcrypt.hash(plainText, saltRounds);
  return hash;
};

export const comparePasswords = async (plainText: string, hash: string): Promise<boolean> => {
  const result = await bcrypt.compare(plainText, hash);
  return result;
};
