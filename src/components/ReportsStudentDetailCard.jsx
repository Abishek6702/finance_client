import React from 'react'
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function ReportsStudentDetailCard({user}) {
    const navigate = useNavigate()
    const handleStudentDetails=()=>{
        navigate(`/admin/reports/${user.id}`,{
        state:{user}
    })}
  return (
    <div className='inline-flex items-center justify-between gap-5 border border-gray-300 rounded-2xl p-2 mx-2 my-2'>
        <div className="flex gap-4 w-full">
        <div className=''>
            <img className='rounded-xl w-24 ' src={user.profileImage} alt='user image'/>
        </div>
        <div className=' w-full'>
            <p className='font-semibold text-md'>{user.rollNo}</p>
            <p className='text-md w-40 truncate'>{user.name}</p>
            <div className='flex items-center gap-1 text-sm'>
                <p className=''>{user.year} /</p>
                <p className=''>{user.section}</p>
            </div>
        </div>
        </div>
        <div className=''>
            <button onClick={handleStudentDetails} className="bg-[#0B56A4] rounded-full p-2 text-white cursor-pointer">
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </div>
    </div>
  )
}
