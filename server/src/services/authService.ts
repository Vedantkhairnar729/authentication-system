import bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateToken } from '../utils/jwt';

export const registerUser = async (email: string, username: string, password: string) => {
  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already registered');
    }
    if (existingUser.username === username) {
      throw new Error('Username already taken');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    email,
    username,
    password: hashedPassword
  });

  // Generate token
  const token = generateToken({ userId: (newUser._id as any).toString(), email: newUser.email });

  return {
    user: { 
      id: (newUser._id as any).toString(), 
      email: newUser.email, 
      username: newUser.username 
    },
    token
  };
};

export const loginUser = async (email: string, password: string) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken({ userId: (user._id as any).toString(), email: user.email });

  return {
    user: { 
      id: (user._id as any).toString(), 
      email: user.email, 
      username: user.username 
    },
    token
  };
};
