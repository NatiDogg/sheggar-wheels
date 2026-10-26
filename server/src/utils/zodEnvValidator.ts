import {z} from 'zod'
import {config} from 'dotenv'
config()

export const envSchema = z.object({
      PORT: z.string().min(3) ,
     DATABASE_URL: z.string().min(6),
})

export const validate = (config:Record<string, unknown>)=>{
      return envSchema.parse(config)
}

export const env = envSchema.parse(process.env)
export type envConfig = z.infer<typeof envSchema>
