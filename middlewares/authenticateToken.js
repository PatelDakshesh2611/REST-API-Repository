import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  jwt.verify(token,"Dakshesh_Patel", (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: 'Token is not valid' });
    }
    req.user = user;
    next();
  });
};