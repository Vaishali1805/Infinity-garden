// import cors from 'cors';

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true // if you are sending cookies or authentication
// }));


import { getHashedPassword, readJsonFile, writeData, sendResponse } from "../utils/helper.js";

export const handleChangePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body || {};

        // Check required fields
        if (![email, newPassword, confirmPassword].every(Boolean)) {
            return sendResponse(res, "Email, new password, and confirm password are required", false, 400);
        }

        // Check password match
        if (newPassword !== confirmPassword) {
            return sendResponse(res, "Passwords do not match", false, 400);
        }

        // Read user data
        const data = await readJsonFile('registeredUser.json');
        const userId = Object.keys(data).find(id => data[id].email === email);

        if (!userId) {
            return sendResponse(res, "User not found", false, 404);
        }

        // Hash new password
        const hashedPassword = await getHashedPassword(newPassword);
        if (!hashedPassword) {
            return sendResponse(res, "Password hashing failed", false, 500);
        }

        // Update password
        data[userId].password = hashedPassword;
        await writeData('registeredUser.json', data);

        return sendResponse(res, "Password changed successfully", true, 200);
    } catch (error) {
        console.log("change password error: ", error);
        sendResponse(res, "Unable to change password", false, 500);
    }
};


import Joi from 'joi';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constant.js';

// 🔁 Reusable password rule
const passwordRule = Joi.string()
  .pattern(new RegExp(PASSWORD_REGEX))
  .required()
  .messages({
    'string.pattern.base': 'Password must be 8-20 characters with uppercase, lowercase, digit, and special character',
    'string.empty': 'Password is required',
  });

// 🔁 Reusable confirm password rule (takes password ref)
const confirmPasswordRule = (ref = 'password') =>
  Joi.valid(Joi.ref(ref))
    .required()
    .messages({
      'any.only': "Passwords don't match",
      'any.required': 'Confirm password is required',
    });


    export const authSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(EMAIL_REGEX))
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
  password: passwordRule,
  confirmPassword: confirmPasswordRule(),
  gardenName: Joi.string().allow('').optional(),
});


export const changePasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(EMAIL_REGEX))
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
  newPassword: passwordRule.label('New Password'),
  confirmPassword: confirmPasswordRule('newPassword'),
});


const result = await changePasswordSchema.validateAsync(req.body);

export {
  authSchema,
  changePasswordSchema,
  passwordRule, // optional if needed elsewhere
  confirmPasswordRule // optional
};
