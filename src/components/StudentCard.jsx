const StudentCard = ({ student, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-3 mb-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
    >
      <img 
        src={student.img} 
        alt={student.name} 
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div>
        <p className="uppercase">{student.id}</p>
        <h3 className="group-hover:text-blue-600">{student.name}</h3>
        <p className="">{student.year} / {student.dept}</p>
      </div>
    </div>
  );
};

export default StudentCard;