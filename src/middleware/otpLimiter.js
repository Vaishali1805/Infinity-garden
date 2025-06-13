import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute window
  max: 1,                     // Limit to 1 OTP request per minute
  message: {
    success: false,
    message: 'OTP already sent. Please wait before requesting again.',
  },
  keyGenerator: (req, res) => req.body.email || req.ip, // Identify users by email
  skipFailedRequests: true   // Only count successful requests
});
