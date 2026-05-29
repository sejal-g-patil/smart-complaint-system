const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    const userRole = (req.user.role || "").toLowerCase().trim();

    const allowedRoles = roles.map(r =>
      r.toLowerCase().trim()
    );

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;