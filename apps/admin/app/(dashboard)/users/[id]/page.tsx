'use client'

import Loading from '@/components/loading'
import { IGetUserByIdResponse } from '@/lib/interfaces'
import { userService } from '@/services'
import { WarningIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Center,
  HStack,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface IProps {
  params: {
    id: string
  }
}

export default function UserProfilePage({ params }: IProps) {
  const { data } = useQuery<IGetUserByIdResponse, Error>(
    ['users/' + params.id],
    () => userService.getById(params.id)
  )

  const router = useRouter()

  if (data) {
    const {
      user,
      profiles: { musician, artist },
    } = data
    return (
      <>
        {/* user info */}
        <VStack
          bg={'white'}
          p={5}
          rounded={'lg'}
          shadow={'md'}
          w={'max-content'}
          alignItems={'start'}
        >
          <Text color={'teal.500'}>User</Text>

          {/* user email  */}
          <Link
            href={`mailto:${user.email}`}
            color={'blue.400'}
            fontWeight={'bold'}
          >
            <Heading>{data.user.email}</Heading>
          </Link>

          {/* email verification status */}
          <HStack>
            <Text fontWeight={'medium'}>Status:</Text>
            <Badge colorScheme={user.isEmailVerified ? 'teal' : 'red'}>
              {user.isEmailVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </HStack>
        </VStack>

        {/* talent profiles  */}
        <Box mt={8}>
          <Heading size={'lg'} mb={4} mx={5}>
            Profiles
          </Heading>

          {musician || artist ? (
            <HStack>
              {/* musician profile  */}
              {musician && (
                <VStack
                  bg={'white'}
                  p={5}
                  rounded={'lg'}
                  shadow={'md'}
                  w={'max-content'}
                  alignItems={'start'}
                  _hover={{ bgColor: 'purple.50', cursor: 'pointer' }}
                  _active={{ bgColor: 'purple.100' }}
                  onClick={() => router.push(`/musicians/${musician._id}`)}
                >
                  <Text color={'purple.500'}>Musician</Text>
                  <Heading size={'md'}>{musician.name}</Heading>

                  <HStack>
                    <Text fontWeight={'medium'}>Status:</Text>
                    <Badge
                      colorScheme={
                        musician.profileStatus === 'approved' ? 'teal' : 'red'
                      }
                    >
                      {musician.profileStatus}
                    </Badge>
                  </HStack>
                </VStack>
              )}

              {/* artist profile */}
              {artist && (
                <VStack
                  bg={'white'}
                  p={5}
                  rounded={'lg'}
                  shadow={'md'}
                  w={'max-content'}
                  alignItems={'start'}
                  _hover={{ bgColor: 'cyan.50', cursor: 'pointer' }}
                  _active={{ bgColor: 'cyan.100' }}
                  onClick={() => router.push(`/artists/${artist._id}`)}
                >
                  <Text color={'cyan.500'}>Artist</Text>
                  <Heading size={'md'}>{artist.name}</Heading>

                  <HStack>
                    <Text fontWeight={'medium'}>Status:</Text>
                    <Badge
                      colorScheme={
                        artist.profileStatus === 'approved' ? 'teal' : 'red'
                      }
                    >
                      {artist.profileStatus}
                    </Badge>
                  </HStack>
                </VStack>
              )}
            </HStack>
          ) : (
            <HStack mx={5}>
              <WarningIcon color={'gray'} w={5} h={5} />
              <Text color={'gray'}>No profiles</Text>
            </HStack>
          )}
        </Box>
      </>
    )
  }

  return (
    <Center h={'full'} flexDirection={'column'}>
      <Loading />
    </Center>
  )
}
