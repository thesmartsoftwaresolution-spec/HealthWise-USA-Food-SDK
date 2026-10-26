import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/common/Button.tsx';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer.tsx';
import {
  ShoppingCart,
  Check,
  Printer,
  Plus,
  Trash2,
  DollarSign,
  Share2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const AIGroceryList: React.FC = () => {
  const { activeGroceryList, setActiveGroceryList, toggleGroceryItem, showToast } = useApp();
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'produce' | 'dairy' | 'proteins' | 'pantry' | 'frozen'>('produce');

  const categories = [
    { key: 'produce', label: 'Fresh Produce & Herbs', icon: '🥦', color: 'text-[#2D7D46]' },
    { key: 'dairy', label: 'Dairy & Eggs', icon: '🥛', color: 'text-[#0369A1]' },
    { key: 'proteins', label: 'Lean Proteins & Seafood', icon: '🥩', color: 'text-[#C0392B]' },
    { key: 'pantry', label: 'Pantry, Grains & Legumes', icon: '🌾', color: 'text-[#D97706]' },
    { key: 'frozen', label: 'Frozen Fruits & Veggies', icon: '❄️', color: 'text-[#0284C7]' }
  ] as const;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !activeGroceryList) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      item: newItemName.trim(),
      amount: '1 item',
      checked: false,
      estimatedCost: 2.5
    };

    setActiveGroceryList({
      ...activeGroceryList,
      categories: {
        ...activeGroceryList.categories,
        [newItemCategory]: [...activeGroceryList.categories[newItemCategory], newItem]
      }
    });

    setNewItemName('');
    showToast(`Added ${newItem.item} to ${newItemCategory}!`, 'success');
  };

  const totalItemsCount = activeGroceryList
    ? Object.values(activeGroceryList.categories).reduce((acc, cat) => acc + cat.length, 0)
    : 0;

  const checkedItemsCount = activeGroceryList
    ? Object.values(activeGroceryList.categories).reduce(
        (acc, cat) => acc + cat.filter((i) => i.checked).length,
        0
      )
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-[#E8F5EC] border border-[#D4E6D9] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D7D46] flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4" /> Smart Supermarket Checklist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2B20]">
            {activeGroceryList?.title || 'Weekly Supermarket Checklist'}
          </h1>
          <p className="text-sm text-[#5A7060]">
            Organized aisle-by-aisle for efficient shopping. Checked items sync automatically to your device.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border border-[#D4E6D9] hover:bg-gray-50 text-[#1C2B20] text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 print:hidden"
          >
            <Printer className="w-3.5 h-3.5 text-[#5A7060]" />
            <span>Print List</span>
          </button>
        </div>
      </div>

      {/* Progress & Estimated Budget Bar */}
      <div className="bg-white border border-[#D4E6D9] rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A7060]">
            Shopping Progress
          </span>
          <p className="text-xl font-bold text-[#1C2B20]">
            {checkedItemsCount} of {totalItemsCount} items completed ({Math.round(totalItemsCount > 0 ? (checkedItemsCount / totalItemsCount) * 100 : 0)}%)
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A7060]">
            Estimated Total
          </span>
          <p className="font-serif text-2xl font-bold text-[#2D7D46]">
            ${activeGroceryList?.estimatedTotal?.toFixed(2) || '75.00'} USD
          </p>
        </div>
      </div>

      {/* Add Custom Item Quick Bar */}
      <form
        onSubmit={handleAddItem}
        className="bg-white border border-[#D4E6D9] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-xs print:hidden"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add extra item (e.g. olive oil, lemons, seltzer)..."
          className="flex-1 px-4 py-2 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
        />
        <select
          value={newItemCategory}
          onChange={(e: any) => setNewItemCategory(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-[#D4E6D9] bg-white font-medium text-[#1C2B20]"
        >
          <option value="produce">Fresh Produce</option>
          <option value="dairy">Dairy & Eggs</option>
          <option value="proteins">Lean Proteins</option>
          <option value="pantry">Pantry & Grains</option>
          <option value="frozen">Frozen Foods</option>
        </select>
        <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-4 h-4" />}>
          Add to Aisle
        </Button>
      </form>

      {/* Categorized Aisle Sections */}
      {activeGroceryList && (
        <div className="space-y-6">
          {categories.map((cat) => {
            const items = activeGroceryList.categories[cat.key] || [];
            if (items.length === 0) return null;

            return (
              <div
                key={cat.key}
                className="bg-white border border-[#D4E6D9] rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#D4E6D9]/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <h3 className="font-serif text-xl font-bold text-[#1C2B20]">{cat.label}</h3>
                    <span className="text-xs text-[#5A7060]">({items.length} items)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleGroceryItem(cat.key, item.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none min-h-[48px] ${
                        item.checked
                          ? 'bg-[#F4F8F5] border-transparent text-[#5A7060]/60 line-through'
                          : 'bg-white border-[#D4E6D9] hover:bg-[#E8F5EC]/50 text-[#1C2B20]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                            item.checked
                              ? 'bg-[#2D7D46] border-[#2D7D46] text-white'
                              : 'border-[#D4E6D9] bg-white'
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.item}</p>
                          <p className="text-[11px] text-[#5A7060]">{item.amount}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#5A7060]">
                        ${item.estimatedCost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline Dietary & Pricing Notice */}
      <MedicalDisclaimer
        variant="inline"
        sourceCitation="Bureau of Labor Statistics (BLS) Consumer Price Index / USDA Food Plans"
      />
    </div>
  );
};
