import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Search, Mail, Users, ArrowLeft, MoreVertical, Filter } from 'lucide-react';

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'Member' });
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTeams(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    const name = window.prompt("Enter a new Team Name (e.g. Design Team):");
    if (!name) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/teams', { 
        name, 
        description: 'New Workspace Team' 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setTeams([...teams, res.data.data]);
      }
    } catch (err) {
      console.error("Error creating team:", err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/teams/invite', {
        teamId: selectedTeam._id,
        name: inviteData.name,
        email: inviteData.email,
        role: inviteData.role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Update the selected team with the newly fetched data
        setSelectedTeam(res.data.data);
        setShowInviteModal(false);
        setInviteData({ name: '', email: '', role: 'Member' });
        
        // Refresh the teams list in the background
        fetchTeams(); 
      }
    } catch (err) {
        alert("Failed to send invite");
        console.error(err);
    } finally {
        setInviteLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading Workspaces...</div>;

  // ==========================================
  // VIEW 1: TEAM DASHBOARD (List of out teams)
  // ==========================================
  if (!selectedTeam) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspaces</h1>
            <p className="text-gray-500 mt-1">Manage your teams and organizations.</p>
          </div>
          <button 
            onClick={handleCreateTeam}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Plus size={18} /> Create New Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
              No teams found. Create one to get started!
            </div>
          )}

          {teams.map((team) => (
            <div 
              key={team._id} 
              onClick={() => setSelectedTeam(team)}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-orange-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl">
                  {team.name.charAt(0)}
                </div>
                <div className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-2">
                   <Users size={14}/> {team.members.length}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{team.name}</h3>
              <p className="text-sm text-gray-500">{team.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: INSIDE A SPECIFIC TEAM
  // ==========================================
  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => setSelectedTeam(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Workspaces
          </button>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedTeam.name}</h1>
          <p className="text-gray-500 mt-1">Managed by {selectedTeam.owner.name}</p>
        </div>
        
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          <Mail size={18} /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTeam.members.map((memberWrap) => {
          const user = memberWrap.user; // Remember, we populated this!
          return (
            <div key={user._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all group relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {/* Fallback to gray if user.color is technically undefined from old db instances */}
                  <div className={`w-20 h-20 rounded-full ${user.color || 'bg-gray-100 text-gray-600'} flex items-center justify-center text-2xl font-bold shadow-inner`}>
                    {user.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md mb-2">{memberWrap.role}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* INVITE MODAL Overlay */}
      {/* ========================================== */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Invite to Team</h3>
            <p className="text-gray-500 text-sm mb-6">They will receive an email invitation to join.</p>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  required type="text" placeholder="John Doe"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  value={inviteData.name} onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  required type="email" placeholder="john@example.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  value={inviteData.email} onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={inviteData.role} onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={inviteLoading}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {inviteLoading ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;