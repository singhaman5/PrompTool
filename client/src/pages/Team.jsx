import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Mail, MessageSquare, MoreVertical, Phone, Filter } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:3001/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setMembers(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading Team</div>
  }

  // Helper for Status Dot Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'Busy': return 'bg-red-500';
      case 'In Meeting': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-8">{/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Members</h1>
          <p className="text-gray-500 mt-1">Manage your team, permissions, and roles.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 w-64 transition-all"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <Filter size={18} /> Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
            <Plus size={18} /> Invite Member
          </button>
        </div>
      </div>

      {/* 2. Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Mapping Members */}
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group relative">

            {/* Top Right Menu */}
            <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>

            {/* Profile Section */}
            <div className="flex flex-col items-center text-center">

              {/* Avatar with Status Dot */}
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-full ${member.color} flex items-center justify-center text-3xl font-bold shadow-inner`}>
                  {member.name.charAt(0)}
                </div>
                <div className={`absolute bottom-1 right-1 w-5 h-5 border-[3px] border-white rounded-full ${getStatusColor(member.status)}`}></div>
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm font-medium text-gray-500 mb-4">{member.role}</p>

              {/* Skills Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[32px]">
                {member.tags?.map((tag, index) => (
                  <span key={index} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-md border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full border-t border-gray-50 pt-5 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group-hover:border-orange-100">
                  <Mail size={16} /> Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                  <MessageSquare size={16} /> Chat
                </button>
              </div>

            </div>
          </div>
        ))}

        {/* 'Add New' Placeholder Card */}
        <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50/50 transition-all min-h-[320px] group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors duration-300">
            <Plus size={32} />
          </div>
          <span className="font-semibold text-lg">Add Team Member</span>
          <span className="text-sm text-gray-400 mt-1"> invite via email</span>
        </button>

      </div>
    </div>
  );
};

export default Team;