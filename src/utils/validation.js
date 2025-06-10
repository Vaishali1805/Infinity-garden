import Joi from 'joi';

const authSchema = Joi.object({
    email: Joi.string()
        .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        .required()
        .messages({
            'string.pattern.base': 'Invalid email format',
            'string.empty': 'Email is required',
        }),

    password: Joi.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/))
        .required()
        .messages({
            'string.pattern.base': 'Password must be 8-20 characters with uppercase, lowercase, digit, and special character',
            'string.empty': 'Password is required',
        }),

    confirmPassword: Joi.valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': "Passwords don't match",
            'any.required': 'Confirm password is required',
        }),

    gardenName: Joi.string().allow('').optional(),
});

export default authSchema;
