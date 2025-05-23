import MyFriendsList from '@/components/friends/MyFriendsList'
import NewFriends from '@/components/friends/NewFriends'
import OutGoingRequestsHistory from '@/components/friends/OutgoingRequestHistory'
import PortableNavBar from '@/components/global/PortableNavBar'
import React from 'react'

const Friends = () => {
  return (
    <div className='w-full flex items-center gap-2'>
      <MyFriendsList />
      <OutGoingRequestsHistory />
      <NewFriends />
      <PortableNavBar />
    </div>
  )
}

export default Friends