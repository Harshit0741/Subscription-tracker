import { config } from "dotenv";
import process from "process";


config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT, SERVER_URL,
    NODE_ENV,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    AR_KEY, AR_ENV,
    QSTASH_URL, QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY,
    EMAIL_PASS
} = process.env;