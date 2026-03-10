import React from 'react'
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function ReportsStudentDetailCard({user}) {
    const navigate = useNavigate()
    const handleStudentDetails=()=>{
        navigate(`/admin/reports/${user.rollNo}`,{
        state:{user}
    })}
  return (
    <div className='inline-flex  items-center justify-between  border bg-white border-gray-300 rounded-2xl p-2 mx-2 my-2'>
        <div className="flex gap-4 w-full">
        <div className=''>
            <img className='rounded-xl w-20 h-17' src={user.profile} alt='user image'/>
        </div>
        <div className=' w-full  '>
            <p className='font-semibold text-md'>{user.rollNo}</p>  
            <p className='text-md  truncate '>{user.name}</p>
            <div className='flex items-center gap-1 text-sm text-gray-500'>
                <p className=''>{user.currentYear} Year /</p>
                <p className=''>{user.department} - {user.section} </p>
            </div>
        </div>                         
        </div>
        <div className=''>
            <button onClick={handleStudentDetails} className="bg-[#0B56A4] rounded-full p-2 text-white cursor-pointer">
                <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
    </div>
  )
}
