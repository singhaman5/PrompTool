import React from 'react';

const StatCard = ({ icon, label, value, color }) => {
  // Define Gradient Maps instead of solid colors
  const styles = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      text: "text-blue-600"
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      text: "text-orange-600"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      text: "text-green-600"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      text: "text-red-600"
    },
  };

  // Get the style for the current color prop
  const currentStyle = styles[color] || styles.blue;

  return (
    <div className="bg-gradient-to-br from-white to-blue-100 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      
      {/* THE GRADIENT IS APPLIED HERE 👇 
         We use `bg-gradient-to-br` (Bottom Right) for a subtle 3D effect 
      */}
      <div className={`p-3 rounded-xl shadow-sm ${currentStyle.bg} ${currentStyle.text}`}>
        {icon}
      </div>
      
      <div>
        <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;