import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { createToken, getHashedPassword, readJsonFile, sendResponse, writeData } from "../utils/helper.js";
import authSchema from '../utils/validation_schema.js';

// Function to register the new user
export const handleRegister = async (req, res) => {
    try {
        if (!req.body) return sendResponse(res, "No data received", false, 400);

        const { email, password, confirmPassword, gardenName } = req.body;
        if (![email, password, confirmPassword].every(Boolean)) {
            return sendResponse(res, "Required fields are missing", false, 400);
        }

        //(TODO: Add schema validation using Joi)
        const result = await authSchema.validateAsync(req.body);
        console.log("result: ",result);

        // Read existing user data from JSON file
        const data = await readJsonFile('registeredUser.json');
        //check if user already exist
        if (Object.values(data).some(user => user.email === email.toLowerCase())) {
            return sendResponse(res, "User Already Exists", false, 409);
        }

        const hashedPassword = await getHashedPassword(password);
        if (!hashedPassword) return sendResponse(res, "Password hashing failed. Please try again.", false, 400);

        // Create new user object with a unique ID
        const newUser = {
            id: uuidv4(),
            email : email.toLowerCase(),
            password: hashedPassword,
            ...(gardenName && { gardenName })
        };

        // Add new user to the data object with ID as key
        data[newUser.id] = newUser;
        await writeData('registeredUser.json', data);

        return sendResponse(res, "User Registered Successfully", true, 200);
    } catch (error) {
        console.log("register error: ", error)
        if()
        sendResponse(res, "Server Error", false, 500);
    }
}

export const handleLogin = async (req, res) => {
    try {
        if (!req.body) return sendResponse(res, "No data received", false, 400);
        let { email, password } = req.body;
        if (![email, password].every(Boolean)) return sendResponse(res, "Data not found", false, 400);

        const data = await readJsonFile('registeredUser.json');
        const user = Object.values(data).find(user => user.email === email);
        if (!user) return sendResponse(res, "User not exist signup first", false, 400);

        const match = await bcrypt.compare(password, user.password);
        let token;
        if (match) {
            const payload = {
                id: user.id
            }
            token = await createToken(payload);
            const { password, ...data } = user;
            return sendResponse(res, "Login Successfull", true, 200, data, token);
        }
        sendResponse(res, "Incorrect Password", false, 400);

    } catch (error) {
        console.log("login error: ", error)
        sendResponse(res, "Server Error", false, 500);
    }
}
