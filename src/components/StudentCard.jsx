const StudentCard = ({ student, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center gap-4 p-3 mb-3 rounded-lg cursor-pointer transition-all
        border border-gray-300
        ${isSelected 
          ? "bg-gray-100 " 
          : " hover:bg-gray-100"}
      `}
    >
      <img 
        src={student.img} 
        alt={student.name} 
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div>
        <p className={`uppercase }`}>
          {student.id}
        </p>

        <h3 className={`text-base`}>
          {student.name}
        </h3>

        <p className="">
          {student.year} / {student.dept}
        </p>
      </div>
    </div>
  );
};

export default StudentCard;