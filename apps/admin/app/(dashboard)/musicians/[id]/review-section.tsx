import {
  TStatusAction,
  IMusician,
  IPendingMusiciansResponse,
  IPendingStatisticsResponse,
} from '@/lib/interfaces'
import { reviewService } from '@/services'
import { useToast, Flex, Heading, HStack, Button } from '@chakra-ui/react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface IReviewSectionProps {
  isUpdate: boolean
  musicianId: string
}

type TData = { message: string }
type TVariables = { id: string; action: TStatusAction }
type TContext =
  | {
      musician: IMusician | undefined
      pendingMusicians: IPendingMusiciansResponse | undefined
      stats: IPendingStatisticsResponse | undefined
    }
  | undefined

export default function ReviewSection({
  isUpdate,
  musicianId,
}: IReviewSectionProps) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const toast = useToast({
    position: 'top',
  })

  const reviewMutation = useMutation<TData, Error, TVariables, TContext>({
    mutationFn: ({ id, action }) =>
      reviewService.updateMusicianStatus(id, action),

    onMutate: ({ id, action }) => {
      const musician = queryClient.getQueryData<IMusician>([`musician/${id}`])

      const pendingMusicians =
        queryClient.getQueryData<IPendingMusiciansResponse>([
          'pending-musicians',
        ])

      const stats = queryClient.getQueryData<IPendingStatisticsResponse>([
        'pending-statistics',
      ])

      if (musician && stats && pendingMusicians) {
        let nextMusician = {
          ...musician,
        }

        if (isUpdate) {
          if (action === 'approve') {
            // apply update from revision
            nextMusician = { ...nextMusician, ...nextMusician.revision }
          }

          // revision not needed after review
          delete nextMusician.revision
        } else {
          nextMusician.profileStatus = 'approved'
        }

        // update currrent musician
        queryClient.setQueryData([`musician/${id}`], nextMusician)

        // remove current musician from list of pending musicians
        queryClient.setQueryData(
          ['pending-musicians'],
          pendingMusicians.filter((musician) => musician.id !== id)
        )

        // reduce total pending musicians after review
        queryClient.setQueryData(['pending-statistics'], {
          ...stats,
          musicians: stats.musicians - 1,
        })
      }

      return { musician, pendingMusicians, stats }
    },

    onSuccess: (data, { action }) => {
      // rejected profiles are deleted
      if (action === 'reject' && !isUpdate) {
        router.replace('/pending')
      }

      toast({
        status: 'success',
        title: data.message,
      })
    },

    onError: (error, { id }, context) => {
      toast({ status: 'error', title: error.message })
      if (!(context?.musician && context?.pendingMusicians && context?.stats))
        return

      queryClient.setQueryData([`musician/${id}`], context.musician)
      queryClient.setQueryData(['pending-musicians'], context.pendingMusicians)
      queryClient.setQueryData(['pending-statistics'], context.stats)
    },
  })

  return (
    <Flex
      p={5}
      mb={5}
      shadow={'md'}
      rounded={'lg'}
      justifyContent={'space-between'}
      bgColor={isUpdate ? 'purple.100' : 'teal.100'}
      color={isUpdate ? 'purple.700' : 'teal.700'}
    >
      <Heading size={'lg'}>Approve {isUpdate ? 'update' : 'profile'}?</Heading>

      <HStack>
        <Button
          isLoading={reviewMutation.isLoading}
          onClick={() =>
            reviewMutation.mutate({ id: musicianId, action: 'approve' })
          }
        >
          Approve
        </Button>

        <Button
          colorScheme="red"
          isLoading={reviewMutation.isLoading}
          onClick={() =>
            reviewMutation.mutate({ id: musicianId, action: 'reject' })
          }
        >
          Reject
        </Button>
      </HStack>
    </Flex>
  )
}
