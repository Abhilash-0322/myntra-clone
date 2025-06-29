'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Eye,
  Download,
  Star,
  MessageCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    items: [
      {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        price: 49.99,
        quantity: 2,
        size: 'M',
        image: '/api/placeholder/100/100'
      },
      {
        id: 2,
        name: 'Denim Jeans',
        price: 199.99,
        quantity: 1,
        size: '32',
        image: '/api/placeholder/100/100'
      }
    ],
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20',
    shippingAddress: '123 Fashion Street, Style City, SC 12345'
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 149.99,
    items: [
      {
        id: 3,
        name: 'Casual Sneakers',
        price: 149.99,
        quantity: 1,
        size: '10',
        image: '/api/placeholder/100/100'
      }
    ],
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-18',
    shippingAddress: '123 Fashion Street, Style City, SC 12345'
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-05',
    status: 'processing',
    total: 89.99,
    items: [
      {
        id: 4,
        name: 'Hooded Sweatshirt',
        price: 89.99,
        quantity: 1,
        size: 'L',
        image: '/api/placeholder/100/100'
      }
    ],
    shippingAddress: '123 Fashion Street, Style City, SC 12345'
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'processing':
      return <Package className="w-4 h-4" />;
    case 'shipped':
      return <Truck className="w-4 h-4" />;
    case 'delivered':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <X className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your orders and view order history</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {mockOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                  <Button onClick={() => router.push('/products')}>
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>
                            Placed on {formatDate(order.date)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                          <span className="text-lg font-semibold">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <h4 className="font-medium mb-4">Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium">{item.name}</h5>
                                  <p className="text-sm text-gray-600">
                                    Size: {item.size} • Qty: {item.quantity}
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <p className="text-sm text-gray-600 flex items-start">
                              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              {order.shippingAddress}
                            </p>
                          </div>

                          {order.trackingNumber && (
                            <div>
                              <h4 className="font-medium mb-2">Tracking</h4>
                              <p className="text-sm text-gray-600">
                                #{order.trackingNumber}
                              </p>
                            </div>
                          )}

                          {order.estimatedDelivery && (
                            <div>
                              <h4 className="font-medium mb-2">Estimated Delivery</h4>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(order.estimatedDelivery)}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-col space-y-2 pt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Star className="w-4 h-4 mr-2" />
                                  Write Review
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Get Help
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending orders</h3>
                <p className="text-gray-600">All your orders are being processed or have been completed</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing">
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No processing orders</h3>
                <p className="text-gray-600">All your orders are either pending or have been shipped</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipped">
            <Card>
              <CardContent className="p-8 text-center">
                <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shipped orders</h3>
                <p className="text-gray-600">Your orders are either being processed or have been delivered</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivered">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No delivered orders</h3>
                <p className="text-gray-600">Your orders are still in progress</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Details - #{selectedOrder.id}</CardTitle>
                    <CardDescription>
                      Placed on {formatDate(selectedOrder.date)}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status Timeline */}
                <div>
                  <h4 className="font-medium mb-4">Order Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedOrder.date)}</p>
                      </div>
                    </div>
                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-gray-600">Order is being prepared</p>
                        </div>
                      </div>
                    )}
                    {['shipped', 'delivered'].includes(selectedOrder.status) && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Shipped</p>
                          <p className="text-sm text-gray-600">
                            Tracking: {selectedOrder.trackingNumber}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-sm text-gray-600">
                            {selectedOrder.estimatedDelivery && formatDate(selectedOrder.estimatedDelivery)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Detailed Items */}
                <div>
                  <h4 className="font-medium mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} • Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-4">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 