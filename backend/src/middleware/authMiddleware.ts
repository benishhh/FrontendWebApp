import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header("Authorization")

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, error: {
                code: 401,
                message: "Invalid authorization header",
            }});
    }

    const token = authorizationHeader.replace("Bearer ", "");
    if (!token) {
        return res
            .status(401)
            .json({ success: false, error: {
                    code: 401,
                    message: "Invalid authorization header",
            }});
    }

    try {
        const decoded = jwt.verify(token, String(process.env['JWTSecretKey']));
        (req as any).user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res
            .status(401)
            .json({ success: false, error: {
                    code: 401,
                    message: "Invalid authorization header",
            }});
    }
};
export default authMiddleware;