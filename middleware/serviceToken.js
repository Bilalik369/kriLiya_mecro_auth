


export const verifyServiceToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token);
  if (!token || token !== process.env.SERVICE_TOKEN) {
    return res.status(401).json({ message: "Unauthorized service" });
  }
  next();
};
