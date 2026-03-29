import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Eye, 
  Star,
  ChevronDown,
  Box
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { toast } from 'sonner';

const categories = ['All', 'Photo Frames', 'Lamps', 'Phone Stands', 'Home Decor', 'Tools', 'Gifts'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Product <span className="text-neon-cyan">Catalog</span></h1>
          <p className="text-gray-400">High-quality 3D printed products ready for your home.</p>
        </div>
        
        <div className="flex flex-col sm:row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="pl-12 pr-6 py-3 bg-dark-surface border border-dark-border rounded-xl focus:border-neon-cyan outline-none w-full sm:w-64 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative group">
            <button className="flex items-center justify-between px-6 py-3 bg-dark-surface border border-dark-border rounded-xl w-full sm:w-48 hover:border-neon-cyan transition-colors">
              <span className="flex items-center"><Filter className="w-4 h-4 mr-2" /> {selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface border border-dark-border rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-6 py-3 hover:bg-neon-cyan hover:text-black transition-colors ${selectedCategory === cat ? 'bg-neon-cyan/10 text-neon-cyan' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 glass-card">
          <Box className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-white/5">
                <img 
                  src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/600`} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Link to={`/product/${product.id}`} className="p-3 bg-white text-black rounded-full hover:bg-neon-cyan transition-colors">
                    <Eye className="w-5 h-5" />
                  </Link>
                  <button className="p-3 bg-neon-purple text-white rounded-full hover:scale-110 transition-transform">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/product/${product.id}`} className="font-display font-bold text-lg group-hover:text-neon-cyan transition-colors">{product.name}</Link>
                  <div className="flex items-center text-yellow-500 text-xs">
                    <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                    <span>4.9</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-2xl font-display font-bold">${product.price.toFixed(2)}</span>
                  <Link to={`/product/${product.id}`} className="text-xs font-bold uppercase tracking-widest text-neon-cyan hover:text-white transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
