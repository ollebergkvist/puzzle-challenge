export const validateBody = (schema) => {
  return (req, res, next) => {
    const validatedBody = schema.safeParse(req.body);

    if (!validatedBody.success) {
      return res.status(400).json({ message: validatedBody.error });
    }

    next();
  };
};
