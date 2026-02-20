import React, { useState, useMemo } from 'react';
import { RotateCcw, Plus, Search } from 'lucide-react';
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
    { id: 1, name: "Aarav Sharma", sub: "1st Year / CSE", roll: "21CS001", semPeriod: "Even Sem", head: "Exam Fees", amount: "₹4000", date: "10/12/2026", mode: "Cash", bank: "Cash", receipt: "10123255", avatar: "https://i.pravatar.cc/150?u=1" },
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
      
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <PaymentMFilter 
          filters={filters} 
          setFilters={setFilters} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <button 
          className="flex items-center px-4 py-[10px] bg-[#0B56A4] text-white rounded-lg font-semibold hover:bg-[#084482] transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          onClick={() => navigate('/admin/payment/newpayment')}
        >
          <Plus className="w-4 h-4 mr-2" /> New Payment
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="w-full bg-white rounded-2xl shadow ">
        
        {/* Horizontal Scroll */}
        <div className="overflow-x-auto">
          
          {/* Vertical Scroll */}
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar relative">
            
            <table className="border-collapse w-full table-fixed">
              <colgroup>
              <col className="w-45" />
              <col className="w-30" />
              <col className="w-30" />
              <col className="w-40" />
              <col className="w-30" />
              <col className="w-30" />
              <col className="w-40" />
              <col className="w-30" />
              <col className="w-45" />
              <col className="w-20" />
            </colgroup>
              <thead className="sticky top-0 z-30 bg-[#F0F0F0]">
                <tr>
                  <th className="p-3 text-center font-semibold sticky left-0 bg-[#F0F0F0] z-40">
                    Student Details
                  </th>

                  {["Roll Number", "Sem Period", "Fee Head", "Amount", "Date", "Payment Mode", "Bank", "Receipt Number"].map((header) => (
                    <th key={header} className="p-3 text-center font-semibold">
                      {header}
                    </th>
                  ))}

                  <th className="sticky right-0 bg-[#F0F0F0] p-3 font-semibold text-right z-40 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]">
                   
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    
                    <td className="p-3 sticky left-0 bg-white z-20">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.avatar} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                          alt="" 
                        />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.sub}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">{item.roll}</td>
                    <td className="p-3 text-center">{item.semPeriod}</td>
                    <td className="p-3 text-center">{item.head}</td>
                    <td className="p-3 text-center">{item.amount}</td>
                    <td className="p-3 text-center">{item.date}</td>
                    <td className="p-3 text-center">{item.mode}</td>
                    <td className="p-3 text-center">{item.bank}</td>
                    <td className="p-3 text-center">{item.receipt}</td>

                    <td className="sticky right-0 bg-white p-3 text-right z-20 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]">
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
    </div>
  );
};

export default PaymentTable;