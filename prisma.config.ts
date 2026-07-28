import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const url = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

export default defineConfig({
  datasource: {
    url,
  },
  migrate: {
    async adapter() {
      const pool = new pg.Pool({ connectionString: url })
      return new PrismaPg(pool)
    },
  },
})
