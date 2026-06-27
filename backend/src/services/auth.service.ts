import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { config } from '../config';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors';
import logger from '../utils/logger';

export class AuthService {
  // Generate access token
  static generateAccessToken(user: { id: string; email: string; role: string }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as string }
    );
  }

  // Generate refresh token and store in DB
  static async generateRefreshToken(userId: string): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: { token, expiresAt, userId },
    });

    return token;
  }

  // Register
  static async register(data: { name: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const verifyToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        verifyToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    // Create default categories for the user
    await this.createDefaultCategories(user.id);

    logger.info(`User registered: ${user.email}`);

    return { user, accessToken, refreshToken, verifyToken };
  }

  // Login
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await this.generateRefreshToken(user.id);

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'LOGIN',
        details: { ip: 'unknown' },
        userId: user.id,
      },
    });

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        currency: user.currency,
        timezone: user.timezone,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh token
  static async refreshAccessToken(refreshTokenValue: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenValue },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError('Refresh token expired');
    }

    // Rotate: delete old, create new
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const accessToken = this.generateAccessToken(storedToken.user);
    const newRefreshToken = await this.generateRefreshToken(storedToken.user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Verify email
  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (!user) {
      throw new BadRequestError('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null },
    });

    logger.info(`Email verified: ${user.email}`);
    return { message: 'Email verified successfully' };
  }

  // Forgot password
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = uuidv4();
    const resetTokenExp = new Date();
    resetTokenExp.setHours(resetTokenExp.getHours() + 1); // 1 hour expiry

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    // TODO: Send email with reset link using Nodemailer
    logger.info(`Password reset requested: ${user.email}, token: ${resetToken}`);

    return { message: 'If the email exists, a reset link has been sent', resetToken };
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    logger.info(`Password reset: ${user.email}`);
    return { message: 'Password reset successfully' };
  }

  // Logout - invalidate refresh token
  static async logout(refreshTokenValue: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshTokenValue },
    });
    return { message: 'Logged out successfully' };
  }

  // Create default categories for new users
  private static async createDefaultCategories(userId: string) {
    const expenseCategories = [
      { name: 'Food & Dining', icon: '🍔', color: '#ef4444' },
      { name: 'Transportation', icon: '🚗', color: '#f97316' },
      { name: 'Shopping', icon: '🛍️', color: '#eab308' },
      { name: 'Entertainment', icon: '🎬', color: '#84cc16' },
      { name: 'Bills & Utilities', icon: '💡', color: '#22c55e' },
      { name: 'Health', icon: '🏥', color: '#14b8a6' },
      { name: 'Education', icon: '📚', color: '#06b6d4' },
      { name: 'Travel', icon: '✈️', color: '#3b82f6' },
      { name: 'Subscriptions', icon: '📱', color: '#6366f1' },
      { name: 'Groceries', icon: '🛒', color: '#8b5cf6' },
      { name: 'Rent', icon: '🏠', color: '#a855f7' },
      { name: 'Insurance', icon: '🛡️', color: '#d946ef' },
      { name: 'Personal Care', icon: '💅', color: '#ec4899' },
      { name: 'Other', icon: '📦', color: '#6b7280' },
    ];

    const incomeCategories = [
      { name: 'Salary', icon: '💰', color: '#22c55e' },
      { name: 'Freelancing', icon: '💻', color: '#3b82f6' },
      { name: 'Investments', icon: '📈', color: '#6366f1' },
      { name: 'Business', icon: '🏢', color: '#f97316' },
      { name: 'Rental Income', icon: '🏠', color: '#14b8a6' },
      { name: 'Other Income', icon: '💵', color: '#6b7280' },
    ];

    const categoryData = [
      ...expenseCategories.map((c) => ({
        ...c,
        type: 'EXPENSE' as const,
        isDefault: true,
        userId,
      })),
      ...incomeCategories.map((c) => ({
        ...c,
        type: 'INCOME' as const,
        isDefault: true,
        userId,
      })),
    ];

    await prisma.category.createMany({ data: categoryData });
  }
}
