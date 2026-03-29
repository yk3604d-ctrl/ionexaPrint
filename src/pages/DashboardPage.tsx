import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Box, 
  Eye, 
  ChevronRight,
  AlertCircle,
  FileText,
  Edit3,
  X
} from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order, CustomDesignRequest } from '../types';
import ThreeViewer from '../components/ThreeViewer';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomDesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CustomDesignRequest | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const qOrders = query(collection(db, 'orders'), where('userId', '==', auth.currentUser.uid));
    const qRequests = query(collection(db, 'customRequests'), where('userId', '==', auth.currentUser.uid));

    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setCustomRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomDesignRequest)));
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubRequests();
    };
  }, []);

  const handleApproveSTL = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'customRequests', requestId), {
        status: 'approved'
      });
      toast.success('STL Preview Approved! We will start printing soon.');
      setSelectedRequest(null);
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">User <span className="text-neon-cyan">Dashboard</span></h1>
          <p className="text-gray-400">Track your orders and manage your custom designs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Orders & Requests List */}
        <div className="lg:col-span-2 space-y-12">
          {/* Active Orders */}
          <section>
            <h2 className="text-xl font-display font-bold mb-6 flex items-center">
              <Package className="mr-2 text-neon-cyan w-5 h-5" /> Active Orders
            </h2>
            {orders.length === 0 ? (
              <div className="glass-card p-8 text-center text-gray-500">No active orders found.</div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="glass-card p-6 flex flex-col md:row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/5 rounded-xl"><Box className="w-6 h-6 text-neon-cyan" /></div>
                      <div>
                        <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                        <span className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold rounded-full border border-neon-cyan/20">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-bold">${order.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Custom Requests */}
          <section>
            <h2 className="text-xl font-display font-bold mb-6 flex items-center">
              <FileText className="mr-2 text-neon-purple w-5 h-5" /> Custom Requests
            </h2>
            {customRequests.length === 0 ? (
              <div className="glass-card p-8 text-center text-gray-500">No custom requests found.</div>
            ) : (
              <div className="space-y-4">
                {customRequests.map(req => (
                  <div key={req.id} className="glass-card p-6 flex flex-col md:row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/5 rounded-xl"><Edit3 className="w-6 h-6 text-neon-purple" /></div>
                      <div>
                        <p className="font-bold line-clamp-1 max-w-[200px]">{req.description}</p>
                        <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                          req.status === 'ready_for_approval' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          req.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          'bg-white/10 text-white border-white/20'
                        }`}>
                          {req.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="p-3 bg-white/5 hover:bg-neon-cyan hover:text-black rounded-xl transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: STL Preview / Detail */}
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            {selectedRequest ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 border-neon-cyan/30"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-display font-bold text-lg">STL Preview</h3>
                  <button onClick={() => setSelectedRequest(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <ThreeViewer className="h-[300px] mb-6" />
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Price:</span>
                    <span className="font-bold text-neon-cyan">${selectedRequest.estimatedPrice || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Material:</span>
                    <span className="font-bold">PLA (Standard)</span>
                  </div>
                </div>

                {selectedRequest.status === 'ready_for_approval' ? (
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleApproveSTL(selectedRequest.id)}
                      className="w-full py-4 bg-neon-cyan text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
                    >
                      Approve & Pay
                    </button>
                    <button className="w-full py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                      Request Changes
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-sm text-gray-400">
                      {selectedRequest.status === 'approved' ? 'Design approved. Printing in progress.' : 'Design is still in progress. Check back soon!'}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center border-dashed border-dark-border">
                <Box className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Select a request to view STL preview and details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
