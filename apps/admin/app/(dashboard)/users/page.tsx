'use client'

import { ROLE_ADMIN, ROLE_ARTIST, ROLE_MUSICIAN } from '@/lib/constants'
import { ISearchUsersResponse } from '@/lib/interfaces'
import { userService } from '@/services'
import { useCallback, useState } from 'react'
import { Link } from '@chakra-ui/next-js'
import { SubmitHandler, useForm } from 'react-hook-form'
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
  Tag,
  TagLabel,
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
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createQueryString } from '@/lib/utils'

export default function SearchUsersPage() {
  const [userQuery, setUserQuery] = useState<string | undefined>() // stores query string to filter users

  const {
    data: users,
    isLoading: searching,
    error,
  } = useQuery<ISearchUsersResponse, Error>(['user', userQuery], () =>
    userService.search(userQuery)
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
      <Heading>Users</Heading>

      <Search onSubmit={(query: string) => setUserQuery(query)} />

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
          <Thead position={'sticky'} top={0} bg={'gray.100'}>
            <Tr>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Roles</Th>
            </Tr>
          </Thead>

          <Tbody>
            {searching ? (
              <Tr>
                <Td colSpan={3}>
                  <Flex justifyContent={'center'} alignItems={'center'} gap={4}>
                    <Spinner
                      size={'lg'}
                      thickness={'4px'}
                      color="teal"
                      emptyColor="gray.100"
                    />
                    Searching
                  </Flex>
                </Td>
              </Tr>
            ) : users && users?.length > 0 ? (
              users.map(({ _id, email, roles, isEmailVerified }) => (
                <Tr
                  key={_id}
                  _hover={{ bg: 'teal.50', cursor: 'pointer' }}
                  _active={{ bg: 'teal.100' }}
                  onClick={() => router.push(`/users/${_id}`)}
                >
                  <Td color={'blue.400'} fontWeight={'bold'}>
                    <Link href={`mailto: ${email}`}>{email}</Link>
                  </Td>

                  <Td>
                    <Badge colorScheme={isEmailVerified ? 'teal' : 'red'}>
                      {isEmailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack>
                      {roles.map((role) => {
                        const roleTag = userRoleTags[role]

                        return (
                          <Tag key={role} colorScheme={roleTag.color} gap={2}>
                            <TagLabel>{roleTag.name}</TagLabel>
                          </Tag>
                        )
                      })}
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3} textAlign={'center'}>
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
  email: '',
  status: '',
  roles: [],
}

interface ISearchProps {
  onSubmit: (query: string) => void
}

interface FieldValues {
  email: string
  status: string
  roles: string[]
}

function Search({ onSubmit }: ISearchProps) {
  const { register, handleSubmit, control } = useForm<FieldValues>({
    defaultValues: defaultSearchValues,
  })

  const handleSearchSubmit: SubmitHandler<FieldValues> = (values) =>
    onSubmit(createQueryStringCb(values))

  const createQueryStringCb = useCallback(createQueryString, [])

  return (
    <Stack
      boxShadow={'lg'}
      rounded={'lg'}
      p={5}
      mt={5}
      borderWidth={1}
      borderColor={'gray.200'}
      bg={'white'}
      w={'max-content'}
    >
      <Text>Filters</Text>

      <form onSubmit={handleSubmit(handleSearchSubmit)}>
        <HStack>
          <Input placeholder="Search by email" {...register('email')} />
          <Select {...register('status')}>
            <option value="">Select status</option>
            <option value="unverified">Unverified</option>
            <option value="verified">Verified</option>
          </Select>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              colorScheme="gray"
              minW={'min-content'}
              rightIcon={<ChevronDownIcon w={5} h={'auto'} />}
            >
              Roles
            </MenuButton>
            <MenuList>
              <MenuOptionGroupController
                type="checkbox"
                name="roles"
                control={control}
              >
                <MenuItemOption
                  key={ROLE_MUSICIAN}
                  name="roles"
                  value={ROLE_MUSICIAN}
                >
                  Musician
                </MenuItemOption>
                <MenuItemOption
                  key={ROLE_ARTIST}
                  name="roles"
                  value={ROLE_ARTIST}
                >
                  Artist
                </MenuItemOption>
                <MenuItemOption
                  key={ROLE_ADMIN}
                  name="roles"
                  value={ROLE_ADMIN}
                >
                  Admin
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
