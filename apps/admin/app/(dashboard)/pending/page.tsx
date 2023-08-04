'use client'

import { Tab, TabList, TabPanel, TabPanels, Tabs, Tag } from '@chakra-ui/react'
import PendingMusiciansTab from './pending-musicians'
import PendingArtistsTab from './pending-artists'
import { useQuery } from '@tanstack/react-query'
import { reviewService } from '@/services'

export default function PendingRequestsPage() {
  const { data: pendingStats } = useQuery(['pending-statistics'], () =>
    reviewService.getPendingStatistics()
  )

  return (
    <>
      <Tabs isLazy defaultIndex={0} variant={'soft-rounded'} mt={4}>
        <TabList>
          <Tab gap={2}>
            Musicians <Stat stat={pendingStats?.musicians} />
          </Tab>
          <Tab gap={2}>
            Artists <Stat stat={pendingStats?.artists} />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PendingMusiciansTab />
          </TabPanel>
          <TabPanel>
            <PendingArtistsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

interface IStatProps {
  stat: number | undefined
}

function Stat({ stat }: IStatProps) {
  return stat ? (
    <Tag
      colorScheme="orange"
      borderRadius={'full'}
      borderWidth={'1px'}
      borderColor={'orange.500'}
      fontWeight={'bold'}
    >
      {stat}
    </Tag>
  ) : null
}
