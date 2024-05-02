import AuthMiddleware from './AuthMiddleware.js';
import RoleMiddleware from './RoleMiddleware.js';

export default function AccessMiddleware(roles = ["Quest", "User", "Admin"]) {
    return async function (req, res, next) {
        const isQuestAllowed = roles.includes("Quest");
        const authMiddleware = await AuthMiddleware(isQuestAllowed);
        await authMiddleware(req, res, async () => {
            const roleMiddleware = await RoleMiddleware(roles);
            await roleMiddleware(req, res, next);
        });
        return;
    };
}
