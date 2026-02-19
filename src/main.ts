import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Server } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Parctice API')
    .setDescription('API documentation for Demo project')
    .setVersion('1.0')
    .addTag('Demo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, document);
  }

  const port = Number(process.env.PORT ?? 3000);

  // ✅ IMPORTANT: server reference capture karo
  const server: Server = await app.listen(port, '0.0.0.0');

  // ✅ GRACEFUL SHUTDOWN → YAHI TERA MAIN FIX HAI
  const closeApp = async () => {
    console.log('🔥 Closing server properly...');
    await new Promise((resolve) => server.close(resolve));
    process.exit(0);
  };

  process.on('SIGTERM', closeApp);
  process.on('SIGINT', closeApp);
}

bootstrap();
