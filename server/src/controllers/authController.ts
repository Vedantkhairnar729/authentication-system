import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);
    
    const { user, token } = await registerUser(email, username, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const { user, token } = await loginUser(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(401).json({ error: (error as Error).message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};
