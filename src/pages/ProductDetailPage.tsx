import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  ChevronLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  Box,
  Layers,
  Cpu
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import ThreeViewer from '../components/ThreeViewer';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [selectedSize, setSelectedSize] = useState('Standard');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error('Product not found');
          navigate('/shop');
        }
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    toast.success(`${product?.name} added to cart!`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return null;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: 3D Preview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-4 h-[500px] md:h-[600px] relative"
        >
          <ThreeViewer className="h-full" stlUrl={product.stlUrl} />
          <div className="absolute top-8 left-8 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest">
            {product.category}
          </div>
        </motion.div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center space-x-2 text-yellow-500 mb-4">
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <span className="text-gray-400 text-sm ml-2">(48 Reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-display font-bold text-neon-cyan">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-400 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Select Material</label>
              <div className="flex flex-wrap gap-3">
                {['PLA', 'PETG', 'Resin', 'TPU'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${selectedMaterial === m ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-dark-border hover:border-white/20'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {['Small', 'Standard', 'Large'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${selectedSize === s ? 'border-neon-purple bg-neon-purple/10 text-neon-purple' : 'border-dark-border hover:border-white/20'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-dark-border space-y-6">
            <button 
              onClick={handleAddToCart}
              className="w-full py-6 bg-white text-black font-bold rounded-2xl hover:bg-neon-cyan transition-all duration-300 flex items-center justify-center group text-lg"
            >
              <ShoppingCart className="mr-3 w-6 h-6" />
              Add to Cart
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <Truck className="w-4 h-4 text-neon-cyan" />
                <span>Fast Worldwide Delivery</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-neon-cyan" />
                <span>100% Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <Box className="w-4 h-4 text-neon-cyan" />
                <span>Eco-friendly Materials</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <Cpu className="w-4 h-4 text-neon-cyan" />
                <span>High-Precision Printing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
