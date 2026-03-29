import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Info,
  Layers,
  Box,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { toast } from 'sonner';

export default function CustomDesignPage() {
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('PLA');
  const [size, setSize] = useState('Medium');
  const [budget, setBudget] = useState('Under $50');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [], '.stl': [], '.obj': [] }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('Please login to submit a request');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'customRequests'), {
        userId: auth.currentUser.uid,
        description,
        material,
        size,
        budget,
        status: 'pending',
        createdAt: new Date().toISOString(),
        // In a real app, we would upload files to storage and save URLs
        fileCount: files.length
      });
      setSubmitted(true);
      toast.success('Request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-neon-cyan w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Request Received!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Our designers are reviewing your idea. You'll receive an STL preview and an estimated price in your dashboard within 24-48 hours.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-4 bg-neon-cyan text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-5xl font-display font-bold mb-6 italic">Custom <span className="text-neon-cyan">Design</span> Service</h1>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Can't find what you're looking for? Our expert designers can turn your sketches, photos, or descriptions into high-quality 3D prints.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-neon-cyan/10 rounded-2xl">
                <MessageSquare className="text-neon-cyan w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Describe Your Idea</h3>
                <p className="text-gray-500 text-sm">Tell us what you want to create, its purpose, and any specific details.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-neon-purple/10 rounded-2xl">
                <Upload className="text-neon-purple w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Upload References</h3>
                <p className="text-gray-500 text-sm">Photos, sketches, or existing STL files help our designers understand your vision.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-neon-cyan/10 rounded-2xl">
                <ShieldCheck className="text-neon-cyan w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Approve Before Printing</h3>
                <p className="text-gray-500 text-sm">We'll send a 3D preview for your approval before we start the printing process.</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 border-neon-cyan/20"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Describe Your Idea</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-cyan outline-none transition-colors resize-none"
                placeholder="E.g. A futuristic desk organizer with hexagonal patterns and a hidden compartment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-neon-cyan bg-neon-cyan/5' : 'border-dark-border hover:border-neon-purple'}`}>
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Drag & drop images or files here, or click to select</p>
              <p className="text-xs text-gray-600 mt-2">Supports JPG, PNG, STL, OBJ (Max 20MB)</p>
              {files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {files.map((f, i) => (
                    <span key={i} className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded-full border border-neon-cyan/20">{f.name}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Material</label>
                <select 
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-cyan outline-none transition-colors"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  <option>PLA (Standard)</option>
                  <option>PETG (Durable)</option>
                  <option>Resin (High Detail)</option>
                  <option>TPU (Flexible)</option>
                  <option>Carbon Fiber</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Size Preference</label>
                <select 
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-cyan outline-none transition-colors"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option>Small (up to 5cm)</option>
                  <option>Medium (up to 15cm)</option>
                  <option>Large (up to 30cm)</option>
                  <option>Extra Large (Custom)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : (
                <>
                  Generate Design Request
                  <Send className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
