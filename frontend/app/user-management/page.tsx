'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiTrash2 } from 'react-icons/fi';
import CreateInviteModal from './components/CreateInviteModal';

type User = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: string | null;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user list
  const fetchUsers = () => {
    fetch('http://localhost:3001/api/user')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to fetch users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/user/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('User deleted successfully');
        fetchUsers(); // Refresh user list
      } else {
        const errorData = await res.json();
        alert('Failed to delete user: ' + errorData.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the user');
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const name = user.name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const username = user.username?.toLowerCase() || '';
      const searchTerm = search.toLowerCase();
      return (
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        username.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'role') return (a.role || '').localeCompare(b.role || '');
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className='min-h-screen bg-[#0D1B2A] text-white p-6 space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <h1 className='text-xl font-semibold'>User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-[#1E4DB7] px-5 py-2 rounded text-white font-medium text-sm'
        >
          Invite User
        </button>
      </div>

      {/* Controls */}
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Search */}
          <div className='flex items-center bg-[#132132] px-3 py-2 rounded'>
            <FiSearch className='text-gray-400 mr-2' />
            <input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='bg-transparent outline-none text-sm placeholder-gray-400 text-white'
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='bg-[#132132] text-white text-sm px-4 py-2 rounded'
          >
            <option value='createdAt'>Sort By: Created</option>
            <option value='name'>Sort By: Name</option>
            <option value='role'>Sort By: Role</option>
          </select>

          {/* Filter Icon */}
          <button className='bg-[#132132] p-2 rounded'>
            <FiFilter className='text-white' />
          </button>
        </div>
      </div>

      {/* Modal */}
      <CreateInviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* User Table */}
      <div className='overflow-auto rounded-lg border border-[#1C2C3A]'>
        <table className='min-w-full text-sm'>
          <thead className='bg-[#030E1C] text-white'>
            <tr>
              <th className='px-4 py-2 text-left'>Name</th>
              <th className='px-4 py-2 text-left'>Email</th>
              <th className='px-4 py-2 text-left'>Username</th>
              <th className='px-4 py-2 text-left'>Role</th>
              <th className='px-4 py-2 text-left'>Status</th>
              <th className='px-4 py-2 text-left'>Created At</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-[#0C1A2A]'>
            {filteredUsers.map((user) => (
              <tr key={user.id} className='border-t border-[#1C2C3A]'>
                <td className='px-4 py-2'>{user.name || '-'}</td>
                <td className='px-4 py-2'>{user.email || '-'}</td>
                <td className='px-4 py-2'>{user.username || '-'}</td>
                <td className='px-4 py-2 capitalize'>{user.role || '-'}</td>
                <td className='px-4 py-2'>
                  {user.isActivated ? 'Active' : 'Inactive'}
                </td>
                <td className='px-4 py-2'>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : '-'}
                </td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className='text-red-500 hover:text-red-700 transition'
                    title='Delete user'
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
