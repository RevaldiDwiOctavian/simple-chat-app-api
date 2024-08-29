import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDTO } from './dto/register.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterRequestDTO): Promise<{ token: string }> {
    const { name, email, password } = registerDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return { token };
  }

  async login(loginDto: LoginRequestDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return {
      access_token: token,
    };
  }

  async getUserProfile(userId: string): Promise<{ email: string }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    return {
      email: user.email,
    };
  }

  async updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return user.save();
  }
}
