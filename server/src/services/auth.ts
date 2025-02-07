import jwt from 'jsonwebtoken';

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    req.user = data;
    return req;
  } catch (err) {
    console.log('Invalid token');
    return req;
  }
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, process.env.JWT_SECRET_KEY || '', { expiresIn: '2hr' });
};

export default signToken;