import { Controller, Delete, Get, Patch } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getUser() {
    return { message: 'Hello, User!' };
  }

  @Get(':id')
  getUserById() {
    return { message: 'Hello, User by ID!' };
  }

  @Get('me')
  getCurrentUser() {
    return { message: 'Hello, Current User!' };
  }

  @Patch('me')
  updateCurrentUser() {
    return { message: 'User updated!' };
  }

  @Delete('me')
  deleteCurrentUser() {
    return { message: 'User deleted!' };
  }

  @Patch(':id')
  updateUserById() {
    return { message: 'User updated by ID!' };
  }

  @Delete(':id')
  deleteUserById() {
    return { message: 'User deleted by ID!' };
  }
}
