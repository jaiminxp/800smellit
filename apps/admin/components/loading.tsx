'use client'

import { Heading, Spinner } from '@chakra-ui/react'

export default function Loading() {
  return (
    <>
      <Spinner
        size={'xl'}
        thickness={'4px'}
        color="teal"
        emptyColor="gray.100"
        mb={5}
      />
      <Heading>Loading</Heading>
    </>
  )
}
