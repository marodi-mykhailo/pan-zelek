import { useState, useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';
import { getUsers, User } from '../../api/users';
import { Search, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const UsersAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.users);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Nie udało się załadować użytkowników',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Użytkownicy</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj użytkowników..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Użytkownik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data rejestracji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <UserIcon size={20} className="text-pink-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'Brak imienia'}</div>
                        <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'Nie znaleziono użytkowników' : 'Brak użytkowników'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Spróbuj zmienić kryteria wyszukiwania'
                : 'Nie ma jeszcze zarejestrowanych użytkowników'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAdmin;
