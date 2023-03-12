import { registerAs } from "@nestjs/config";

export default registerAs('database', () => {
    return {
        type: process.env.TYPEORM_DATABASE_TYPE,
        host: process.env.TYPEORM_DATABASE_HOST,
        port: process.env.TYPEORM_DATABASE_PORT,
        username: process.env.TYPEORM_DATABASE_USER,
        password: process.env.TYPEORM_DATABASE_PASSWORD,
        database: process.env.TYPEORM_DATABASE_DATABASE,
        entities: ['dist/Domains/**/**/**/*.entity{.d.ts,.js}'],
        synchronize: process.env.TYPEORM_DATABASE_SYNCHRONIZE
    }
})