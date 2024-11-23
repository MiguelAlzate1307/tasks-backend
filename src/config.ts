import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  database: {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    pass: process.env.DBPASS,
    name: process.env.DBNAME,
  },
  jwt: {
    secret: process.env.SECRET_JWT,
    expires: process.env.EXPIRES_IN,
  },
}));
