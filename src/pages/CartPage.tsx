import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  ChevronRight,
  Box
} from 'lucide-react';
import { toast } from 'sonner';

// Mock cart data for now
const initialCart = [
  { id: '1', name: 'Futuristic Phone Stand', price: 19.99, quantity: 1, image: 'https://picsum.photos/seed/phone/200/200' },
  { id: '2', name: 'Geometric Lamp', price: 45.00, quantity: 1, image: 'https://picsum.photos/seed/lamp/200/200' },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="text-gray-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
          <button 
            onClick={() => window.location.href = '/shop'}
            className="px-8 py-4 bg-neon-cyan text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-display font-bold mb-12">Shopping <span className="text-neon-cyan">Cart</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col sm:row items-center gap-6"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-neon-cyan font-bold">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-4 bg-dark-bg border border-dark-border rounded-xl p-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-neon-cyan transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-neon-cyan transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <button 
                onClick={() => removeItem(item.id)}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}

          <div className="glass-card p-8 border-dashed border-dark-border">
            <div className="flex items-center space-x-4 text-gray-400">
              <ShieldCheck className="w-6 h-6 text-neon-cyan" />
              <p className="text-sm">Secure checkout powered by IONEXA encryption. Your data is safe with us.</p>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-32">
            <h3 className="text-xl font-display font-bold mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-white font-bold">${shipping.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-dark-border flex justify-between text-xl font-display font-bold">
                <span>Total</span>
                <span className="text-neon-cyan">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full py-5 bg-white text-black font-bold rounded-xl hover:bg-neon-cyan transition-all duration-300 flex items-center justify-center group">
              Proceed to Checkout
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <CreditCard className="w-4 h-4" />
                <span>All major cards accepted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
