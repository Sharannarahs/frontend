import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatCOntainer'
import RightSidebar from '../components/RightSidebar'

const HomePage = () => {

    const [selectedUser, setSelectedUser] = useState(false)

  return (
    <div className='border w-full h-screen '>
        <div className={`backdrop-blur-xl border-rounded border-gray-600  overflow-hidden
        h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`} >
            <Sidebar  /> {/*passing the props */}
            <ChatContainer  />
            <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

        </div>
    </div>
  )
}

export default HomePage