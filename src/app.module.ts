import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/db';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PWD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User],
        synchronize: true,
        dropSchema: true,
      }),
    }),
  ],
})
export class AppModule {}
