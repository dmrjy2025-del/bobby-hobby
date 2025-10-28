import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOrders } from '../../contexts/OrderContext';
import { PackageIcon, TruckIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '../icons/Icons';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'shipping' | 'arrived' | 'completed' | 'cancelled';

export function AdminOrdersPage() {
  const { t } = useLanguage();
  const { orders, updateOrderStatus } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipping':
        return 'bg-blue-100 text-blue-800';
      case 'arrived':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'shipping':
        return <TruckIcon className="w-4 h-4" />;
      case 'arrived':
        return <PackageIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Order status updated successfully', {
      description: `Order ${orderId} is now ${newStatus}`,
    });
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    arrived: orders.filter(o => o.status === 'arrived').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#d3d6e6' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
            {t('orderManagement')}
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Manage customer orders and update shipping status
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs md:text-sm" style={{ color: '#5A5A5A' }}>
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl" style={{ color: '#2D2D2D' }}>
                  {stats.total}
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
                <CardTitle className="text-xs md:text-sm" style={{ color: '#5A5A5A' }}>
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl text-yellow-600">
                  {stats.pending}
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
                <CardTitle className="text-xs md:text-sm" style={{ color: '#5A5A5A' }}>
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl text-blue-600">
                  {stats.shipping}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs md:text-sm" style={{ color: '#5A5A5A' }}>
                  Arrived
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl text-green-600">
                  {stats.arrived}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs md:text-sm" style={{ color: '#5A5A5A' }}>
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl" style={{ color: '#2D2D2D' }}>
                  {stats.completed}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle style={{ color: '#2D2D2D' }}>
                  All Orders
                </CardTitle>
                <Select value={filterStatus} onValueChange={(value: string) => setFilterStatus(value as OrderStatus | 'all')}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="arrived">Arrived</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8" style={{ color: '#5A5A5A' }}>
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell style={{ color: '#2D2D2D' }}>
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div style={{ color: '#2D2D2D' }}>{order.customerName}</div>
                              <div className="text-sm" style={{ color: '#5A5A5A' }}>{order.customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell style={{ color: '#5A5A5A' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell style={{ color: '#5A5A5A' }}>
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </TableCell>
                          <TableCell style={{ color: '#2D2D2D' }}>
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 'Credit Card'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`flex items-center gap-2 w-fit ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {t(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={order.status}
                              onValueChange={(value: string) => handleStatusUpdate(order.id, value as OrderStatus)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shipping">Shipping</SelectItem>
                                <SelectItem value="arrived">Arrived</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8" style={{ color: '#5A5A5A' }}>
                    No orders found
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <Card key={order.id} className="border-0 shadow">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="mb-1" style={{ color: '#2D2D2D' }}>
                              #{order.id.slice(0, 8)}
                            </h4>
                            <p className="text-sm" style={{ color: '#5A5A5A' }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {t(order.status)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-xs" style={{ color: '#5A5A5A' }}>Customer:</span>
                            <div style={{ color: '#2D2D2D' }}>{order.customerName}</div>
                            <div className="text-xs" style={{ color: '#5A5A5A' }}>{order.customerEmail}</div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <span className="text-xs" style={{ color: '#5A5A5A' }}>Items:</span>
                              <div style={{ color: '#2D2D2D' }}>{order.items.length}</div>
                            </div>
                            <div>
                              <span className="text-xs" style={{ color: '#5A5A5A' }}>Total:</span>
                              <div style={{ color: '#2D2D2D' }}>${order.total.toFixed(2)}</div>
                            </div>
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                {order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod === 'bank-transfer' ? 'Bank' : 'Card'}
                              </Badge>
                            </div>
                          </div>

                          <div className="pt-2">
                            <label className="text-xs mb-2 block" style={{ color: '#5A5A5A' }}>Update Status:</label>
                            <Select
                              value={order.status}
                              onValueChange={(value: string) => handleStatusUpdate(order.id, value as OrderStatus)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shipping">Shipping</SelectItem>
                                <SelectItem value="arrived">Arrived</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
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
      </div>
    </div>
  );
}
