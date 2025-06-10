// utils/otpStore.js
const otpMap = new Map();

export function setOtp(email, otp) {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    otpMap.set(email, { otp, expiresAt });
}

export function getOtp(email) {
    const entry = otpMap.get(email);
    console.log("entry: ",entry);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
        otpMap.delete(email); // Expired — clean it up
        return null;
    }

    return entry.otp;
}

export function deleteOtp(email) {
    otpMap.delete(email);
}