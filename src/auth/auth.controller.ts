import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger: Logger = new Logger('AuthController');

  @Post('/register')
  register(
    @Body() registerDto: RegisterRequestDTO,
  ): Promise<{ token: string }> {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginRequestDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('/profile')
  @UseGuards(AuthGuard())
  async getProfile(@Req() req): Promise<{ email: string }> {
    return this.authService.getUserProfile(req.user._id);
  }

  @ApiBearerAuth()
  @Put('/profile')
  @UseGuards(AuthGuard())
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<{ email: string }> {
    return this.authService.updateUserProfile(req.user._id, updateUserDto);
  }
}
