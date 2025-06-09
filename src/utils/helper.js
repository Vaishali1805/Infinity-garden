import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Utility to read and parse a JSON file asynchronously
export const readJsonFile = async (filename) => {
    const filePath = path.join(__dirname, "src/JSON_files", filename);
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        if (data.trim() === '') return {};
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Failed to read ${filename}: ${error.message}`);
    }
};

// Utility to write data to a JSON file asynchronously
export const writeData = async (filename, data) => {
    const filePath = path.join(__dirname, "src/JSON_files", filename);
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(`Failed to write ${filename}: ${error.message}`);
    }
}

// Utility to send the response
export const sendResponse = (res,message,success,status,userData = null,token = null) => {
    return res.status(status).json({ message, success, userData,token });
}

// Utility to hash the password
export const getHashedPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        return false;
    }
}

// Utility to create the token
export const createToken = async (payload) => {
    const token = jwt.sign(payload,process.env.TOKEN_SECRET,{ expiresIn: '5h' });
    return token;
}