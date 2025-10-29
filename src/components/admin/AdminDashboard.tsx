import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useOrders } from "../../contexts/OrderContext";
import { useProducts } from "../../contexts/ProductContext";
import {
  PackageIcon,
  TruckIcon,
  ShoppingCartIcon,
  CalendarIcon,
} from "../icons/Icons";
import BackButton from '../ui/BackButton';
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { TrendingUpIcon } from "lucide-react";

export function AdminDashboard() {
  const {
    orders,
    getTodayOrders,
    getTodayRevenue,
    getTotalRevenue,
    getTotalProductsSold,
    getTopSellingProducts,
  } = useOrders();
  const { products } = useProducts();

  const todayOrders = getTodayOrders();
  const todayRevenue = getTodayRevenue();
  const totalRevenue = getTotalRevenue();
  const totalProductsSold = getTotalProductsSold();
  const topSellingProducts = getTopSellingProducts(5);

  // Calculate stock levels
  const lowStockProducts = products.filter(
    (p) => (p.stock || 0) <= 5 && (p.stock || 0) > 0,
  );
  const outOfStockProducts = products.filter(
    (p) => (p.stock || 0) === 0,
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      subtitle: `Today: $${todayRevenue.toFixed(2)}`,
      icon: CalendarIcon,
      color: "#FF6B8B",
    },
    {
      title: "Total Orders",
      value: orders.length,
      subtitle: `Today: ${todayOrders.length}`,
      icon: ShoppingCartIcon,
      color: "#6A5AF8",
    },
    {
      title: "Products Sold",
      value: totalProductsSold,
      subtitle: "All time",
      icon: PackageIcon,
      color: "#4ECDC4",
    },
    {
      title: "Total Products",
      value: products.length,
      subtitle: "In catalog",
      icon: TruckIcon,
      color: "#FFB84D",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton admin fallback="/admin" />
        <div>
          <h1
            className="text-3xl mb-2"
            style={{
              fontFamily: "Berkshire Swash, cursive",
              color: "#2D2D2D",
            }}
          >
            Dashboard Overview
          </h1>
          <p style={{ color: "#5A5A5A" }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: stat.color + "20",
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: stat.color }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm mb-1"
                        style={{ color: "#5A5A5A" }}
                      >
                        {stat.title}
                      </p>
                      <p
                        className="text-3xl mb-1"
                        style={{ color: "#2D2D2D" }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "#5A5A5A" }}
                      >
                        {stat.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Top Selling Products */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: "#2D2D2D" }}>
            Top Selling Products
          </CardTitle>
          <CardDescription>
            Best performing products based on sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topSellingProducts.length > 0 ? (
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => {
                const maxSold =
                  topSellingProducts[0]?.quantitySold || 1;
                const percentage =
                  (product.quantitySold / maxSold) * 100;

                return (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: "#FF6B8B20",
                          }}
                        >
                          <span style={{ color: "#FF6B8B" }}>
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <p style={{ color: "#2D2D2D" }}>
                            {product.productName}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "#5A5A5A" }}
                          >
                            Revenue: $
                            {product.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p style={{ color: "#2D2D2D" }}>
                          {product.quantitySold} sold
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2"
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUpIcon
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "#d3d6e6" }}
              />
              <p style={{ color: "#5A5A5A" }}>
                No sales data yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      {(lowStockProducts.length > 0 ||
        outOfStockProducts.length > 0) && (
        <Card
          className="border-0 shadow-sm"
          style={{
            backgroundColor: "#FFF3CD",
            borderLeft: "4px solid #FFB84D",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#2D2D2D" }}>
              ⚠️ Stock Alerts
            </CardTitle>
            <CardDescription>
              Products that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockProducts.length > 0 && (
                <div>
                  <p
                    className="mb-2"
                    style={{ color: "#DC2626" }}
                  >
                    Out of Stock ({outOfStockProducts.length})
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {outOfStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "#FEE2E2" }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: "#2D2D2D" }}
                        >
                          {product.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "#DC2626" }}
                        >
                          Stock: 0
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lowStockProducts.length > 0 && (
                <div>
                  <p
                    className="mb-2"
                    style={{ color: "#F59E0B" }}
                  >
                    Low Stock ({lowStockProducts.length})
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "#FEF3C7" }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: "#2D2D2D" }}
                        >
                          {product.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "#F59E0B" }}
                        >
                          Stock: {product.stock}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: "#2D2D2D" }}>
            Recent Orders
          </CardTitle>
          <CardDescription>
            Latest customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 10).map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p style={{ color: "#2D2D2D" }}>
                      {order.id}
                    </p>
                    <Badge
                      className={getStatusColor(order.status)}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p
                    className="text-sm mb-1"
                    style={{ color: "#5A5A5A" }}
                  >
                    Customer: {order.customerName}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "#5A5A5A" }}
                  >
                    {order.items.length} items •{" "}
                    {new Date(
                      order.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-xl"
                    style={{ color: "#2D2D2D" }}
                  >
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <PackageIcon
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: "#d3d6e6" }}
                />
                <p style={{ color: "#5A5A5A" }}>
                  No orders yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Customers */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: "#2D2D2D" }}>
            Today's Customers
          </CardTitle>
          <CardDescription>
            Customers who ordered today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ backgroundColor: "#F7F7F7" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FF6B8B" }}
                >
                  <span className="text-white">
                    {order.customerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p style={{ color: "#2D2D2D" }}>
                    {order.customerName}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "#5A5A5A" }}
                  >
                    {order.customerEmail}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "#5A5A5A" }}
                  >
                    Ordered:{" "}
                    {order.items
                      .map((item) => item.name)
                      .join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: "#2D2D2D" }}>
                    ${order.total.toFixed(2)}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "#5A5A5A" }}
                  >
                    {new Date(
                      order.createdAt,
                    ).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}

            {todayOrders.length === 0 && (
              <div className="text-center py-8">
                <p style={{ color: "#5A5A5A" }}>
                  No orders today yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}