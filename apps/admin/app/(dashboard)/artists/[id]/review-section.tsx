import {
  TStatusAction,
  IPendingStatisticsResponse,
  IArtist,
  IPendingArtistsResponse,
} from '@/lib/interfaces'
import { reviewService } from '@/services'
import { useToast, Flex, Heading, HStack, Button } from '@chakra-ui/react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface IReviewSectionProps {
  isUpdate: boolean
  artistId: string
}

type TData = { message: string }
type TVariables = { id: string; action: TStatusAction }

export default function ReviewSection({
  isUpdate,
  artistId,
}: IReviewSectionProps) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const toast = useToast({
    position: 'top',
  })

  const reviewMutation = useMutation<TData, Error, TVariables>({
    mutationFn: ({ id, action }) =>
      reviewService.updateArtistStatus(id, action),

    onMutate: ({ id, action }) => {
      const artist = queryClient.getQueryData<IArtist>([`artist/${id}`])

      const pendingArtists = queryClient.getQueryData<IPendingArtistsResponse>([
        'pending-artists',
      ])

      const stats = queryClient.getQueryData<IPendingStatisticsResponse>([
        'pending-statistics',
      ])

      if (artist && stats && pendingArtists) {
        let nextArtist = {
          ...artist,
        }

        if (isUpdate) {
          if (action === 'approve') {
            // apply update from revision
            nextArtist = { ...nextArtist, ...nextArtist.revision }
          }

          // revision not needed after review
          delete nextArtist.revision
        } else {
          nextArtist.profileStatus = 'approved'
        }

        // update currrent artist
        queryClient.setQueryData([`artist/${id}`], nextArtist)

        // remove current artist from list of pending artists
        queryClient.setQueryData(
          ['pending-artists'],
          pendingArtists.filter((artist) => artist.id !== id)
        )

        // reduce total pending artists after review
        queryClient.setQueryData(['pending-statistics'], {
          ...stats,
          artists: stats.artists - 1,
        })
      }

      return { artist, pendingArtists, stats }
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

    onError: (error, { id }, context: any) => {
      toast({ status: 'error', title: error.message })

      queryClient.setQueryData([`artist/${id}`], context.artist)
      queryClient.setQueryData(['pending-artists'], context.pendingArtists)
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
            reviewMutation.mutate({ id: artistId, action: 'approve' })
          }
        >
          Approve
        </Button>

        <Button
          colorScheme="red"
          isLoading={reviewMutation.isLoading}
          onClick={() =>
            reviewMutation.mutate({ id: artistId, action: 'reject' })
          }
        >
          Reject
        </Button>
      </HStack>
    </Flex>
  )
}
