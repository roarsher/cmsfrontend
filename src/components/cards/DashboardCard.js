const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
