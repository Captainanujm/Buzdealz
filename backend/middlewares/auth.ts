export const authMiddleware = (req: any, res: any, next: any) => {
  req.user = {
    id: "11111111-1111-4111-8111-111111111111",
    role: "free",
  };
  next();
};
