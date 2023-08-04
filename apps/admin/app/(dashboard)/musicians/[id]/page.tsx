'use client'

import Map from '@/components/Map'
import Loading from '@/components/loading'
import { ICloudAsset, IMusician, IEvent } from '@/lib/interfaces'
import { musicianService } from '@/services/musician.service'
import { WarningIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/next-js'
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  Center,
  TableContainer,
  Table,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  Image,
  HStack,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ReviewSection from './review-section'

interface IProps {
  params: {
    id: string
  }
  searchParams: {
    applyUpdate: string
  }
}

export default function MusicianProfilePage({ params, searchParams }: IProps) {
  const { data: musician } = useQuery<IMusician, Error>(
    ['musician/' + params.id],
    () => musicianService.getById(params.id)
  )

  if (musician) {
    const { revision } = musician
    let data = musician

    const isUpdate =
      searchParams.applyUpdate === 'true' && revision !== undefined

    if (isUpdate) {
      data = {
        ...data,
        ...revision,
      }
    }

    return (
      <>
        {(isUpdate || musician.profileStatus === 'pending') && (
          <ReviewSection musicianId={musician.id} isUpdate={isUpdate} />
        )}

        <Box p={5} bgColor={'white'} shadow={'md'} rounded={'lg'}>
          {/* band information */}
          <Flex gap={10}>
            <Avatar
              size={'2xl'}
              src={data.logo?.url}
              name={`${data.band || ''} band logo`}
            />
            <Box>
              <Text color={'purple.500'}>Musician</Text>
              <Heading>{data.name}</Heading>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>Band:</Text>
                <Text>{data?.band || ''}</Text>
              </Flex>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>Genre:</Text>
                <Text>{data.genre}</Text>
              </Flex>
              <Flex gap={1} w={'60%'}>
                <Text fontWeight={'medium'}>Info:</Text>
                <Text display={'inline'}>{data.bio}</Text>
              </Flex>
            </Box>
          </Flex>

          <Divider my={4} />

          <Flex justifyContent={'space-around'}>
            {/* address */}
            <Box flex={1}>
              <Heading size={'md'} mb={4}>
                Address
              </Heading>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>Address:</Text>
                <Text>{data.address.address}</Text>
              </Flex>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>City:</Text>
                <Text>{data.address.city}</Text>
              </Flex>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>State:</Text>
                <Text>{data.address.state}</Text>
              </Flex>
            </Box>

            <Box height="28" my={'auto'} mx={5}>
              <Divider orientation="vertical" />
            </Box>

            {/* contact info */}
            <Box flex={1}>
              <Heading size={'md'} mb={4}>
                Contact
              </Heading>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>Website:</Text>
                <Link
                  href={data?.website || '#'}
                  color={'blue.400'}
                  fontWeight={'bold'}
                >
                  {data?.website || ''}
                </Link>
              </Flex>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>Email:</Text>
                <Link
                  href={`mailto:${data.user.email}`}
                  color={'blue.400'}
                  fontWeight={'bold'}
                >
                  {data.user.email}
                </Link>
              </Flex>
              <Flex gap={1}>
                <Text fontWeight={'medium'}>Phone:</Text>
                <Link
                  href={`tel:${data?.phone}`}
                  color={'blue.400'}
                  fontWeight={'bold'}
                >
                  {data?.phone || ''}
                </Link>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* band members section */}
        <MembersSection members={data.members} />

        {/* band gallery section */}
        <GallerySection gallery={data.gallery} />

        {/* songs section */}
        <SongsSection songs={data.songs} />

        {/* events section */}
        <EventsSection events={data.events} />
      </>
    )
  }

  return (
    <Center h={'full'} flexDirection={'column'}>
      <Loading />
    </Center>
  )
}

interface IMembersSectionProps {
  members:
    | [
        {
          _id: string
          name: string
          role: string
          instrument: string
        }
      ]
    | undefined
}

