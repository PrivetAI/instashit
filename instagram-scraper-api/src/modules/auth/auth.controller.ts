import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to Instagram' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @Get('session')
  @ApiOperation({ summary: 'Get current session' })
  async getSession() {
    const session = await this.authService.getCurrentSession();
    if (!session) {
      return { active: false };
    }
    return {
      active: true,
      username: session.username,
      lastUsed: session.updatedAt,
    };
  }
}