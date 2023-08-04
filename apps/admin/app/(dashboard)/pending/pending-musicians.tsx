import {
  IPendingMusiciansResponse,
  IPendingStatisticsResponse,
  TStatusAction,
} from '@/lib/interfaces'
import { reviewService } from '@/services'
import { CheckCircleIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
  Avatar,
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
      musicians: IPendingMusiciansResponse | undefined
      stats: IPendingStatisticsResponse | undefined
    }
  | undefined

export default function PendingMusiciansTab() {
  const { data: musicians, isLoading } = useQuery(['pending-musicians'], () =>
    reviewService.getPendingMusicians()
  )

  const queryClient = useQueryClient()

  const toast = useToast({
    position: 'top',
  })

  const router = useRouter()

  const statusMutation = useMutation<TData, Error, TVariables, TContext>({
    mutationFn: ({ id, action }) =>
      reviewService.updateMusicianStatus(id, action),

    onMutate: ({ id }) => {
      const musicians = queryClient.getQueryData<IPendingMusiciansResponse>([
        'pending-musicians',
      ])

      const stats = queryClient.getQueryData<IPendingStatisticsResponse>([
        'pending-statistics',
      ])

      if (musicians && stats) {
        queryClient.setQueryData(
          ['pending-musicians'],
          musicians.filter(({ id: musicianId }) => musicianId !== id)
        )

        queryClient.setQueryData(['pending-statistics'], {
          ...stats,
          musicians: stats.musicians - 1,
        })
      }

      return { musicians, stats }
    },

    onSuccess: (data) => {
      toast({
        status: 'success',
        title: data.message,
      })
    },

    onError: (error, variables, context) => {
      toast({ status: 'error', title: error.message })

      if (!(context?.musicians && context?.stats)) return

      queryClient.setQueryData(['pending-musicians'], context.musicians)
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
              <Th>Logo</Th>
              <Th>Name</Th>
              <Th>Band</Th>
              <Th>Genre</Th>
              <Th>Type</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={6}>
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
            ) : musicians && musicians?.length > 0 ? (
              musicians.map(({ id, logo, name, genre, band, revision }) => (
                <Tr
                  key={id}
                  _hover={{ bg: 'teal.50', cursor: 'pointer' }}
                  _active={{ bg: 'teal.100' }}
                  onClick={() =>
                    router.push(
                      `/musicians/${id}${revision ? `?applyUpdate=true` : ''}`
                    )
                  }
                >
                  <Td>
                    {revision?.logo ? (
                      <Avatar
                        name={`${revision?.band || band || ''} band logo`}
                        src={revision.logo.url}
                      />
                    ) : logo ? (
                      <Avatar
                        name={`${revision?.band || band || ''} band logo`}
                        src={logo.url}
                      />
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>{revision?.name || name}</Td>
                  <Td>{revision?.band || band || '-'}</Td>
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
                        onClick={(e) => e.stopPropagation()}
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
                <Td colSpan={6} textAlign={'center'}>
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
