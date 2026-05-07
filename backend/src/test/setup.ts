import "reflect-metadata"

process.env.NODE_ENV = "test"
process.env.JWT_SECRET = "test_secret_with_at_least_32_characters_xx"
process.env.DATABASE_URL = "file:./test.db"
process.env.CORS_ORIGIN = "http://localhost:5173"
process.env.BCRYPT_COST = "10"
process.env.LOG_LEVEL = "silent"
