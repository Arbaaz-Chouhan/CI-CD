import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, loginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('regsiter')
  regsiter(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.regsiter(createUserDto, res);
  }

  @Post('login')
  login(@Body() dto: loginDto, @Res() res: Response) {
    return this.usersService.login(dto, res);
  }

  @Post('logout')
  logout(@Req() req, @Res() res: Response) {
    const userId = req.sub;
    return this.usersService.login(userId, res);
  }
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
