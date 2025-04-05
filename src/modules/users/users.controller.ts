import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { messagesConstant } from 'src/common/constants/messages.constant';
import { HttpStatus } from 'src/common/constants/statusCode.constant';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role/role.service';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const role = await this.roleService.getOneById(createUserDto.roleId);
    if (!role) {
      throw new BadRequestException({
        message : messagesConstant.INVALID_ROLE_ID,
        statusCode : HttpStatus.BAD_REQUEST
      });
    }
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException({
        message : messagesConstant.USER_ALREADY_EXISTS,
        statusCode : HttpStatus.CONFLICT
      });
    }
    await this.usersService.create(createUserDto);
    return {
      message: messagesConstant.ADD_USER_RESPONSE,
      statusCode : HttpStatus.OK
    };
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  async findAll(@Query() queryParams: FindAllUsersDto) {
    const { page } = queryParams;
    const result = await this.usersService.findAll(page);
    return {
      result,
      message: messagesConstant.USERS_FETCHED,
      statusCode : HttpStatus.OK
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        message:messagesConstant.USER_NOT_FOUND,
        statusCode : HttpStatus.NOT_FOUND
      });
    }
    return {
      message: messagesConstant.USER_FETCHED,
      statusCode : HttpStatus.OK,
      result: user,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        message : messagesConstant.USER_NOT_FOUND,
        statusCode : HttpStatus.NOT_FOUND
      });
    }
    if (updateUserDto.roleId) {
      const role = await this.roleService.getOneById(updateUserDto.roleId);
      if (!role) {
        throw new BadRequestException({
          message : messagesConstant.INVALID_ROLE_ID,
          statusCode : HttpStatus.BAD_REQUEST
        });
      }
    }
    await this.usersService.update(id, updateUserDto);
    return {
      message: messagesConstant.USER_UPDATED,
      statusCode : HttpStatus.OK
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        message: messagesConstant.USER_NOT_FOUND,
        statusCode : HttpStatus.NOT_FOUND 
      });
    }
    await this.usersService.remove(id);
    return {
      message: messagesConstant.USER_DELETED,
      statusCode : HttpStatus.OK
    };
  }
}
