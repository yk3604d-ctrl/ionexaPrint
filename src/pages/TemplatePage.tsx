import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Type, 
  Maximize2, 
  Palette, 
  ShoppingCart, 
  Check,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import ThreeViewer from '../components/ThreeViewer';
import { toast } from 'sonner';

const templates = [
  { id: 'keychain', name: 'Custom Keychain', price: 12.99, icon: '🔑' },
  { id: 'phone-stand', name: 'Phone Stand', price: 19.99, icon: '📱' },
  { id: 'name-plate', name: 'Name Plate', price: 24.99, icon: '🏷️' },
  { id: 'frame', name: 'Photo Frame', price: 29.99, icon: '🖼️' },
];

const fonts = ['Inter', 'Space Grotesk', 'Courier New', 'Georgia', 'Arial'];
const colors = [
  { name: 'Neon Cyan', hex: '#00f3ff' },
  { name: 'Neon Purple', hex: '#bc13fe' },
  { name: 'Matte Black', hex: '#1a1a1a' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Lava Red', hex: '#ff4444' },
];

export default function TemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customText, setCustomText] = useState('YOUR NAME');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [size, setSize] = useState('Medium');

  const handleAddToCart = () => {
    toast.success(`${selectedTemplate.name} added to cart!`);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:row gap-12">
        {/* Left: 3D Preview */}
        <div className="flex-grow lg:w-2/3">
          <div className="sticky top-32">
            <div className="glass-card p-4 h-[500px] md:h-[600px] relative">
              <ThreeViewer className="h-full" />
              
              <div className="absolute top-8 left-8">
                <h1 className="text-3xl font-display font-bold mb-2">{selectedTemplate.name}</h1>
                <p className="text-neon-cyan font-bold text-xl">${selectedTemplate.price}</p>
              </div>

              <div className="absolute bottom-8 right-8 flex space-x-4">
                <button className="p-3 bg-dark-bg/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-neon-cyan transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="p-3 bg-dark-bg/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-neon-cyan transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:w-1/3 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">1. Select Template</h3>
            <div className="grid grid-cols-2 gap-4">
              {templates.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-4 rounded-xl border transition-all text-left ${selectedTemplate.id === t.id ? 'border-neon-cyan bg-neon-cyan/5' : 'border-dark-border hover:border-white/20'}`}
                >
                  <span className="text-2xl mb-2 block">{t.icon}</span>
                  <span className="text-sm font-bold block">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">2. Personalize Text</h3>
            <div className="space-y-6">
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  maxLength={15}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-12 pr-4 py-4 focus:border-neon-cyan outline-none transition-colors"
                  placeholder="Enter text..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {fonts.map(font => (
                  <button 
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`px-4 py-3 rounded-xl border text-left text-sm transition-all ${selectedFont === font ? 'border-neon-purple bg-neon-purple/5' : 'border-dark-border hover:border-white/10'}`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">3. Choose Color</h3>
            <div className="flex flex-wrap gap-4">
              {colors.map(color => (
                <button 
                  key={color.hex}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor.hex === color.hex ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor.hex === color.hex && <Check className={`w-5 h-5 ${color.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full py-6 bg-white text-black font-bold rounded-2xl hover:bg-neon-cyan transition-all duration-300 flex items-center justify-center group"
          >
            <ShoppingCart className="mr-2 w-6 h-6" />
            Add to Cart - ${selectedTemplate.price}
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-center text-xs text-gray-500">
            Estimated delivery: 3-5 business days
          </p>
        </div>
      </div>
    </div>
  );
}
