import { exec } from 'child_process'
import * as cron from 'node-cron'
import { promisify } from 'util'
import { autoCleanTrainingJob } from '../jobs/auto-clean-training'

export function getIsoDate() {
  return new Date().toISOString().replace('T', '_').split('.')[0].replace(/:/g, '-')
}

const execAsync = promisify(exec)

// Dump
cron.schedule('*/10 * * * * *', async () => {
  try {
    const dumpFileName = `/backups/backup_${getIsoDate()}.sql`
    const command = `pg_dump -d ${process.env.DATABASE_URL} -f ${dumpFileName}`
    const { stdout, stderr } = await execAsync(command)
    console.log(getIsoDate(), 'Dump Completed', stdout, stderr)
  } catch (error) {
    console.error(getIsoDate(), 'Dump error:', error)
  }
})

// Clean
cron.schedule('*/5 * * * * *', async () => {
  try{
    const result =  await autoCleanTrainingJob()
    console.log(getIsoDate(), 'Training Rooms deleted:', result)
  } catch (error) {
    console.error(getIsoDate(), 'Delete Room Error:', error)
  }
})
