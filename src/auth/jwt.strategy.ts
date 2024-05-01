import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from "dotenv"
import { PayloadInterface } from './interfaces/payload.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.secret,
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.userRepository.findOne({where:{ id: payload.id}})
    console.log("in validate",user)
    if(user){
        const {password, salt,...result}=user;
        return result
    }
    else{
        throw new UnauthorizedException();
    }
  }
}