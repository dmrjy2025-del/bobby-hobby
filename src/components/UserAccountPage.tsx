import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { useProducts } from '../contexts/ProductContext';
import { useLanguage } from '../contexts/LanguageContext';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, PackageIcon, TruckIcon, EditIcon, PlusIcon, TrashIcon, HeartIcon, LockIcon, CakeIcon, ShoppingBagIcon, SettingsIcon } from './icons/Icons';
import BackButton from './ui/BackButton';
import { toast } from 'sonner';
import { countries } from './CountryList';

interface UserAccountPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function UserAccountPage({ onNavigate, onLogout }: UserAccountPageProps) {
  const { user, updateUser } = useAuth();
  const { orders } = useOrders();
  const { products } = useProducts();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('purchases');
  
  // Personal Info State
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    age: (user as any)?.age || '',
  });

  // Login Details State
  const [isEditingLoginDetails, setIsEditingLoginDetails] = useState(false);
  const [loginEmail, setLoginEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(`wishlist_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  if (!user) return null;

  const userOrders = orders.filter(order => order.customerEmail === user.email);
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Personal Info Handlers
  const handleUpdatePersonalInfo = () => {
    if (!personalInfo.fullName) {
      toast.error('Name is required');
      return;
    }

    updateUser({
      fullName: personalInfo.fullName,
      email: personalInfo.email,
      age: personalInfo.age,
    } as any);

    setIsEditingPersonalInfo(false);
    toast.success('Personal information updated! ✅');
  };

  // Login Details Handlers
  const handleUpdateLoginDetails = () => {
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      // Update password
      localStorage.setItem(`password_${user.id}`, newPassword);
      toast.success('Password updated successfully! 🔒');
    }

    if (loginEmail !== user.email) {
      updateUser({ email: loginEmail });
      toast.success('Email updated successfully! ✅');
    }

    setIsEditingLoginDetails(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Address Handlers
  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.fullAddress || !newAddress.country) {
      toast.error('Please fill in required fields (Label, Address, Country)');
      return;
    }

    const address = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: user.addresses.length === 0,
    };

    updateUser({
      addresses: [...user.addresses, address],
    });

    setNewAddress({
      label: '',
      fullAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setIsAddingAddress(false);
    toast.success('Address added successfully! 📍');
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      updateUser({
        addresses: user.addresses.filter(addr => addr.id !== id),
      });
      toast.success('Address deleted');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    updateUser({
      addresses: user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    });
    toast.success('Default address updated');
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
    
    toast.success(
      wishlist.includes(productId) 
        ? 'Removed from wishlist' 
        : 'Added to wishlist! 💗'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-8 relative"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <BackButton onClick={() => undefined} />
              <div>
                <h1 className="mb-2" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
                  Hey, {user.fullName}! 👋
                </h1>
                <p style={{ color: '#5A5A5A' }}>
                  Welcome to your personal dashboard
                </p>
              </div>
            </div>

            {/* Small logout button for web only (mobile uses global navbar/sheet) */}
            <div className="hidden md:flex items-center">
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="rounded-full text-sm"
                aria-label="Logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mobile: small logout button positioned to the top-right of the header */}
        {/* Use absolute positioning so it appears to the right of the greeting on small screens */}
        {/* motion.div above is set to relative so this absolute button sits correctly */}

        <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-4 mb-4 md:mb-8">
            <TabsTrigger value="purchases" aria-label="My Purchases" className="flex items-center justify-center gap-2 text-[12px] md:text-sm whitespace-nowrap px-3 py-2 rounded-full hover:opacity-80 transition-opacity duration-200">
              <span className="block md:hidden"><ShoppingBagIcon className="w-4 h-4" /></span>
              <span className="hidden md:inline">My Purchases</span>
            </TabsTrigger>
            <TabsTrigger value="profile" aria-label="Profile" className="flex items-center justify-center gap-2 text-[12px] md:text-sm whitespace-nowrap px-3 py-2 rounded-full hover:opacity-80 transition-opacity duration-200">
              <span className="block md:hidden"><UserIcon className="w-4 h-4" /></span>
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" aria-label="Addresses" className="flex items-center justify-center gap-2 text-[12px] md:text-sm whitespace-nowrap px-3 py-2 rounded-full hover:opacity-80 transition-opacity duration-200">
              <span className="block md:hidden"><MapPinIcon className="w-4 h-4" /></span>
              <span className="hidden md:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" aria-label="Wishlist" className="flex items-center justify-center gap-2 text-[12px] md:text-sm whitespace-nowrap px-3 py-2 rounded-full hover:opacity-80 transition-opacity duration-200">
              <span className="block md:hidden"><HeartIcon className="w-4 h-4" /></span>
              <span className="hidden md:inline">Wishlist</span>
            </TabsTrigger>
          </TabsList>

          {/* Logout moved to global Navbar/Header - removed from this page */}

          {/* My Purchases Tab */}
          <TabsContent value="purchases">
            <Card className="mt-4 border-0 shadow-sm mb-6">
              <CardHeader>
                <CardTitle style={{ color: '#2D2D2D' }}>Purchase History</CardTitle>
                <CardDescription>Track your orders and shipments</CardDescription>
              </CardHeader>
              <CardContent>
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 style={{ color: '#2D2D2D' }}>{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm" style={{ color: '#5A5A5A' }}>
                              Ordered on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-xl" style={{ color: '#2D2D2D' }}>
                            ${order.total.toFixed(2)}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p style={{ color: '#2D2D2D' }}>{item.name}</p>
                                <p className="text-sm" style={{ color: '#5A5A5A' }}>
                                  {item.brand} • Qty: {item.quantity}
                                </p>
                              </div>
                              <p style={{ color: '#2D2D2D' }}>${item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#F0F9FF' }}>
                          <div className="flex items-start gap-3">
                            <TruckIcon className="w-5 h-5 mt-1" style={{ color: '#3B82F6' }} />
                            <div>
                              <p className="text-sm mb-1" style={{ color: '#2D2D2D' }}>
                                <strong>Shipping Address:</strong>
                              </p>
                              <p className="text-sm" style={{ color: '#5A5A5A' }}>
                                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PackageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#d3d6e6' }} />
                    <p className="mb-4" style={{ color: '#5A5A5A' }}>
                      No purchases yet
                    </p>
                    <Button
                      onClick={() => onNavigate('catalog')}
                      className="text-white rounded-full mt-4"
                      style={{ backgroundColor: '#FF6B8B' }}
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="mt-4 border-0 shadow-sm mb-6">
              <CardHeader>
                <CardTitle style={{ color: '#2D2D2D' }}>Profile Information</CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                    <UserIcon className="w-8 h-8" style={{ color: '#FF6B8B' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#5A5A5A' }}>Full Name</p>
                      <p style={{ color: '#2D2D2D' }}>{user.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                    <MailIcon className="w-8 h-8" style={{ color: '#FF6B8B' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#5A5A5A' }}>Email</p>
                      <p style={{ color: '#2D2D2D' }}>{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                    <UserIcon className="w-8 h-8" style={{ color: '#FF6B8B' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#5A5A5A' }}>Username</p>
                      <p style={{ color: '#2D2D2D' }}>{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                    <CakeIcon className="w-8 h-8" style={{ color: '#FF6B8B' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#5A5A5A' }}>Age</p>
                      <p style={{ color: '#2D2D2D' }}>{(user as any).age || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFF0F3' }}>
                  <p className="text-sm" style={{ color: '#5A5A5A' }}>
                    <strong>Account Type:</strong> {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#5A5A5A' }}>
                    <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings merged here */}
            <div className="space-y-6">
              {/* Personal Information (editable) */}
              <Card className="mt-4 border-0 shadow-sm mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle style={{ color: '#2D2D2D' }}>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditingPersonalInfo && (
                      <Button
                        onClick={() => {
                          setIsEditingPersonalInfo(true);
                          setPersonalInfo({
                            fullName: user.fullName,
                            email: user.email,
                            age: (user as any).age || '',
                          });
                        }}
                        variant="icon"
                        size="circle"
                        aria-label="Edit personal information"
                        className="mt-2 md:mt-0 btn-icon-shadow"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Full Name *</Label>
                    {isEditingPersonalInfo ? (
                      <Input
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        className="mt-2"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center gap-3 mt-2 p-3 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                        <UserIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                        <span style={{ color: '#2D2D2D' }}>{user.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Email Address *</Label>
                    {isEditingPersonalInfo ? (
                      <Input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="mt-2"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="flex items-center gap-3 mt-2 p-3 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                        <MailIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                        <span style={{ color: '#2D2D2D' }}>{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Age (Optional)</Label>
                    {isEditingPersonalInfo ? (
                      <Input
                        type="number"
                        value={personalInfo.age}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                        className="mt-2"
                        placeholder="Enter your age"
                      />
                    ) : (
                      <div className="flex items-center gap-3 mt-2 p-3 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                        <CakeIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                        <span style={{ color: '#2D2D2D' }}>{(user as any).age || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  {isEditingPersonalInfo && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleUpdatePersonalInfo}
                        className="text-white rounded-full"
                        style={{ backgroundColor: '#FF6B8B' }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditingPersonalInfo(false)}
                        variant="outline"
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Login Details (editable) */}
              <Card className="mt-4 border-0 shadow-sm mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle style={{ color: '#2D2D2D' }}>Login Details</CardTitle>
                      <CardDescription>Manage your email and password</CardDescription>
                    </div>
                    {!isEditingLoginDetails && (
                      <Button
                        onClick={() => setIsEditingLoginDetails(true)}
                        variant="icon"
                        size="circle"
                        aria-label="Edit login details"
                        className="mt-2 md:mt-0 btn-icon-shadow"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email Address</Label>
                    {isEditingLoginDetails ? (
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="mt-2"
                        placeholder="Enter new email"
                      />
                    ) : (
                      <div className="flex items-center gap-3 mt-2 p-3 rounded-xl" style={{ backgroundColor: '#F7F7F7' }}>
                        <MailIcon className="w-5 h-5" style={{ color: '#FF6B8B' }} />
                        <span style={{ color: '#2D2D2D' }}>{user.email}</span>
                      </div>
                    )}
                  </div>

                  {isEditingLoginDetails && (
                    <>
                      <div className="pt-4 border-t">
                        <h4 className="mb-4" style={{ color: '#2D2D2D' }}>Change Password</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <Label>New Password</Label>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="mt-2"
                              placeholder="Enter new password"
                            />
                            <p className="text-xs mt-1" style={{ color: '#5A5A5A' }}>
                              Leave blank to keep current password
                            </p>
                          </div>

                          <div>
                            <Label>Confirm New Password</Label>
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="mt-2"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Button
                          onClick={handleUpdateLoginDetails}
                          className="text-white rounded-full w-full sm:w-auto"
                          style={{ backgroundColor: '#FF6B8B' }}
                        >
                          Update Login Details
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingLoginDetails(false);
                            setLoginEmail(user.email);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          variant="outline"
                          className="rounded-full w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card className="mt-4 border-0 shadow-sm mb-6">
                <CardHeader>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <CardTitle style={{ color: '#2D2D2D' }}>Saved Addresses</CardTitle>
                      <CardDescription>Manage your shipping addresses</CardDescription>
                    </div>
                    <div className="w-full md:w-auto">
                      <Button
                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                        className="text-white rounded-full w-full md:w-auto"
                        style={{ backgroundColor: '#FF6B8B' }}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="space-y-4">
                  {isAddingAddress && (
                  <Card className="mt-4 border-2" style={{ borderColor: '#FF6B8B' }}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Address Label *</Label>
                          <Input
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                            placeholder="e.g., Home, Office"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Full Address *</Label>
                          <Input
                            value={newAddress.fullAddress}
                            onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                            placeholder="Street address"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="City"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>State/Province</Label>
                          <Input
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            placeholder="State or Province"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Zip Code</Label>
                          <Input
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            placeholder="Postal/Zip Code"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Country *</Label>
                          <Select
                            value={newAddress.country}
                            onValueChange={(value: string) => setNewAddress({ ...newAddress, country: value })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Button
                          onClick={handleAddAddress}
                          className="text-white rounded-full w-full sm:w-auto"
                          style={{ backgroundColor: '#FF6B8B' }}
                        >
                          Save Address
                        </Button>
                        <Button
                          onClick={() => setIsAddingAddress(false)}
                          variant="outline"
                          className="rounded-full w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {user.addresses.map((address) => (
                  <Card key={address.id} className={(address.isDefault ? 'border-2' : '') + ' mt-4'} style={address.isDefault ? { borderColor: '#FF6B8B' } : {}}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <MapPinIcon className="w-5 h-5 mt-1" style={{ color: '#FF6B8B' }} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p style={{ color: '#2D2D2D' }}>{address.label}</p>
                              {address.isDefault && (
                                <Badge style={{ backgroundColor: '#FF6B8B' }} className="text-white">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: '#5A5A5A' }}>
                              {address.fullAddress}
                              {address.city && `, ${address.city}`}
                              {address.state && `, ${address.state}`}
                              {address.zipCode && ` ${address.zipCode}`}
                              {address.country && `, ${address.country}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <Button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteAddress(address.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-red-500 border-red-500 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {user.addresses.length === 0 && !isAddingAddress && (
                  <div className="text-center py-12">
                    <MapPinIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#d3d6e6' }} />
                    <p style={{ color: '#5A5A5A' }}>No addresses saved yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="mt-4 border-0 shadow-sm mb-6">
              <CardHeader>
                <CardTitle style={{ color: '#2D2D2D' }}>My Wishlist</CardTitle>
                <CardDescription>Products you love</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border rounded-xl overflow-hidden"
                      >
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            onClick={() => toggleWishlist(product.id)}
                            size="icon"
                            className="absolute top-3 right-3 rounded-full"
                            style={{ backgroundColor: '#FF6B8B' }}
                          >
                            <HeartIcon className="w-5 h-5 text-white fill-white" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <p className="text-xs mb-1" style={{ color: '#FF6B8B' }}>
                            {product.brand}
                          </p>
                          <h3 className="mb-2" style={{ color: '#2D2D2D' }}>
                            {product.name}
                          </h3>
                          <p className="text-xl" style={{ color: '#2D2D2D' }}>
                            ${product.price.toFixed(2)}
                          </p>
                          <Button
                            onClick={() => onNavigate(`product-${product.id}`)}
                            className="w-full mt-4 text-white rounded-full"
                            style={{ backgroundColor: '#FF6B8B' }}
                          >
                            View Details
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HeartIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#d3d6e6' }} />
                    <p className="mb-4" style={{ color: '#5A5A5A' }}>
                      Your wishlist is empty
                    </p>
                    <Button
                      onClick={() => onNavigate('catalog')}
                      className="text-white rounded-full mt-4"
                      style={{ backgroundColor: '#FF6B8B' }}
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Merge Account Settings into Profile for one combined Profile view */}
        </Tabs>
      </div>
    </div>
  );
}