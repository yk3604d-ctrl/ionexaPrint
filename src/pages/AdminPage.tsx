import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Package, 
  Users, 
  Edit3, 
  Trash2, 
  Upload,
  CheckCircle,
  X,
  Eye
} from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Product, CustomDesignRequest, Order } from '../types';
import { toast } from 'sonner';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<CustomDesignRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'requests' | 'orders'>('products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pSnap = await getDocs(collection(db, 'products'));
        const rSnap = await getDocs(query(collection(db, 'customRequests'), orderBy('createdAt', 'desc')));
        const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));

        setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        setRequests(rSnap.docs.map(d => ({ id: d.id, ...d.data() } as CustomDesignRequest)));
        setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      } catch (error) {
        toast.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const seedProducts = async () => {
    const sampleProducts = [
      { name: 'Futuristic Phone Stand', description: 'Sleek, minimalist phone stand with cable management.', price: 19.99, category: 'Phone Stands', imageUrl: 'https://picsum.photos/seed/phone1/600/600' },
      { name: 'Geometric Desk Lamp', description: 'Modern lamp shade with intricate Voronoi patterns.', price: 45.00, category: 'Lamps', imageUrl: 'https://picsum.photos/seed/lamp1/600/600' },
      { name: 'Voronoi Planter', description: 'Elegant planter for succulents and small plants.', price: 24.99, category: 'Home Decor', imageUrl: 'https://picsum.photos/seed/plant1/600/600' },
      { name: 'Custom Name Plate', description: 'Personalized 3D printed name plate for your desk.', price: 29.99, category: 'Gifts', imageUrl: 'https://picsum.photos/seed/name1/600/600' },
    ];

    try {
      for (const p of sampleProducts) {
        await addDoc(collection(db, 'products'), p);
      }
      toast.success('Sample products seeded!');
      window.location.reload();
    } catch (error) {
      toast.error('Seeding failed');
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: string, price?: number) => {
    try {
      await updateDoc(doc(db, 'customRequests', id), { 
        status,
        ...(price && { estimatedPrice: price })
      });
      toast.success('Request updated');
      window.location.reload();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Admin <span className="text-neon-purple">Panel</span></h1>
          <p className="text-gray-400">Manage your business operations.</p>
        </div>
        <button 
          onClick={seedProducts}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold"
        >
          Seed Sample Products
        </button>
      </div>

      <div className="flex space-x-4 mb-12 border-b border-dark-border">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-gray-500'}`}
        >
          Products ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-gray-500'}`}
        >
          Custom Requests ({requests.length})
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-gray-500'}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      <div className="glass-card p-8">
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Product Catalog</h3>
              <button className="flex items-center px-4 py-2 bg-neon-cyan text-black font-bold rounded-lg text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="p-4 bg-dark-bg border border-dark-border rounded-xl flex items-center space-x-4">
                  <img src={p.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-neon-cyan">${p.price}</p>
                  </div>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-8">Custom Design Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-dark-border">
                    <th className="pb-4 font-bold">User</th>
                    <th className="pb-4 font-bold">Description</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {requests.map(req => (
                    <tr key={req.id} className="border-b border-dark-border/50">
                      <td className="py-6 font-mono text-xs">{req.userId.slice(0, 8)}</td>
                      <td className="py-6 max-w-xs truncate">{req.description}</td>
                      <td className="py-6">
                        <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold">{req.status.toUpperCase()}</span>
                      </td>
                      <td className="py-6">
                        <div className="flex space-x-2">
                          {req.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateRequestStatus(req.id, 'ready_for_approval', 49.99)}
                              className="px-3 py-1 bg-neon-cyan text-black text-[10px] font-bold rounded"
                            >
                              Send STL Preview
                            </button>
                          )}
                          <button className="p-2 hover:bg-white/5 rounded"><Eye className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-8">Recent Orders</h3>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-6 bg-dark-bg border border-dark-border rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-500">{order.userId}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <p className="font-bold text-neon-cyan">${order.totalPrice.toFixed(2)}</p>
                    <select 
                      className="bg-dark-surface border border-dark-border rounded px-3 py-1 text-xs outline-none"
                      value={order.status}
                      onChange={(e) => toast.info('Status update logic here')}
                    >
                      <option value="pending">Pending</option>
                      <option value="printing">Printing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
