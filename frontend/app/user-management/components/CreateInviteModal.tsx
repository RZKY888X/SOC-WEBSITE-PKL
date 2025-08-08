'use client';

import { useState, useEffect } from 'react';

interface CreateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInviteModal({
  isOpen,
  onClose,
}: CreateInviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setRole('user');
      setSuccessMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFormValid = () => email;

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to send invite:', result);
        setSuccessMessage(`❌ ${result.error || 'Failed to send invitation'}`);
        return;
      }

      console.log('✅ Invitation sent successfully');
      setSuccessMessage('✅ Invitation sent successfully!');
    } catch (error) {
      console.error('Error inviting user:', error);
      setSuccessMessage('❌ Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage('');
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'>
      <div className='bg-[#0C1A2A] rounded-lg w-full max-w-md p-6 shadow-lg'>
        <h2 className='text-white text-lg font-semibold mb-4'>Invite User</h2>

        {successMessage ? (
          <div className='text-center'>
            <p className='text-white mb-4'>{successMessage}</p>
            <button
              onClick={handleClose}
              className='px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition'
            >
              OK
            </button>
          </div>
        ) : (
          <>
            {/* Email Input */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm text-white mb-1'>Email</label>
                <input
                  type='email'
                  placeholder='name@example.com'
                  className='w-full px-3 py-2 rounded bg-[#091521] text-white border border-[#1f2d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className='block text-sm text-white mb-1'>Role</label>
                <select
                  className='w-full px-3 py-2 rounded bg-[#091521] text-white border border-[#1f2d3d] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value='superadmin'>Super Admin</option>
                  <option value='admin'>Admin</option>
                  <option value='user'>User</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className='flex justify-end mt-6 gap-2'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-sm bg-[#1f2d3d] text-white rounded hover:bg-[#2b3f56] transition'
                disabled={loading}
              >
                Cancel
              </button>
              <button
                disabled={!isFormValid() || loading}
                onClick={handleSubmit}
                className={`px-4 py-2 text-sm rounded transition ${
                  isFormValid() && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Inviting...' : 'Invite'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
