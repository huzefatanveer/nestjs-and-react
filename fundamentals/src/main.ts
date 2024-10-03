import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Allow your React frontend
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  //app.use('/orders/webhook', bodyParser.raw({ type: 'application/json' }));
  

  await app.listen(3000);

}
bootstrap();
