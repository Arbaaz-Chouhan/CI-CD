import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, loginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async regsiter(createUserDto: CreateUserDto, res: Response) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      username: createUserDto.username,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = this.authService.generateTokens({ sub: savedUser.id });
    savedUser.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.save(savedUser);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ message: 'User registered successfully', success: true });
  }

  async login(dto: loginDto, res: Response) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.generateTokens({ sub: user.id });
    user.refreshToken = await bcrypt.hash(token.refreshToken, 10);
    await this.userRepository.save(user);

    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: 'User logged in successfully', success: true });
  }

  async logout(userId, res: Response) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res
      .status(200)
      .json({ message: 'User logged out successfully', success: true });
  }
}
