import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is callback based, promisify used to let
// scrypt be promise based implementation
// output from scrypt is a buffer... must convert to a string
const scryptAsync = promisify(scrypt);

export class PasswordManager {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    // storedPassword is hashed and salted password
    static async compare(storedPassword: string, givenPassword: string) { 
        //break up hashed pass and salt by the '.'
        const [hashedPassword, salt] = storedPassword.split('.'); 
        const buf = (await scryptAsync(givenPassword, salt, 64)) as Buffer;
        
        return buf.toString('hex') === hashedPassword;
    }
}