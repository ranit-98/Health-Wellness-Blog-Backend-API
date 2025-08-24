import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { IUser } from '@/types';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: Partial<IUser>) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email!);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password!);

    // Create user
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      bookmarks: []
    });

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}