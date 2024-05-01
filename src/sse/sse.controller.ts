// sse.controller.ts

import { Controller, Get, Req, Res, Sse, UseGuards } from '@nestjs/common';
import { SseService } from './sse.service';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
//swagger
@ApiTags('sse')

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  
  @Get('cvs')
  @UseGuards(JwtAuthGuard)
  async streamCvEvents(@Req() req, @Res() res,@User() user) {
    const clientId = user.id;
    const client$ = this.sseService.addClient(clientId);
    console.log('client$:',client$, "contolleerrrrrr");

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    client$.subscribe((data) => {
      res.write(data);
    });

    req.on('close', () => {
      this.sseService.removeClient(clientId);
      res.end();
    });
    return res;
  }
}

