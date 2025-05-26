import FriendRequestLists from '@/components/friends/FriendRequestLists'
import MyFriendsList from '@/components/friends/MyFriendsList'
import NewFriends from '@/components/friends/NewFriends'
import OutGoingRequestsHistory from '@/components/friends/OutgoingRequestHistory'
import PortableNavBar from '@/components/global/PortableNavBar'
import React from 'react'

const Friends = () => {
  return (
    <div className='w-full flex items-center gap-2'>
      <MyFriendsList />
      <FriendRequestLists />
      <OutGoingRequestsHistory />
      <NewFriends />
      <PortableNavBar />
    </div>
  )
}

export default Friends