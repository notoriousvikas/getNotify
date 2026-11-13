import { AppError } from "./error.middleware";

export const isEmailVerified = (req, res, next) => {
    if (!req.user.isEmailVerified) {
        throw new AppError("Please verify your email", 403);
    }

    next();
};
