import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => { 
  const navigate = useNavigate()
  const handleLogin=()=>{
    navigate('/login')
  }
  return (
    <div className='flex justify-center items-center w-full h-screen '  >
     <button className='boder border-[#d9d9d9] bg-[#0b56a4] text-white text-xl rounded-xl p-3 px-6 cursor-pointer' onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Landing
