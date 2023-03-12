import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/Domains/user/Business/user.module';
import { PhotoModule } from 'src/Domains/photo/Busines/photo.module';
import { FileModule } from 'src/Domains/file/Busines/file.module';
import { AssignmentModule } from 'src/Domains/assignment/Business/assignment.module';
import { ContractorModule } from 'src/Domains/contractor/Business/contractor.module';
import { CategoryModule } from 'src/Domains/category/Business/category.module';
import { TagModule } from 'src/Domains/tag/Business/tag.module';
import { AuthModule } from 'src/Domains/auth/auth.module';
import { ServiceModule } from 'src/Domains/service/Business/service.module';
import dbConfiguration from "../configs/orm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database')
      }),
    }),
    UserModule,
    PhotoModule,
    FileModule,
    AssignmentModule,
    ServiceModule,
    ContractorModule,
    CategoryModule,
    TagModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
