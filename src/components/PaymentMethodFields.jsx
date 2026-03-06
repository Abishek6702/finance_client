import React from "react";

const PaymentMethodFields = ({ paymentMethod, formData, setFormData }) => {
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  switch (paymentMethod) {
    case "UPI":
      return (
        <div className="mt-3">
          <input
            type="text"
            placeholder="UPI Transaction ID"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.upiId || ""}
            onChange={(e) => handleChange("upiId", e.target.value)}
          />
        </div>
      );

    case "Cheque":
      return (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Cheque Number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.chequeNumber || ""}
            onChange={(e) => handleChange("chequeNumber", e.target.value)}
          />
          <input
            type="text"
            placeholder="Bank Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        </div>
      );

    case "DD":
      return (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="DD Number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.ddNumber || ""}
            onChange={(e) => handleChange("ddNumber", e.target.value)}
          />
          <input
            type="text"
            placeholder="Bank Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        </div>
      );
    case "Card":
      return (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Last 4 digits"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.cardLast4 || ""}
            onChange={(e) => handleChange("cardLast4", e.target.value)}
          />
        </div>
      );

    case "Net Banking":
      return (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Transaction Reference"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.reference || ""}
            onChange={(e) => handleChange("reference", e.target.value)}
          />
          <input
            type="text"
            placeholder="Bank Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={formData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        </div>
      );

    default:
      return null;
  }
};

export default PaymentMethodFields;
