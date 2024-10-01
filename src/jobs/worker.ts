import { exec } from 'child_process'
import * as cron from 'node-cron'
import { promisify } from 'util'
import { autoCleanTrainingJob } from '../jobs/auto-clean-training'

export function getIsoDate() {
  return new Date().toISOString().replace('T', '_').split('.')[0].replace(/:/g, '-')
}

const execAsync = promisify(exec)

// Dump
cron.schedule('*/5 * * * * *', async () => {
  try {
    const timestamp = getIsoDate()
    const dumpFileName = `backup_${timestamp}.sql`
    const command = `pg_dump -U ${process.env.POSTGRES_USER} -h ${process.env.POSTGRES_HOST} -p ${5432} -d ${process.env.POSTGRES_DB} -f ${dumpFileName}`

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('Erreur lors du dump PostgreSQL:', stderr)
    } else {
      console.log('Dump PostgreSQL réussi:', stdout)
    }
  } catch (error) {
    console.error('Erreur lors de l\'exécution du dump PostgreSQL:', error)
  }
})

// Clean
cron.schedule('*/5 * * * * *', async () => {
  await autoCleanTrainingJob()
})

// import { Client } from 'pg'
// const connectionString = process.env.DATABASE_URL
// cron.schedule('* * * * * *', async () => {
//   try {
//     const client = new Client({
//       connectionString
//     })
//     client.connect()
//     const result = await client.query('SELECT * FROM user')
//     console.log('Résultat de la requête:', result.rows)
//     client.end()
//   } catch (error) {
//     console.error('Erreur lors de la requête:', error)
//   }
// })
