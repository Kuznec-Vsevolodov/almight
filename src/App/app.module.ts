import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PhotoModule } from './photo/photo.module';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { CourseModule } from './course/course.module';
import { MarathonModule } from './marathon/marathon.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import dbConfiguration from "./configs/orm.config";

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
    PostModule,
    CourseModule,
    MarathonModule,
    CategoryModule,
    TagModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