function MembersSection({ members }: IMembersSectionProps) {
  return members ? (
    <Box mt={8}>
      <Heading size={'lg'} mx={5} mb={4}>
        Band members
      </Heading>

      {!members.length ? (
        <HStack
          justifyContent={'center'}
          bg={'white'}
          p={5}
          shadow={'md'}
          rounded={'lg'}
        >
          <WarningIcon color={'gray'} />
          <Text color={'gray'}>No members</Text>
        </HStack>
      ) : (
        <TableContainer
          bg={'white'}
          boxShadow={'md'}
          rounded={'lg'}
          borderWidth={1}
          borderColor={'gray.200'}
          overflowY={'scroll'}
          maxH={'310px'}
        >
          <Table variant="simple" colorScheme="gray">
            <Thead position={'sticky'} top={0} bg={'gray.100'}>
              <Tr>
                <Th>Name</Th>
                <Th>Instrument</Th>
                <Th>Role</Th>
              </Tr>
            </Thead>

            <Tbody>
              {members.map(({ _id, name, role, instrument }) => (
                <Tr key={_id}>
                  <Td>{name}</Td>
                  <Td>{instrument}</Td>
                  <Td>{role}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  ) : null
}

interface IGallerySectionProps {
  gallery: [ICloudAsset] | undefined
}

function GallerySection({ gallery }: IGallerySectionProps) {
  return gallery ? (
    <Box mt={8}>
      <Heading size={'lg'} mx={5} mb={4}>
        Band Gallery
      </Heading>
      <Box shadow={'md'} rounded={'lg'} p={5} bgColor={'white'}>
        {!gallery.length ? (
          <HStack justifyContent={'center'}>
            <WarningIcon color={'gray'} />
            <Text color={'gray'}>No images</Text>
          </HStack>
        ) : (
          <HStack gap={2} overflowX={'scroll'} pb={4}>
            {gallery.map((image, i) => (
              <Image
                key={image._id}
                src={image.url}
                alt={`band gallery image ${i + 1}`}
                height={310}
              />
            ))}
          </HStack>
        )}
      </Box>
    </Box>
  ) : null
}

interface ISongsSectionProps {
  songs: [ICloudAsset] | undefined
}

function SongsSection({ songs }: ISongsSectionProps) {
  return songs ? (
    <Box mt={8}>
      <Heading size={'lg'} mx={5} mb={4}>
        Songs
      </Heading>
      {!songs.length ? (
        <HStack
          justifyContent={'center'}
          shadow={'md'}
          rounded={'lg'}
          p={5}
          bgColor={'white'}
        >
          <WarningIcon color={'gray'} />
          <Text color={'gray'}>No songs</Text>
        </HStack>
      ) : (
        <TableContainer
          bg={'white'}
          shadow={'md'}
          rounded={'lg'}
          borderWidth={1}
          borderColor={'gray.200'}
          overflowY={'scroll'}
          maxH={'310px'}
        >
          <Table colorScheme="gray">
            <Thead position={'sticky'} top={0} bg={'gray.100'}>
              <Tr>
                <Th style={{ width: '50%' }}>Name</Th>
                <Th style={{ width: '50%' }}>Song</Th>
              </Tr>
            </Thead>

            <Tbody>
              {songs.map((song, i) => (
                <Tr key={song._id}>
                  <Td>Song {i + 1}</Td>
                  <Td>
                    <audio
                      key={song._id}
                      src={song.url}
                      controls
                      style={{ width: '100%' }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  ) : null
}

interface IEventSectionProps {
  events: [IEvent] | undefined
}

function EventsSection({ events }: IEventSectionProps) {
  const [eventId, setEventId] = useState<string | null>(null)

  const selectedEvent = events?.find((event) => event._id === eventId)

  return events ? (
    <Box mt={8}>
      <Box mx={5} mb={4}>
        <Heading size={'lg'}>Events</Heading>
        <Text color={'gray'}>Click on an event to see its location in map</Text>
      </Box>

      {!events.length ? (
        <HStack
          justifyContent={'center'}
          bg={'white'}
          p={5}
          shadow={'md'}
          rounded={'lg'}
        >
          <WarningIcon color={'gray'} />
          <Text color={'gray'}>No events</Text>
        </HStack>
      ) : (
        <>
          <TableContainer
            bg={'white'}
            boxShadow={'md'}
            rounded={'lg'}
            borderWidth={1}
            borderColor={'gray.200'}
            overflowY={'scroll'}
            maxH={'310px'}
          >
            <Table variant="simple" colorScheme="gray">
              <Thead position={'sticky'} top={0} bg={'gray.100'}>
                <Tr>
                  <Th>Name</Th>
                  <Th>Genre</Th>
                  <Th>Date</Th>
                  <Th>Address</Th>
                </Tr>
              </Thead>

              <Tbody>
                {events.map(({ _id, name, date, genre, fullAddress }) => (
                  <Tr
                    key={_id}
                    _hover={{ bg: 'teal.50', cursor: 'pointer' }}
                    _active={{ bg: 'teal.100' }}
                    onClick={() => setEventId(_id)}
                  >
                    <Td>{name}</Td>
                    <Td>{genre}</Td>
                    <Td>{new Date(date).toLocaleDateString()}</Td>
                    <Td>{fullAddress}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Map
            popupText={selectedEvent?.name || ''}
            location={
              selectedEvent?.geometry.coordinates || [-73.935242, 40.73061] // default coordinates point to new york
            }
            mt={8}
            w={'full'}
            h={'400px'}
          />
        </>
      )}
    </Box>
  ) : null
}
