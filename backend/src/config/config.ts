import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_round: process.env.SALT_ROUND,
  anonymous_user_uid: process.env.ANONYMOUS_USER_UID,
  admin_uid: process.env.ADMIN_UID,
};
