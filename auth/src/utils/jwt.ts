import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import APIError from "../errors/api-error";

const salt = 10;

export const generatePassword = async (password: string) => {
  try {
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
    return await jwt.sign(payload, "", { expiresIn: "30d" });
  } catch (error) {
    return "Unable to generate signature from jwt";
  }
};
