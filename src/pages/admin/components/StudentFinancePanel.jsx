export default function StudentFinancePanel({ student }) {
  return (
    <div className="w-[78%] bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Finance Details
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Fees</p>
          <p className="text-lg font-semibold">₹{student.totalFees}</p>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{student.paid}
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-lg font-semibold text-red-600">
            ₹{student.overdue}
          </p>
        </div>
      </div>
    </div>
  );
}