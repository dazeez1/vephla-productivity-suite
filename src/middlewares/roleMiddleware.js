/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access based on user roles
 * 
 * @param {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * Usage:
 *   router.get('/admin-only', authMiddleware, authorizeRoles('admin'), controller);
 *   router.post('/admin-or-standard', authMiddleware, authorizeRoles('admin', 'standard'), controller);
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if req.user exists (authentication middleware should run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication required.",
      });
    }

    // Get user role from request object
    const userRole = req.user.role;

    // Check if user role is in the allowed roles list
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to perform this action.",
      });
    }

    // User has required role, proceed to next middleware or route handler
    next();
  };
};

module.exports = authorizeRoles;

