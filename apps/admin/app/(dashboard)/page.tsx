'use client'

import MusicNoteIcon from '@/components/icons/music-note'
import PaletteIcon from '@/components/icons/palette'
import PendingIcon from '@/components/icons/pending'
import UserIcon from '@/components/icons/user'
import { IDashboardStatsResponse } from '@/lib/interfaces'
import { utilsService } from '@/services/utils.service'
import { Link } from '@chakra-ui/next-js'
import {
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  ThemeTypings,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { ReactElement } from 'react'

export default function DashboardPage() {
  const { data: stats } = useQuery<IDashboardStatsResponse, Error>(
    ['dashboard-stats'],
    () => utilsService.getDashboardStats()
  )

  return (
    <>
      <Heading>Dashboard</Heading>

      {stats && (
        <Flex mt={8} gap={5} wrap={'wrap'}>
          <StatCard
            icon={<PendingIcon color={'red.500'} w={12} h={12} />}
            label="Pending Requests"
            number={stats.pendingRequests}
            color="red"
            href="/pending"
          />

          <StatCard
            icon={<UserIcon color={'teal.500'} w={12} h={12} />}
            label="Users"
            number={stats.users}
            color="teal"
            href="/users"
          />

          <StatCard
            icon={<MusicNoteIcon color={'purple.500'} w={12} h={12} />}
            label="Musicians"
            number={stats.musicians}
            color="purple"
            href="/musicians"
          />

          <StatCard
            icon={<PaletteIcon color={'cyan.500'} w={12} h={12} />}
            label="Artists"
            number={stats.artists}
            color="cyan"
            href="/artists"
          />
        </Flex>
      )}
    </>
  )
}

interface IStatCardProps {
  label: string
  number: number
  color: ThemeTypings['colorSchemes']
  icon: ReactElement
  href: string
}

function StatCard({ label, number, color, icon, href }: IStatCardProps) {
  return (
    <Link
      href={href}
      minW={'20%'}
      w={'min-content'}
      bgColor={'white'}
      p={5}
      shadow={'md'}
      rounded={'lg'}
      display={'flex'}
      alignItems={'center'}
      gap={4}
      _hover={{ bgColor: `${color}.50` }}
    >
      {icon}
      <Stat>
        <StatNumber>{number}</StatNumber>
        <StatLabel color={`${color}.500`}>{label}</StatLabel>
      </Stat>
    </Link>
  )
}
