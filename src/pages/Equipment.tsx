import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../hooks/useAuth';
import { Box, Award, Zap, ChevronRight, Search, X, Dumbbell, ShieldCheck, Filter, Target } from 'lucide-react';
import type { Equipment } from '../types';
import { equipmentDatabase } from '../data/equipment';

type Category = 'all' | 'strength' | 'cardio' | 'flexibility';

const EquipmentPage: React.FC = () => {
  const { state } = useApp();
  const { recommendedEquipment } = state;
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories definition
  const categories: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'all', label: '全部', icon: <Box size={14} />, color: 'slate' },
    { id: 'strength', label: '力量', icon: <Dumbbell size={14} />, color: 'blue' },
    { id: 'cardio', label: '有氧', icon: <Zap size={14} />, color: 'orange' },
    { id: 'flexibility', label: '柔韧性', icon: <Target size={14} />, color: 'green' },
  ];

  // Filtering Logic
  const filteredEquipment = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return equipmentDatabase.filter(item => {
      // 1. Category Filter
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      
      // 2. Search Filter (Only if query is not empty)
      if (!q) return true;
      
      const inName = item.name.toLowerCase().includes(q) || 
                     item.nameEn.toLowerCase().includes(q);
      const inMuscles = item.targetMuscles.some(m => m.toLowerCase().includes(q));
      
      return inName || inMuscles;
    });
  }, [activeCategory, searchQuery]);

  // Handle category change with haptic effect feel
  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">器材库</h1>
          <p className="text-slate-500 font-medium">由 DeepSeek AI 驱动的科学训练百科</p>
        </div>
        <div className="flex -space-x-2">
           {recommendedEquipment.slice(0, 3).map((recItem, i) => {
             const item = equipmentDatabase.find(e => e.id === recItem.id) || recItem;
             return (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                  <img src={item.imageUrl || "/images/equipment/placeholder.svg"} className="w-full h-full object-cover" alt="" title={`推荐: ${item.name}`} />
               </div>
             );
           })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="space-y-6">
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
           <input
              data-testid="equipment-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索器材名、肌群词..."
              className="w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none border-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium bg-white/60 backdrop-blur-md shadow-sm"
           />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-testid={`cat-${cat.id}`}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                activeCategory === cat.id 
                ? `bg-slate-900 text-white shadow-lg` 
                : 'bg-white/80 text-slate-500 hover:bg-white hover:text-slate-900 border border-slate-100 shadow-sm'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section Shortcut */}
      {searchQuery === '' && activeCategory === 'all' && recommendedEquipment.length > 0 && (
        <div className="space-y-4" data-testid="recommended-section">
           <div className="flex items-center gap-2 px-1">
              <Award size={18} className="text-brand-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">为您推荐</h2>
           </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
               {recommendedEquipment.map((recItem) => {
                 const item = equipmentDatabase.find(e => e.id === recItem.id) || recItem;
                 return (
                   <div 
                     key={item.id} 
                     onClick={() => setSelectedItem(item)}
                     className="flex-shrink-0 w-40 h-40 glass-panel rounded-3xl bg-white flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:shadow-lg transition-all border border-slate-100/50"
                   >
                      <img src={item.imageUrl || "/images/equipment/placeholder.svg"} className="w-20 h-20 object-contain" alt={item.name} />
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                   </div>
                 );
               })}
            </div>
        </div>
      )}

      {/* Equipment Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                {activeCategory === 'all' ? '全部器材' : `${categories.find(c => c.id === activeCategory)?.label}系列`}
              </h2>
           </div>
           <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md" data-testid="equipment-count">
             {filteredEquipment.length} 件
           </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={item.id}
                data-testid="equipment-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className="glass-panel rounded-[2rem] overflow-hidden bg-white shadow-premium flex items-center group cursor-pointer border border-slate-100/30 hover:shadow-2xl transition-all h-56 relative"
              >
                <div className="w-56 h-full bg-white flex items-center justify-center p-6 relative overflow-hidden border-r border-slate-50">
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  </div>
                   <img
                    src={item.imageUrl || "/images/equipment/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10 p-2"
                  />
                </div>

                <div className="flex-1 p-5 space-y-2 overflow-hidden">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">{item.targetMuscles.join(' / ')}</p>
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                   </div>

                   <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                      {item.sets && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black whitespace-nowrap">{item.sets}组</span>}
                      {item.reps && <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md text-[9px] font-black whitespace-nowrap">{item.reps}次</span>}
                      {item.difficulty === 'advanced' && <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[9px] font-black whitespace-nowrap">进阶</span>}
                   </div>
                </div>

                {/* Vertical Category Stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.category === 'strength' ? 'bg-blue-500' : 
                  item.category === 'cardio' ? 'bg-orange-500' : 'bg-green-500'
                }`} />
              </motion.div>
            ))
          ) : (
            <div data-testid="equipment-empty" className="flex flex-col items-center justify-center py-20 gap-4 opacity-50 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
               <Box size={40} className="text-slate-300" />
               <div className="text-center">
                 <p className="text-slate-900 font-bold">未找到匹配器材</p>
                 <p className="text-xs text-slate-400 mt-1">换个关键词试试？</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key={`equipment-modal-${selectedItem.id}`}
            data-testid="equipment-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xl p-0 sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              layoutId={selectedItem.id}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-80 w-full bg-gradient-to-b from-slate-50 to-white p-10 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                 </div>
                 <img
                   src={selectedItem.imageUrl || "/images/equipment/placeholder.svg"}
                   alt={selectedItem.name}
                   className="w-4/5 h-4/5 object-contain relative z-10"
                 />
                 <button
                  data-testid="equipment-modal-close"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xl z-20"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-6">
                  <div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block ${
                      selectedItem.category === 'strength' ? 'bg-blue-50 text-blue-600' :
                      selectedItem.category === 'cardio' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {selectedItem.category}
                    </span>
                    <h2 className="text-3xl font-display font-black text-slate-900" data-testid="equipment-modal-name">{selectedItem.name}</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-tight mt-1">{selectedItem.nameEn}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 text-center">
                        <div className="text-blue-700 font-black text-lg">{selectedItem.sets || '--'}</div>
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">建议组数</div>
                     </div>
                     <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 text-center">
                        <div className="text-indigo-700 font-black text-lg">{selectedItem.reps || '--'}</div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">建议次数</div>
                     </div>
                     <div className="p-4 rounded-3xl bg-rose-50 border border-rose-100 text-center">
                        <div className="text-rose-700 font-black text-lg leading-tight">{selectedItem.duration ? (selectedItem.duration.length > 5 ? '查看' : selectedItem.duration) : '--'}</div>
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">建议时长</div>
                     </div>
                  </div>

                  <div className="space-y-4" data-testid="equipment-usage-section">
                    <h4 className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-widest">
                      <Zap size={16} className="text-orange-500" /> 使用指南
                    </h4>
                    <div className="space-y-3">
                      {selectedItem.usage.map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-brand-primary/20 transition-all">
                          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center group-hover:bg-brand-primary">
                            {i + 1}
                          </span>
                          <p className="text-slate-600 text-sm leading-relaxed font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4" data-testid="equipment-tips-section">
                    <h4 className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-widest">
                      <ShieldCheck size={16} className="text-green-500" /> 教练私房话
                    </h4>
                    <div className="p-6 rounded-[2rem] bg-slate-900 text-slate-100 space-y-3 shadow-2xl relative overflow-hidden">
                       <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl" />
                       {selectedItem.tips.map((tip, i) => (
                         <div key={i} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                            <p className="text-xs leading-relaxed text-slate-300 font-medium">{tip}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                 <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-brand-primary transition-all active:scale-95"
                 >
                   我知道了
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquipmentPage;
