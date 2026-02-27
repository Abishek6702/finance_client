import React from "react";

const NewpaymnetTable = ({ selectedStudent, filters }) => {
    console.log(selectedStudent);
    
  return (
    <div className="w-full border rounded-xl p-4">
      <h3 className="text-md font-semibold mb-2">
        {filters.academicYear} - {filters.semester} Semester
      </h3>

      <p className="text-gray-600 text-sm">
        Showing payment data for {selectedStudent.name}
      </p>

      {/* Here you will later filter real payment data */}
    </div>
  );
};

export default NewpaymnetTable;