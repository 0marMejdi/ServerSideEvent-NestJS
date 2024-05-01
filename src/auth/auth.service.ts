import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRoleEnum } from '../enums/user-role.enum';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(userData: RegisterUserDto) {
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException(
        `Le username et le password doivent etre uniques`,
      );
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
    };
  }
  async login(credentials: LoginUserDto) {
    const { username, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username or user.email= :username', { username })
      .getOne();
    console.log(user);
    if (!user) {
      throw new NotFoundException('username ou password erronée');
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword == user.password) {
      const payload = {
        username: user.username,
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        'access Token': jwt,
      };
    } else {
      throw new NotFoundException('username ou password erronée');
    }
  }
  isOwnerOrAdmin(object, user) {
    return (
      user.role === UserRoleEnum.ADMIN ||
      (object.user && object.user.id === user.id)
    );
  }
}
