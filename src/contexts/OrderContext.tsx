import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ProductSalesData {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceIDR?: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  total: number;
  shippingAmount?: number;
  totalIDR?: number;
  exchangeRate?: number;
  status: 'pending' | 'shipping' | 'arrived' | 'completed' | 'cancelled';
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  transferProof?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrdersByDate: (date: string) => Order[];
  getTodayOrders: () => Order[];
  getTotalRevenue: () => number;
  getTodayRevenue: () => number;
  getTotalProductsSold: () => number;
  getProductSalesData: () => ProductSalesData[];
  getTopSellingProducts: (limit?: number) => ProductSalesData[];
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const getOrdersByDate = (date: string) => {
    return orders.filter((order) => order.createdAt.startsWith(date));
  };

  const getTodayOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    return getOrdersByDate(today);
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  const getTodayRevenue = () => {
    return getTodayOrders().reduce((sum, order) => sum + order.total, 0);
  };

  const getTotalProductsSold = () => {
    return orders.reduce((total, order) => {
      return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
  };

  const getProductSalesData = (): ProductSalesData[] => {
    const salesMap = new Map<string, ProductSalesData>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = salesMap.get(item.id);
        if (existing) {
          existing.quantitySold += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          salesMap.set(item.id, {
            productId: item.id,
            productName: item.name,
            quantitySold: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    return Array.from(salesMap.values());
  };

  const getTopSellingProducts = (limit: number = 5): ProductSalesData[] => {
    const salesData = getProductSalesData();
    return salesData
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, limit);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrdersByDate,
        getTodayOrders,
        getTotalRevenue,
        getTodayRevenue,
        getTotalProductsSold,
        getProductSalesData,
        getTopSellingProducts,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}