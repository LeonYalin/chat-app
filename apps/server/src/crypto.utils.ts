import * as bcrypt from 'bcrypt';

const saltRounds = 8;

export async function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export async function comparePasswordAndHash(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
