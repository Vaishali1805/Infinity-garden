import Joi from 'joi';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constant.js';

const passwordRule = Joi.string()              // Validate password strength
    .pattern(new RegExp(PASSWORD_REGEX))
    .required()
    .messages({
        'string.pattern.base': 'Password must be 8-20 characters with uppercase, lowercase, digit, and special character',
        'string.empty': 'Password is required',
    })

const confirmPasswordRule = (ref = 'password') =>
    Joi.valid(Joi.ref('password'))         // Must match the password field
        .required()
        .messages({
            'any.only': "Passwords don't match",
            'any.required': 'Confirm password is required',
        })

const emailRule = Joi.string()                 // Validate email format
        .pattern(new RegExp(EMAIL_REGEX))
        .required()
        .messages({
            'string.pattern.base': 'Invalid email format',
            'string.empty': 'Email is required',
        })

// Joi schema for validating user registration inputs
export const authSchema = Joi.object({
    email: emailRule,
    password: passwordRule,
    confirmPassword: confirmPasswordRule,
    gardenName: Joi.string().allow('', null).optional(),          // Optional garden name field
});

// Joi schema for validating password and confirm password
export const changePasswordSchema = Joi.object({
    email: emailRule,
    password: passwordRule,
});