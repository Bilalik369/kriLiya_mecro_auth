import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }


    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const adminMiddleware = async(req ,  res, next)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json({
            success : false,
            msg : "Access denied. Admin only."
        })
    }
    next()
}
