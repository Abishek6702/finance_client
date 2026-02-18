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
    <div className='inline-flex items-center gap-5 border-[#D9D9D9] border rounded-2xl p-3 mx-2 my-2'>
        <div>
            <img className='rounded-xl' src={user.profileImage} alt='user image'/>
        </div>
        <div>
            <p className='inter'>{user.rollNo}</p>
            <p className='inter'>{user.name}</p>
            <div className='flex items-center gap-1'>
                <p className='inter'>{user.year} /</p>
                <p className='inter'>{user.section}</p>
            </div>
        </div>
        <div>
            <button onClick={handleStudentDetails} className="bg-[#0B56A4] rounded-full p-2 text-white cursor-pointer">
                <ArrowUpRight className="w-6 h-6" />
            </button>
        </div>
    </div>
  )
}
