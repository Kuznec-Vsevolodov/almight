import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PhotoModule } from 'src/Domains/photo/Busines/photo.module';
import { FileModule } from 'src/Domains/file/Busines/file.module';
import { AssignmentModule } from 'src/Domains/assignment/Business/assignment.module';
import { CourseModule } from './course/course.module';
import { ContractorModule } from 'src/Domains/contractor/Business/marathon.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
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
    CourseModule,
    ContractorModule,
    CategoryModule,
    TagModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
