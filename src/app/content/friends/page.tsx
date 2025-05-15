import MyFriendsList from '@/components/friends/MyFriendsList'
import NewFriends from '@/components/friends/NewFriends'
import React from 'react'

const Friends = () => {
  return (
    <div className='w-full flex items-center gap-2'>
      <MyFriendsList />
      <NewFriends />
    </div>
  )
}

export default Friends