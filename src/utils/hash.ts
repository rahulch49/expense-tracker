const SALT_ROUNDS = 10;
import * as bcrypt from "bcrypt";

//Written as an async function
export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
}

//Explicitly declaring as a Promise returning function
export const comparePassword = async (hash: string, password: string) => {
    return bcrypt.compare(password, hash);
}