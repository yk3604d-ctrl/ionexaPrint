import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Package, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Star, 
  ArrowRight,
  Box,
  Layers,
  Cpu
} from 'lucide-react';
import ThreeViewer from '../components/ThreeViewer';

const categories = [
  { name: 'Photo Frames', icon: '🖼️', count: 12 },
  { name: 'Lamps', icon: '💡', count: 8 },
  { name: 'Phone Stands', icon: '📱', count: 15 },
  { name: 'Home Decor', icon: '🏠', count: 24 },
  { name: 'Tools & Utility', icon: '🛠️', count: 18 },
  { name: 'Gifts', icon: '🎁', count: 32 },
];

const steps = [
  {
    title: 'Upload or Choose',
    desc: 'Pick a pre-designed product or upload your own idea.',
    icon: <Box className="w-8 h-8 text-neon-cyan" />,
  },
  {
    title: 'Approve Preview',
    desc: 'Review the 3D STL model and approve the final design.',
    icon: <Layers className="w-8 h-8 text-neon-purple" />,
  },
  {
    title: 'Print & Deliver',
    desc: 'We print with precision and ship directly to your door.',
    icon: <Truck className="w-8 h-8 text-neon-cyan" />,
  },
];

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Product Designer',
    text: 'The precision of the prints is incredible. IONEXAPRINT turned my complex STL into a perfect prototype.',
    stars: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'E-commerce Owner',
    text: 'Custom keychains for my brand were a huge hit. The template customization tool is so easy to use!',
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-cyan/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Next-Gen 3D Printing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Turn Your Ideas Into <span className="text-gradient">Reality</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Custom Designs + Ready Products + Fast Delivery. Experience the future of manufacturing with IONEXAPRINT.
            </p>
            <div className="flex flex-col sm:row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/shop" 
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-neon-cyan transition-all duration-300 flex items-center justify-center group"
              >
                Shop Now
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/custom" 
                className="px-8 py-4 bg-dark-surface border border-dark-border text-white font-bold rounded-xl hover:border-neon-purple transition-all duration-300 flex items-center justify-center"
              >
                Create Custom Design
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="glass-card p-4 neon-glow">
              <ThreeViewer className="h-[400px] md:h-[500px]" />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-6 border-neon-purple/30 hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-neon-purple/20 rounded-lg">
                  <Cpu className="text-neon-purple w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Precision</p>
                  <p className="text-lg font-bold">0.05mm Layer Height</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Featured Categories</h2>
            <p className="text-gray-400">Explore our curated collection of 3D printed essentials.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:border-neon-cyan transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.count} Items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="mb-8">{step.icon}</div>
                <h3 className="text-2xl font-display font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-10 -right-6">
                    <ArrowRight className="text-dark-border w-12 h-12" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 md:p-20 relative overflow-hidden bg-gradient-to-br from-dark-surface to-dark-bg border-neon-cyan/20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-neon-cyan/5 skew-x-12 transform translate-x-1/4" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Ready to bring your <span className="text-neon-cyan">vision</span> to life?</h2>
              <p className="text-xl text-gray-400 mb-10">Join thousands of creators who trust IONEXAPRINT for high-quality 3D manufacturing.</p>
              <div className="flex flex-col sm:row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/custom" className="px-10 py-5 bg-neon-cyan text-black font-bold rounded-xl hover:scale-105 transition-transform text-center">
                  Start Custom Design
                </Link>
                <Link to="/shop" className="px-10 py-5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors text-center">
                  Browse Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-10">
                <div className="flex mb-6">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-xl italic text-gray-300 mb-8">"{t.text}"</p>
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <p className="text-neon-cyan text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
