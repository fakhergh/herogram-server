import * as process from 'node:process';

import * as bcryptjs from 'bcryptjs';

export async function hashAsync(text: string): Promise<string> {
  const salt = await bcryptjs.genSalt(
    parseInt(process.env.PASSWORD_HASH_SALT) || 10,
  );
  return bcryptjs.hash(text, salt);
}

export async function compareHashAsync(
  text: string,
  hashedText: string,
): Promise<boolean> {
  return bcryptjs.compare(text, hashedText);
}
