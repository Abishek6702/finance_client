import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Scissors } from "lucide-react";

export default function ReceiptPage() {
  const { receiptNo } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/feePayment/bill/${receiptNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadReceipt();
  }, [receiptNo]);

  if (!data) return <div className="p-10 text-center">Loading receipt...</div>;

  return (
    <>
      <div className="max-w-[720px] mx-auto p-6 font-sans text-sm ">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <img src="/logo.svg" alt="logo" className="h-[70px]" />
          </div>

          <div className="text-center flex-1 px-3">
            <div className="text-xl font-bold">
              Sri Eshwar College of Engineering
            </div>

            <div className="text-xs">(An Autonomous Institution)</div>

            <div className="text-xs">
              Approved by AICTE, New Delhi and Affiliated to Anna University,
              Chennai
            </div>

            <div className="font-bold text-sm mt-1">
              Kondampatti (Post), Kinathukadavu (Tk), Coimbatore – 641 202
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <img src="/nac.svg" alt="naac" className="h-[36px]" />
            <img src="/nba.svg" alt="nba" className="h-[36px]" />
          </div>
        </div>

        {/* RECEIPT BOX */}

        <div className="border border-black">
          {/* ROW 1 */}

          <div className="grid grid-cols-2 border-b">
            <div className="p-2">
              <span className="font-semibold">Receipt No:</span> {receiptNo}
            </div>

            <div className="p-2">
              <span className="font-semibold">Date:</span> {data.date}
            </div>
          </div>

          {/* ROW 2 */}

          <div className="grid grid-cols-2">
            <div className="px-2 py-1">
              <span className="font-semibold">Name:</span> {data.studentName}
            </div>

            <div className="px-2 p-1">
              <span className="font-semibold">Class:</span> {data.year}{" "}
              {data.educationType} {data.department} - {data.section}
            </div>
          </div>

          {/* ROW 3 */}

          <div className="grid grid-cols-2 border-b">
            <div className="px-2 py-1">
              <span className="font-semibold">Roll no:</span> {data.rollNo}
            </div>

            <div className="px-2 py-1">
              <span className="font-semibold">Sem period:</span>{" "}
              {data.paidForSemNumber % 2 == 0 ? "Even" : "Odd"} -{" "}
              {data.paidForAcadamicYear}
            </div>
          </div>

          {/* TABLE */}

          <table className="w-full text-sm ">
            <thead className="">
              <tr className="">
                <th className=" w-[40px] text-center border-r border-b">Sl.</th>
                <th className=" text-center border-r border-b">Particulars</th>
                <th className=" p-2 text-right pr-5 w-[120px] border-b">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(data.breakdowns || {}).map(
                ([name, amount], index) => (
                  <tr key={index}>
                    <td className=" border-b border-dashed border-r  p-2 text-center">
                      {index + 1}
                    </td>

                    <td className=" border-b border-r border-dashed p-2">
                      {name}
                    </td>

                    <td className=" border-b border-dashed p-2 text-right">
                      {amount.toLocaleString()}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {/* PAYMENT ROW */}

          <div className=" p-2  flex  gap-4">
            <span>Cheque / DD subjected to realization.</span>

            <span className="flex gap-2">
              <p>Cash</p> <span className="font-bold">{data.cashAmount}</span>
            </span>

            <span className="flex gap-2">
              <p>Bank</p> <span className="font-bold">{data.bankAmount}</span>
            </span>

            <span className="flex gap-2">
              <p>Adj:</p> <span>0</span>
            </span>

            <span className="flex gap-2">
              <p>Fine</p> <span>0</span>
            </span>
          </div>

          {/* TOTAL ROW */}

          <div className="grid grid-cols-[1fr_auto_auto] border-t items-center">
            <div className="p-2 italic">{data.amountInWords}</div>

            <div className="font-bold pr-2">Total</div>

            <div className="font-bold text-right pr-3">
              {data.totalAmount.toLocaleString()}
            </div>
          </div>

          {/* FOOTER */}

          <div className="grid grid-cols-2 border-t p-3 text-xs">
            <div>
              Union Bank of India - Kinathukadavu Direct Remittance
              <br />#{data.studentName} - {data.date} Direct Remittance Amount
            </div>

            <div className="text-right">
              <div>For Sri Eshwar College of Engineering</div>

              <div className="mt-8">Authorized Signatory</div>
            </div>
          </div>
        </div>
        <div className="relative my-6">
          {/* Left cut */}
          <div className="absolute -left-3  -translate-y-1/2 text-gray-600">
            <Scissors className="w-5 h-5" />
          </div>

          {/* Dashed line */}
          <hr className="border-dashed border-t border-gray-500" />
        </div>
      </div>
    </>
  );
}
