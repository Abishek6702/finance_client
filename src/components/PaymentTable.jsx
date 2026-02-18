import React, { useState, useMemo } from 'react';
import { RotateCcw, Plus, Search, ListFilter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentMFilter from './PaymentMFilter';

const PaymentTable = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: 'Year',
    dept: 'Department',
    mode: 'Mode',
    feeHead: 'Fee Head'
  });

  const [payments] = useState([
    { id: 1, name: "Surya Chandran", sub: "1st Year / CSE", roll: "21CS001", semPeriod: "Even Sem", head: "Exam Fees", amount: "₹4000", date: "10/12/2026", mode: "Cash", bank: "Cash", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Surya Chandran", sub: "1st Year / IT", roll: "21ECE011", semPeriod: "Odd Sem", head: "Software Fees", amount: "₹4000", date: "10/12/2026", mode: "UPI", bank: "ICICI", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Surya Chandran", sub: "2nd Year / ECE", roll: "21IT009", semPeriod: "Even Sem", head: "Software Fees", amount: "₹4000", date: "10/12/2026", mode: "UPI", bank: "CUB", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Surya Chandran", sub: "3rd Year / EEE", roll: "21CS011", semPeriod: "Odd Sem", head: "Exam Fees", amount: "₹4000", date: "10/12/2026", mode: "DD", bank: "IOB", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Surya Chandran", sub: "4th Year / MECH", roll: "21MEC061", semPeriod: "Odd Sem", head: "Tution Fees", amount: "₹4000", date: "10/12/2026", mode: "NEFT", bank: "ICICI", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=5" },
    { id: 6, name: "Surya Chandran", sub: "2nd Year / ECE", roll: "21IT009", semPeriod: "Even Sem", head: "Software Fees", amount: "₹4000", date: "10/12/2026", mode: "UPI", bank: "CUB", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 7, name: "Surya Chandran", sub: "3rd Year / EEE", roll: "21CS011", semPeriod: "Odd Sem", head: "Exam Fees", amount: "₹4000", date: "10/12/2026", mode: "DD", bank: "IOB", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 8, name: "Surya Chandran", sub: "4th Year / MECH", roll: "21MEC061", semPeriod: "Odd Sem", head: "Tution Fees", amount: "₹4000", date: "10/12/2026", mode: "NEFT", bank: "ICICI", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=5" },
  ]);

  const filteredData = useMemo(() => {
    return payments.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.roll.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = filters.year === 'Year' || item.sub.includes(filters.year);
      const matchesDept = filters.dept === 'Department' || item.sub.includes(filters.dept);
      const matchesMode = filters.mode === 'Mode' || item.mode === filters.mode;
      const matchesHead = filters.feeHead === 'Fee Head' || item.head === filters.feeHead;
      
      return matchesSearch && matchesYear && matchesDept && matchesMode && matchesHead;
    });
  }, [searchTerm, filters, payments]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex  items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PaymentMFilter 
            filters={filters} 
            setFilters={setFilters} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>

        <button 
          className="flex items-center px-5 py-2 bg-[#0B56A4] text-white rounded-lg font-semibold hover:bg-[#084482] transition-colors shadow-sm whitespace-nowrap" 
          onClick={() => navigate('/admin/payment/newpayment')}
        >
          <Plus className="w-4 h-4 mr-2" /> New Payment
        </button>
      </div>

      <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="max-h-[calc(100vh-250px)] overflow-auto custom-scrollbar relative">
          <table className="w-full border-collapse min-w-[1200px]">
            <thead className="sticky top-0 z-30">
              <tr className="bg-[#F0F0F0]">
                {["Student Details", "Roll No", "Sem", "Fee Head", "Amount", "Date", "Mode", "Bank", "Receipt"].map((header) => (
                  <th key={header} className="p-3 text-left font-semibold tracking-wider text-gray-700 text-sm">
                    {header}
                  </th>
                ))}
                <th className="sticky right-0 bg-[#F0F0F0] p-3 font-semibold text-right z-40 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]">
                    Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {filteredData.map((item) => (
                <tr key={item.id} className="">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-200" alt="" />
                      <div>
                        <div className="font-medium ">{item.name}</div>
                        <div className="text-[12px] font-bold font-medium text-gray-400 uppercase tracking-tight">{item.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 ">{item.roll}</td>
                  <td className="p-4 ">{item.semPeriod}</td>
                  <td className="p-4 ">{item.head}</td>
                  <td className="p-4 ">{item.amount}</td>
                  <td className="p-4 ">{item.date}</td>
                  <td className="p-4 ">{item.mode}</td>
                  <td className="p-4 ">{item.bank}</td>
                  <td className="p-4 ">{item.receipt}</td>
                  <td className="sticky right-0 bg-white p-4 text-right z-20 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]">
                    <button className="p-2 bg-[#0B56A4] text-white rounded-full hover:bg-[#084482] transition-all">
                      <RotateCcw size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No results found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;