const validateUser = (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const path = req.path;

        const nameRegex = /^[A-Za-z\s.]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

        if (path === '/user/login') {
            if (!email || !password) {
                throw Object.assign(Error("Please provide both email and password"), { code: 400 });
            }
            if (!emailRegex.test(email)) {
                throw Object.assign(Error("Please provide a valid email"), { code: 400 });
            }
        } else if (path === '/user/register') {
            if (!name || !email || !password || !confirmPassword) {
                throw Object.assign(Error("Please provide all required fields"), { code: 400 });
            }
            if (!nameRegex.test(name)) {
                throw Object.assign(Error("Please provide a valid name"), { code: 400 });
            }
            if (!emailRegex.test(email)) {
                throw Object.assign(Error("Please provide a valid email"), { code: 400 });
            }
            if (!passRegex.test(password)) {
                throw Object.assign(Error("Password must be at least 6 characters long, with one number, one letter and one special character"), { code: 400 });
            }
            if (password !== confirmPassword) {
                throw Object.assign(Error("Password and confirm password must match"), { code: 400 });
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = validateUser;