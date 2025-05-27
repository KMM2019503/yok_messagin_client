'use client';
import FriendRequestLists from '@/components/friends/FriendRequestLists'
import MyFriendsList from '@/components/friends/MyFriendsList'
import NewFriends from '@/components/friends/NewFriends'
import OutGoingRequestsHistory from '@/components/friends/OutgoingRequestHistory'
import PortableNavBar from '@/components/global/PortableNavBar'
import React from 'react'

const Friends = () => {
  return (
    <div className='w-[50%] grid grid-cols-2 grid-rows-2 items-center gap-2'>
      <MyFriendsList />
      <NewFriends />
      <FriendRequestLists />
      <OutGoingRequestsHistory />
      <PortableNavBar />
    </div>
  )
}

export default Friends