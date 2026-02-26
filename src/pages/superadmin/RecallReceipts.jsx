import React, { useMemo, useState } from "react";
import RecallTable from "../../components/superadmin/RecallTable.jsx";
import RecallDrawer from "../../components/superadmin/RecallDrawer.jsx";
import RecallFilter from "../../components/superadmin/RecallFilter.jsx";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const RecallReceipts = () => {
  const [payments] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      sub: "1st Year / CSE",
      roll: "21CS001",
      semPeriod: "Even Sem",
      head: "Exam Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "Cash",
      bank: "Cash",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=1",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Status: "Approved",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 2,
      name: "Surya Chandran",
      sub: "1st Year / IT",
      roll: "21ECE011",
      semPeriod: "Odd Sem",
      head: "Software Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "UPI",
      bank: "ICICI",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=2",
      isrecallrequested: true,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 3,
      name: "Surya Chandran",
      sub: "2nd Year / ECE",
      roll: "21IT009",
      semPeriod: "Even Sem",
      head: "Software Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "UPI",
      bank: "CUB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=3",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Rejected",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 4,
      name: "Surya Chandran",
      sub: "3rd Year / EEE",
      roll: "21CS011",
      semPeriod: "Odd Sem",
      head: "Exam Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "DD",
      bank: "IOB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=4",
      isrecallrequested: true,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 5,
      name: "Surya Chandran",
      sub: "4th Year / MECH",
      roll: "21MEC061",
      semPeriod: "Odd Sem",
      head: "Tution Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "NEFT",
      bank: "ICICI",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=5",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 6,
      name: "Surya Chandran",
      sub: "2nd Year / ECE",
      roll: "21IT009",
      semPeriod: "Even Sem",
      head: "Software Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "UPI",
      bank: "CUB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=3",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Approved",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 7,
      name: "Surya Chandran",
      sub: "3rd Year / EEE",
      roll: "21CS011",
      semPeriod: "Odd Sem",
      head: "Exam Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "DD",
      bank: "IOB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=4",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Rejected",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 8,
      name: "Surya Chandran",
      sub: "4th Year / MECH",
      roll: "21MEC061",
      semPeriod: "Odd Sem",
      head: "Tution Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "NEFT",
      bank: "ICICI",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=5",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },

    
  ]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    year: "",
    dept: "",
    fromDate: "",
    toDate: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  //

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");

  const openRejectModal = (item) => {
    setSelectedItem(item);
    setIsRejectOpen(true);
  };

  const handleApprove = (item) => {
    toast.success("Recall Approved");
    console.log("Approved:", item);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      setError("Please enter reject reason");
      return;
    }

    const payload = {
      id: selectedItem.id,
      roll: selectedItem.roll,
      reason: rejectReason,
    };

    console.log("Reject Payload:", payload);
    toast.error("Recall Rejected");

    setIsDrawerOpen(false);
    setIsRejectOpen(false);
    setRejectReason("");
    setError("");
    setSelectedItem(null);
  };

  const counts = useMemo(() => {
    return payments.reduce(
      (acc, item) => {
        const status = item.Status.toLowerCase();

        if (status === "pending") acc.pending += 1;
        if (status === "approved") acc.approved += 1;
        if (status === "rejected") acc.rejected += 1;

        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 },
    );
  }, [payments]);
  const handleView = (row) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        Recall Receipts <span className="text-[#0B56A4]">(2025 - 2026)</span>
      </h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition font-semibold cursor-pointer ${
              activeTab === tab
                ? "bg-[#0B56A4] text-white"
                : "bg-white border border-gray-300 text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Recall Receipts
              </span>

              <span
                className={`
          `}
              >
                ({counts[tab]})
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <RecallFilter
        filters={filters}
        setFilters={setFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Table */}
      <RecallTable
        activeTab={activeTab}
        searchTerm={searchTerm}

        payments={payments}
        onView={handleView}
        onApprove={handleApprove}
        onReject={openRejectModal}
        filters={filters}

      />

      {/* Drawer */}
      <RecallDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedRow}
        onApprove={handleApprove}
        onReject={openRejectModal}
      />

      {isRejectOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsRejectOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-100 rounded-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                {" "}
                <h2 className="text-lg font-semibold ">Enter Reject Reason</h2>
                <div
                  className="bg-gray-300 p-1 w-fit rounded-full cursor-pointer"
                  onClick={() => setIsRejectOpen(false)}
                >
                  <X className="w-4 h-4" />
                </div>
              </div>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className={`w-full border rounded-md p-3 text-sm outline-none transition-colors ${
                  error
                    ? "border-red-500  focus:ring-red-500"
                    : "border-gray-300 "
                }`}
                placeholder="Type reject reason..."
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsRejectOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReject}
                  className="px-4 py-2 bg-[#0b56a4] text-white cursor-pointer rounded-md "
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecallReceipts;
