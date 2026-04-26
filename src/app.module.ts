import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('NODE_ENV')! === 'test'
            ? configService.get<string>('MONGODB_URI_TEST')
            : configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
