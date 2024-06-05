import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import APIError from "../errors/api-error";
import { privateKey } from "../server";
import getConfig from "./config";

export const generatePassword = async (password: string) => {
  try {
    const salt = 10;

    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new APIError("Unable to generate password");
  }
};

export const validatePassword = async ({
  enteredPassword,
  savedPassword,
}: {
  enteredPassword: string;
  savedPassword: string;
}) => {
  return (await generatePassword(enteredPassword)) === savedPassword;
};

export const generateSignature = async (payload: object): Promise<string> => {
  try {
    return await jwt.sign(payload, privateKey, {
      expiresIn: getConfig(process.env.NODE_ENV).jwtExpiresIn!,
      algorithm: 'RS256'
    });
  } catch (error) {
    console.log(error)
    throw new APIError("Unable to generate signature from jwt");
  }
};
