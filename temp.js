const result = validateData(newUser);
if (!result) return sendResponse(res, "Validation failed", false, 400);

export const handleLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return sendResponse(res, "Data Not Found", false, 400);

        const result = validateData({ email, password });
        if (!result) return sendResponse(res, "Validation failed", false, 400);

        const data = await readJsonFile('registeredUsers.json');
        const user = Object.values(data).find(user => user.email === email);
        if (!user) return sendResponse(res, "User not Exist Signup first", false, 400);

        const match = await bcrypt.compare(password, user.password);
        let token;
        if (match) {
            const payload = {
                id: user.id
            }
            token = await createToken(payload);
            // Cookies.set('token',token, {
            //     secure: true,
            //     httpOnly: true,
            //     maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
            // })
            const { password, ...data } = user;
            return sendResponse(res, "Login Successfull", true, 200, data, token);
        }
        sendResponse(res, "Incorrect Password", false, 400);
    } catch (error) {
        // console.log("login error: ", error)
        sendResponse(res, "Server Error", false, 500);
    }
}