import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { createToken, getHashedPassword, readJsonFile, sendResponse, writeData } from "../utils/helper.js";
import { authSchema, changePasswordSchema } from '../utils/validation.js';
import sendEmail from '../utils/mailAuth.js';
import { getOtp, setOtp } from '../utils/otpStore.js';

// Register Controller
export const handleRegister = async (req, res) => {
    try {
        const { email, password, confirmPassword, gardenName } = req.body || {};
        if (![email, password, confirmPassword].every(Boolean)) {
            return sendResponse(res, "Required fields are missing", false, 400);
        }

        // Schema validation using Joi
        const result = await authSchema.validateAsync(req.body);

        // Read existing user data from JSON file
        const data = await readJsonFile('registeredUser.json');
        //check if user already exist
        if (Object.values(data).some(user => user.email === result.email.toLowerCase())) {
            return sendResponse(res, "User Already Exists", false, 409);
        }

        const hashedPassword = await getHashedPassword(result.password);
        if (!hashedPassword) return sendResponse(res, "Password hashing failed. Please try again.", false, 500);

        // Create new user object with a unique ID
        const newUser = {
            id: uuidv4(),
            email: result.email.toLowerCase(),
            password: hashedPassword,
            ...(result.gardenName && { gardenName })
        };

        // Add new user to the data object with ID as key
        data[newUser.id] = newUser;
        await writeData('registeredUser.json', data);

        return sendResponse(res, "User Registered Successfully", true, 200);
    } catch (error) {
        console.log("register error: ", error)
        // Joi Validation Error Handling
        if (error.isJoi) return sendResponse(res, error.details[0].message, false, 400);
        sendResponse(res, "Server Error", false, 500);
    }
}

// Login Controller
export const handleLogin = async (req, res) => {
    try {
        let { email, password } = req.body || {};
        if (![email, password].every(Boolean)) return sendResponse(res, "Required fields are missing", false, 400);

        // Read existing user data from JSON file
        const data = await readJsonFile('registeredUser.json');
        // Find user by email
        const user = Object.values(data).find(user => user.email === email.toLowerCase());
        if (!user) return sendResponse(res, "User not exist signup first", false, 400);

        // Compare given password with hashed password
        const match = await bcrypt.compare(password, user.password);
        let token;
        if (match) {
            // If password matches, generate JWT token
            const payload = { id: user.id };
            token = await createToken(payload);

            // Exclude password from response data
            const { password, ...data } = user;
            return sendResponse(res, "Login Successfull", true, 200, data, token);
        }
        // Password does not match
        sendResponse(res, "Incorrect Password", false, 400);

    } catch (error) {
        console.log("login error: ", error)
        sendResponse(res, "Server Error", false, 500);
    }
}

// Verify Email Controller
export const handleVerifyEmail = async (req, res) => {
    try {
        let { email } = req.body || {};
        if (!email) return sendResponse(res, "No data received", false, 400);

        // Read existing user data from JSON file
        const data = await readJsonFile('registeredUser.json');
        const user = Object.values(data).find(user => user.email === email);
        if (!user) return sendResponse(res, "User does not exist", false, 400);

        //Generate the otp and send it to the mail
        const otp = await sendEmail(email);
        setOtp(email, otp);
        return sendResponse(res, "OTP sent to your email", true, 200);

    } catch (error) {
        console.log("verify email error: ", error)
        sendResponse(res, "Otp sent failed", false, 500);
    }
}

// Verify Otp Controller
export const handleVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body || {};
        if (![email, otp].every(Boolean)) return sendResponse(res, "Email and OTP are required", false, 400);
        const storedOtp = getOtp(email);
        if (!storedOtp) return sendResponse(res, "Otp has expired", false, 400);

        // Normalize and compare OTPs
        if (otp.toString().trim() === storedOtp.toString().trim()) {
            return sendResponse(res, "OTP verified successfully", true, 200);
        }
        return sendResponse(res, "Invalid Otp", false, 400);
    } catch (error) {
        console.log("verify otp error: ", error)
        sendResponse(res, "Unable to verify OTP", false, 500);
    }
}

// Change Password controller
export const handleChangePassword = async (req, res) => {
    try {
        const { password, email } = req.body || {};
        if (![password, email].every(Boolean)) return sendResponse(res, "Password and email are required", false, 400);

        // Schema validation using Joi
        const result = await changePasswordSchema.validateAsync(req.body);

        //Read user data
        const data = await readJsonFile('registeredUser.json');
        const userId = Object.keys(data).find(id => data[id].email === email);

        if (!userId) {
            return sendResponse(res, "User not found", false, 404);
        }
        
        const oldHashedPassword = data[userId].password;
        const isSamePassword = await bcrypt.compare(password, oldHashedPassword);
        if (isSamePassword) {
            return sendResponse(res, "New password cannot be same as the old password", false, 400);
        }

        //Hash new password
        const hashedPassword = await getHashedPassword(password);
        if(!hashedPassword) return sendResponse(res,"Password hashing failed",false,500);
        
        //Update password
        data[userId].password = hashedPassword;
        await writeData('registeredUser.json',data);

        return sendResponse(res, "Password changed successfully", true, 200);
    } catch (error) {
        console.log("change password error: ", error);
        if (error.isJoi) return sendResponse(res, error.details[0].message, false, 400);
        sendResponse(res, "Unable to change password", false, 500);
    }
}