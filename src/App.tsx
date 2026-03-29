import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Box, 
  Edit3, 
  Upload, 
  CheckCircle, 
  LayoutDashboard, 
  LogOut,
  ChevronRight,
  Zap,
  Package,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Toaster, toast } from 'sonner';
import { UserProfile } from './types';

// Pages (to be implemented)
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import CustomDesignPage from './pages/CustomDesignPage';
import TemplatePage from './pages/TemplatePage';
import DashboardPage from './pages/DashboardPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import ProductDetailPage from './pages/ProductDetailPage';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dark-bg">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-center" theme="dark" />
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 border-b-dark-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center neon-glow">
                  <Box className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-bold tracking-tighter">
                  IONEXA<span className="text-neon-cyan">PRINT</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/shop" className="text-sm font-medium hover:text-neon-cyan transition-colors">Shop</Link>
                <Link to="/custom" className="text-sm font-medium hover:text-neon-cyan transition-colors">Custom Design</Link>
                <Link to="/templates" className="text-sm font-medium hover:text-neon-cyan transition-colors">Templates</Link>
                
                <div className="flex items-center space-x-4 pl-4 border-l border-dark-border">
                  <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-neon-purple text-[10px] flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  </Link>
                  
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <User className="w-5 h-5" />
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                          <LayoutDashboard className="w-5 h-5" />
                        </Link>
                      )}
                      <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-red-400">
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-neon-cyan transition-all duration-300"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex items-center space-x-4">
                <Link to="/cart" className="relative p-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-neon-purple text-[10px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                </Link>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-40 bg-dark-bg pt-20 md:hidden"
            >
              <div className="flex flex-col items-center space-y-8 p-8">
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display">Shop</Link>
                <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display">Custom Design</Link>
                <Link to="/templates" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display">Templates</Link>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display">Dashboard</Link>
                {!user && (
                  <button 
                    onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                    className="w-full py-4 bg-neon-cyan text-black font-bold rounded-xl"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/custom" element={<CustomDesignPage />} />
            <Route path="/templates" element={<TemplatePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark-surface border-t border-dark-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <Box className="text-neon-cyan w-8 h-8" />
                  <span className="text-2xl font-display font-bold tracking-tighter">
                    IONEXA<span className="text-neon-cyan">PRINT</span>
                  </span>
                </div>
                <p className="text-gray-400 max-w-sm">
                  The future of manufacturing is here. Custom 3D printing solutions for creators, businesses, and hobbyists.
                </p>
              </div>
              <div>
                <h4 className="font-display font-bold mb-6">Quick Links</h4>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li><Link to="/shop" className="hover:text-neon-cyan transition-colors">Shop Products</Link></li>
                  <li><Link to="/custom" className="hover:text-neon-cyan transition-colors">Custom Request</Link></li>
                  <li><Link to="/templates" className="hover:text-neon-cyan transition-colors">Templates</Link></li>
                  <li><Link to="/dashboard" className="hover:text-neon-cyan transition-colors">Track Order</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display font-bold mb-6">Contact</h4>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li>hello@ionexaprint.com</li>
                  <li>+1 (555) 3D-PRINT</li>
                  <li>Silicon Valley, CA</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-dark-border flex flex-col md:row justify-between items-center text-xs text-gray-500">
              <p>© 2026 IONEXAPRINT. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
