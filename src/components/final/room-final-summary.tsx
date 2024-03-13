import { getRoomFinalScoreQuery } from '@/actions/queries'
import { RoomFinalRetry } from '@/components/final/room-final-retry'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, CheckCheck, XCircle } from 'lucide-react'

type RoomFinalSummaryProps = {
  roomId: string,
  shareLink?: string,
  canRetry: boolean
}

export async function RoomFinalSummary({roomId, shareLink, canRetry} : RoomFinalSummaryProps) {
  const stats = await getRoomFinalScoreQuery(roomId)

  return(
    <section className="container">
      <div className="mb-5 space-y-2">
        <h1 className="text-3xl font-bold">Answers Summary</h1>
        <p className="text-sm leading-none tracking-wide text-gray-500">Room #{roomId}</p>
        {canRetry && <RoomFinalRetry roomId={roomId} shareLink={shareLink} />}
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="p-0">
            <div className="flex items-center space-x-4 p-4">
              <Award className="size-6" />
              <div className="space-y-2">
                <CardTitle className="text-base font-semibold">Score</CardTitle>
                <CardDescription className="text-sm leading-none">{stats.score}%</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <div className="flex items-center space-x-4 p-4">
              <CheckCheck className="size-6" />
              <div className="space-y-2">
                <CardTitle className="text-base font-semibold">Success</CardTitle>
                <CardDescription className="text-sm leading-none">{stats.success}/{stats.count}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <div className="flex items-center space-x-4 p-4">
              <XCircle className="size-6" />
              <div className="space-y-2">
                <CardTitle className="text-base font-semibold">Failed</CardTitle>
                <CardDescription className="text-sm leading-none">{stats.failed}/{stats.count}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

    </section>
  )
}
