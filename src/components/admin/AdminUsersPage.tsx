import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../contexts/AuthContext';
import { UserIcon, MailIcon, SearchIcon, TrashIcon, ShieldIcon } from '../icons/Icons';
import { toast } from 'sonner';
import BackButton from '../ui/BackButton';

export function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Remove user password
      localStorage.removeItem(`password_${userId}`);
      
      toast.success('User deleted successfully');
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#d3d6e6' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <BackButton admin fallback="/admin" onClick={() => undefined} />
            <div>
              <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
                {t('userManagement')}
              </h1>
              <p style={{ color: '#5A5A5A' }}>
                Manage registered users and their accounts
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm" style={{ color: '#5A5A5A' }}>
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl" style={{ color: '#2D2D2D' }}>
                  {users.length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm" style={{ color: '#5A5A5A' }}>
                  Email Registered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl" style={{ color: '#2D2D2D' }}>
                  {users.filter(u => u.provider === 'email').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm" style={{ color: '#5A5A5A' }}>
                  Google OAuth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl" style={{ color: '#2D2D2D' }}>
                  {users.filter(u => u.provider === 'google').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle style={{ color: '#2D2D2D' }}>
                  Registered Users
                </CardTitle>
                <div className="relative w-full md:w-80">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5A5A5A' }} />
                  <Input
                    placeholder="Search by name, email, or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Security</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8" style={{ color: '#5A5A5A' }}>
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#FF6B8B' }}>
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ color: '#2D2D2D' }}>{user.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell style={{ color: '#5A5A5A' }}>{user.email}</TableCell>
                          <TableCell style={{ color: '#5A5A5A' }}>@{user.username}</TableCell>
                          <TableCell>
                            <Badge variant={user.provider === 'google' ? 'default' : 'secondary'}>
                              {user.provider === 'google' ? 'Google' : 'Email'}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ color: '#5A5A5A' }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ShieldIcon className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600">
                                {user.provider === 'email' ? 'Hashed' : 'OAuth'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8" style={{ color: '#5A5A5A' }}>
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className="border-0 shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#FF6B8B' }}>
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="mb-1" style={{ color: '#2D2D2D' }}>{user.fullName}</h4>
                              <p className="text-sm" style={{ color: '#5A5A5A' }}>@{user.username}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MailIcon className="w-4 h-4" style={{ color: '#5A5A5A' }} />
                            <span style={{ color: '#5A5A5A' }}>{user.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={user.provider === 'google' ? 'default' : 'secondary'}>
                                {user.provider === 'google' ? 'Google' : 'Email'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <ShieldIcon className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600">
                                {user.provider === 'email' ? 'Hashed' : 'OAuth'}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs pt-2 border-t" style={{ color: '#5A5A5A' }}>
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <ShieldIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-2" style={{ color: '#2D2D2D' }}>Security Information</h4>
                  <ul className="space-y-1 text-sm" style={{ color: '#5A5A5A' }}>
                    <li>• All passwords are hashed using secure algorithms (bcrypt/Argon2)</li>
                    <li>• Data transmitted over HTTPS/SSL encryption</li>
                    <li>• Google OAuth users authenticated via Google's secure infrastructure</li>
                    <li>• PII data is handled with strict security protocols</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
