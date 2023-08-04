'use client'

import { authService } from '@/services'
import { LinkProps, Link } from '@chakra-ui/next-js'
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import styles from './dashboard.module.css'
import PendingIcon from '@/components/icons/pending'
import { ReactElement } from 'react'
import UserIcon from '@/components/icons/user'
import MusicNoteIcon from '@/components/icons/music-note'
import PaletteIcon from '@/components/icons/palette'
import LogoutIcon from '@/components/icons/logout'

export default function LayoutWrapper({ children }: React.PropsWithChildren) {
  return (
    <Flex bgColor={'white'} h={'100vh'} overflow={'hidden'}>
      <Sidebar />
      <Box flex={1} p={5} bgColor={'gray.50'} overflow={'scroll'}>
        {children}
      </Box>
    </Flex>
  )
}

function Sidebar() {
  const router = useRouter()

  function handleLogout() {
    authService.logout()
    router.replace('/login')
  }

  return (
    <aside>
      <Flex
        w={256}
        h={'full'}
        p={5}
        flexDirection={'column'}
        alignItems={'center'}
        borderRightWidth={'1px'}
        borderColor={'gray.200'}
      >
        <Logo />
        <Divider my={4} />
        <Stack w={'full'} h={'full'} overflowY={'auto'}>
          <NavItem
            icon={<PendingIcon color={'tomato'} w={6} h={6} />}
            href="/pending"
          >
            Pending Requests
          </NavItem>
          <NavItem
            icon={<UserIcon color={'teal.500'} w={6} h={6} />}
            href="/users"
          >
            Users
          </NavItem>
          <NavItem
            icon={<MusicNoteIcon color={'purple.500'} w={6} h={6} />}
            href="/musicians"
          >
            Musicians
          </NavItem>
          <NavItem
            icon={<PaletteIcon color={'cyan.500'} w={6} h={6} />}
            href="/artists"
          >
            Artists
          </NavItem>
        </Stack>
        <Divider my={4} />
        <Button onClick={handleLogout} colorScheme="red" gap={2}>
          Logout
          <LogoutIcon color={'white'} w={6} h={6} />
        </Button>
      </Flex>
    </aside>
  )
}

interface NavItemProps extends LinkProps {
  icon?: ReactElement
}

function NavItem({ icon, children, ...props }: NavItemProps) {
  const activeStyle =
    usePathname() === props.href
      ? { bgColor: 'teal.100', color: 'teal.700', shadow: 'sm' }
      : {}

  return (
    <Link
      py={'1.5'}
      px={2}
      rounded={'lg'}
      fontWeight={'bold'}
      _hover={{ bgColor: 'teal.100', color: 'teal.700', shadow: 'sm' }}
      {...activeStyle}
      {...props}
      display={'flex'}
      gap={2}
      alignItems={'center'}
    >
      {icon && icon}
      {children}
    </Link>
  )
}

function Logo() {
  return (
    <Link
      href={'/'}
      display={'flex'}
      gap={2}
      alignItems={'center'}
      bgGradient="linear(to-b, teal.500, #00FFC6)"
      backgroundClip={'text'}
      title="Dashboard"
    >
      <Box
        bgGradient="linear(to-b, teal.500, #00FFC6)"
        className={styles.shieldicon}
        w={'12'}
        h={'full'}
      ></Box>
      <Box textAlign={'center'}>
        <Heading size={'sm'}>800SMELLIT</Heading>
        <Heading>ADMIN</Heading>
      </Box>
    </Link>
  )
}
