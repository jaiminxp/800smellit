'use client'

import {
  Input,
  Flex,
  Button,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  useToast,
  Box,
} from '@chakra-ui/react'
import { authService } from '@/services'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AuthDispatchContext } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { ILoginPayload, ILoginResponse } from '@/lib/interfaces'

interface FieldValues {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const authDispatch = useContext(AuthDispatchContext)

  const errorToast = useToast({
    status: 'error',
    position: 'top',
  })

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FieldValues>()

  const loginMutation = useMutation<ILoginResponse, Error, ILoginPayload>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: ({ user }) => {
      if (authDispatch !== null) {
        authDispatch({ type: 'set', payload: user })
      }
    },
    onError: (error) => {
      errorToast({
        title: error.message,
        position: 'top',
        status: 'error',
      })
    },
  })

  if (authService.isLoggedIn()) {
    return router.push('/')
  }

  async function onSubmit(values: FieldValues) {
    loginMutation.mutate(values)
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      direction={'column'}
      bgColor={'gray.50'}
      textAlign={'center'}
    >
      <Heading mb={'8'}>Admin Login</Heading>

      <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={'20px'}>
            <FormControl id="email" isInvalid={errors.email !== undefined}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register('email', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              id="password"
              isInvalid={errors.password !== undefined}
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register('password', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <Button isLoading={isSubmitting} type="submit">
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}
