import {
  TStatusAction,
  IPendingStatisticsResponse,
  IPendingArtistsResponse,
} from '@/lib/interfaces'
import { reviewService } from '@/services'
import { CheckCircleIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
  Badge,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type TData = { message: string }
type TVariables = { id: string; action: TStatusAction }
type TContext =
  | {
      artists: IPendingArtistsResponse | undefined
      stats: IPendingStatisticsResponse | undefined
    }
  | undefined

export default function PendingArtistsTab() {
  const { data: artists, isLoading } = useQuery(['pending-artists'], () =>
    reviewService.getPendingArtists()
  )

  const queryClient = useQueryClient()

  const toast = useToast({
    position: 'top',
  })

  const router = useRouter()

  const statusMutation = useMutation<TData, Error, TVariables, TContext>({
    mutationFn: ({ id, action }) =>
      reviewService.updateArtistStatus(id, action),

    onMutate: ({ id }) => {
      const artists = queryClient.getQueryData<IPendingArtistsResponse>([
        'pending-artists',
      ])

      const stats = queryClient.getQueryData<IPendingStatisticsResponse>([
        'pending-statistics',
      ])

      if (artists && stats) {
        queryClient.setQueryData(
          ['pending-artists'],
          artists.filter(({ id: artistId }) => artistId !== id)
        )

        queryClient.setQueryData(['pending-statistics'], {
          ...stats,
          artists: stats.artists - 1,
        })
      }

      return { artists, stats }
    },

    onSuccess: (data) => {
      toast({
        status: 'success',
        title: data.message,
      })
    },

    onError: (error, variables, context) => {
      toast({ status: 'error', title: error.message })

      if (!(context?.artists && context?.stats)) return

      queryClient.setQueryData(['pending-artists'], context.artists)
      queryClient.setQueryData(['pending-statistics'], context.stats)
    },
  })

  return (
    <>
      <TableContainer
        mt={4}
        bg={'white'}
        boxShadow={'lg'}
        rounded={'lg'}
        borderWidth={1}
        borderColor={'gray.200'}
        overflowY={'scroll'}
      >
        <Table variant="simple" colorScheme="gray" size={'lg'}>
          <Thead position={'sticky'} top={0} bg={'gray.100'}>
            <Tr>
              <Th>Name</Th>
              <Th>Genre</Th>
              <Th>Type</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={4}>
                  <Flex justifyContent={'center'} alignItems={'center'} gap={4}>
                    <Spinner
                      size={'lg'}
                      thickness={'4px'}
                      color="teal"
                      emptyColor="gray.100"
                    />
                    Loading
                  </Flex>
                </Td>
              </Tr>
            ) : artists && artists?.length > 0 ? (
              artists.map(({ id, name, genre, revision }) => (
                <Tr
                  key={id}
                  _hover={{ bg: 'teal.50', cursor: 'pointer' }}
                  _active={{ bg: 'teal.100' }}
                  onClick={() =>
                    router.push(
                      `/artists/${id}${revision ? `?applyUpdate=true` : ''}`
                    )
                  }
                >
                  <Td>{revision?.name || name}</Td>
                  <Td>{revision?.genre || genre}</Td>
                  <Td>
                    <Badge colorScheme={!revision ? 'teal' : 'purple'}>
                      {revision ? 'Update' : 'New'}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        colorScheme="gray"
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                      >
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() =>
                            statusMutation.mutate({ id, action: 'approve' })
                          }
                          fontWeight={'medium'}
                          color={'teal'}
                        >
                          Approve
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            statusMutation.mutate({ id, action: 'reject' })
                          }
                          fontWeight={'medium'}
                          color={'tomato'}
                        >
                          Reject
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign={'center'}>
                  <Flex justifyContent={'center'} alignItems={'center'} gap={4}>
                    <CheckCircleIcon color={'teal'} w={5} h={5} /> All done!
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
