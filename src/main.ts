import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as dotenv from "dotenv";
import helmet from "helmet"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
var morgan = require('morgan')

dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.use(morgan('dev'))
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted :true 
  }))
  app.enableVersioning({
    type: VersioningType.URI,
  })
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.APP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
