import Joi from 'joi';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constant.js';

// Joi schema for validating user registration inputs
const authSchema = Joi.object({
    email: Joi.string()                 // Validate email format
        .pattern(new RegExp(EMAIL_REGEX))
        .required()
        .messages({
            'string.pattern.base': 'Invalid email format',
            'string.empty': 'Email is required',
        }),

    password: Joi.string()              // Validate password strength
        .pattern(new RegExp(PASSWORD_REGEX))
        .required()
        .messages({
            'string.pattern.base': 'Password must be 8-20 characters with uppercase, lowercase, digit, and special character',
            'string.empty': 'Password is required',
        }),

    confirmPassword: Joi.valid(Joi.ref('password'))         // Must match the password field
        .required()
        .messages({
            'any.only': "Passwords don't match",
            'any.required': 'Confirm password is required',
        }),

    gardenName: Joi.string().allow('').optional(),          // Optional garden name field
});

export default authSchema;
