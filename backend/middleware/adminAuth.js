import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        let authorized = false;
        if (typeof token_decode === 'string') {
            // Legacy token format: email+password string
            authorized = (token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
        } else {
            // New token format: object payload
            authorized = (token_decode.email === process.env.ADMIN_EMAIL && token_decode.role === 'admin');
        }
        if (!authorized) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        next();
    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(401).json({
            success: false,
            message: error.message || "Authentication failed"
        });
    }
}

export default adminAuth;