import { genSalt, hash, compare } from 'bcrypt';

interface IBcryptParams {
  salt?: string | number;
  source: string;
}

function generateSalt(characterNumber = 10): Promise<string> {
  return genSalt(characterNumber);
}

async function generateWithBcrypt({
  salt,
  source,
}: IBcryptParams): Promise<string> {
  salt = salt || (await generateSalt());

  return hash(source, salt);
}

async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}

export default { generateWithBcrypt, comparePassword };
