'use client'

import { ROLE_ADMIN, ROLE_ARTIST, ROLE_MUSICIAN, states } from '@/lib/constants'
import { IMusician } from '@/lib/interfaces'
import { musicianService } from '@/services'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDownIcon, WarningIcon } from '@chakra-ui/icons'
import MenuOptionGroupController from '@/components/menu-option-group-controller'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Heading,
  useToast,
  Tbody,
  Td,
  Badge,
  HStack,
  Input,
  Text,
  Stack,
  Select,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Flex,
  Spinner,
  Avatar,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function SearchMusiciansPage() {
  const [searchQuery, setSearchQuery] = useState<string>() // stores query string to filter musicians

  const {
    data: musicians,
    isLoading,
    error,
  } = useQuery<[IMusician], Error>(['search-musicians', searchQuery], () =>
    musicianService.search(searchQuery)
  )

  const errorToast = useToast({
    status: 'error',
    position: 'top',
  })

  const router = useRouter()

  if (error) {
    errorToast({ title: error.message })
  }

  return (
    <Flex direction={'column'} h={'calc(100vh - 40px)'}>
      <Heading>Musicians</Heading>

      <Search onSubmit={(query: string) => setSearchQuery(query)} />

      <TableContainer
        mt={5}
        bg={'white'}
        boxShadow={'lg'}
        rounded={'lg'}
        borderWidth={1}
        borderColor={'gray.200'}
        overflowY={'scroll'}
      >
        <Table variant="simple" colorScheme="gray" size={'lg'}>
          <Thead position={'sticky'} top={0} bg={'gray.100'} zIndex={1}>
            <Tr>
              <Th>Logo</Th>
              <Th>Name</Th>
              <Th>Band</Th>
              <Th>Genre</Th>
              <Th>Status</Th>
              <Th>Address</Th>
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
              musicians.map(
                ({
                  id,
                  logo,
                  name,
                  genre,
                  band,
                  fullAddress,
                  profileStatus,
                }) => (
                  <Tr
                    key={id}
                    _hover={{ bg: 'teal.50', cursor: 'pointer' }}
                    _active={{ bg: 'teal.100' }}
                    onClick={() => router.push(`/musicians/${id}`)}
                  >
                    <Td>
                      {logo ? (
                        <Avatar
                          name={`${band || ''} band logo`}
                          src={logo.url}
                        />
                      ) : (
                        '-'
                      )}
                    </Td>
                    <Td>{name}</Td>
                    <Td>{band || '-'}</Td>
                    <Td>{genre}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          profileStatus === 'approved' ? 'teal' : 'red'
                        }
                      >
                        {profileStatus === 'approved' ? 'Approved' : 'Pending'}
                      </Badge>
                    </Td>
                    <Td>{fullAddress}</Td>
                  </Tr>
                )
              )
            ) : (
              <Tr>
                <Td colSpan={6} textAlign={'center'}>
                  <Flex justifyContent={'center'} alignItems={'center'} gap={4}>
                    <WarningIcon color={'tomato'} w={5} h={5} /> No Data
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

const defaultSearchValues = {
  name: '',
  state: '',
  city: '',
  genre: '',
  status: [],
}

interface ISearchProps {
  onSubmit: (query: string) => void
}

function Search({ onSubmit }: ISearchProps) {
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: defaultSearchValues,
  })

  async function handleSearchSubmit(values: any) {
    const queryString = createQueryString(values)
    onSubmit(queryString)
  }

  const createQueryString = useCallback((query: any) => {
    const params = new URLSearchParams()

    Object.keys(query).forEach((key) => {
      params.set(key, query[key])
    })

    return params.toString()
  }, [])

  return (
    <Stack
      boxShadow={'lg'}
      rounded={'lg'}
      p={5}
      mt={5}
      borderWidth={1}
      borderColor={'gray.200'}
      bg={'white'}
    >
      <HStack>
        <Text>Filters</Text>
      </HStack>

      <form onSubmit={handleSubmit(handleSearchSubmit)}>
        <HStack>
          <Input placeholder="Search by name" {...register('name')} />
          <Select {...register('state')}>
            <option value="">Select state</option>
            {Object.keys(states)
              .sort()
              .map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </Select>
          <Input placeholder="City" {...register('city')} />
          <Input placeholder="Genre" {...register('genre')} />
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              colorScheme="gray"
              minW={'min-content'}
              rightIcon={<ChevronDownIcon w={5} h={'auto'} />}
            >
              Status
            </MenuButton>
            <MenuList zIndex={2} overflow={'scroll'} shadow={'lg'}>
              <MenuOptionGroupController
                type="checkbox"
                name="status"
                control={control}
              >
                <MenuItemOption
                  key={'approved'}
                  name="status"
                  value={'approved'}
                  color={'teal'}
                >
                  Approved
                </MenuItemOption>
                <MenuItemOption
                  key={'pending'}
                  name="status"
                  value={'pending'}
                  color={'tomato'}
                >
                  Pending
                </MenuItemOption>
              </MenuOptionGroupController>
            </MenuList>
          </Menu>
          <Button type="submit" minW={'min-content'}>
            Search
          </Button>
        </HStack>
      </form>
    </Stack>
  )
}

const userRoleTags: {
  [x: string]: {
    name: string
    color: string
  }
} = {
  [ROLE_ADMIN]: {
    name: 'Admin',
    color: 'red',
  },
  [ROLE_MUSICIAN]: {
    name: 'Musician',
    color: 'purple',
  },
  [ROLE_ARTIST]: {
    name: 'Artist',
    color: 'cyan',
  },
}
