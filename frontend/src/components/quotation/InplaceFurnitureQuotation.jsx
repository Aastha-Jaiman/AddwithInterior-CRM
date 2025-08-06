import React, { useState } from 'react';
import { Package, ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';

const InplaceFurnitureQuotation = ({ onBack, onSave, clientName, projectName }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Box', height: '', width: '', price: '', total: 0 },
    { id: 2, name: 'Extra Drawer', height: '', width: '', price: '', total: 0 },
    { id: 3, name: 'One Side Color', height: '', width: '', price: '', total: 0 },
    { id: 4, name: 'Wall Panelling', height: '', width: '', price: '', total: 0 },
    { id: 5, name: 'Side Table', height: '', width: '', price: '', total: 0 },
    { id: 6, name: 'Vanity', height: '', width: '', price: '', total: 0, vanityType: '2F' },
    { id: 7, name: 'TV Unit', height: '', width: '', price: '', total: 0 },
    { id: 8, name: 'Chapas Wardrobe', height: '', width: '', price: '', total: 0 }
  ]);

  const updateItem = (id, field, value) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'height' || field === 'width' || field === 'price') {
          const height = parseFloat(updatedItem.height) || 0;
          const width = parseFloat(updatedItem.width) || 0;
          const price = parseFloat(updatedItem.price) || 0;
          updatedItem.total = height * width * price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(newItems);
  };

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1;
    setItems([...items, { id: newId, name: '', height: '', width: '', price: '', total: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = () => {
    onSave({ items, grandTotal, type: 'inplace-furniture' });
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center mb-1">
              <div className="p-2 bg-white/20 mr-3">
                <Package className="h-6 w-6" />
              </div>
              Inplace Furniture Quotation
            </h1>
            <p className="text-green-100 font-medium">
              Client: <span className="font-semibold">{clientName}</span> | 
              Project: <span className="font-semibold">{projectName}</span>
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 transition-colors flex items-center space-x-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Quotation Items</h2>
          <button
            onClick={addItem}
            className="bg-green-600 text-white px-3 py-2 hover:bg-green-700 transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Item Name</th>
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Height (H)</th>
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Width (W)</th>
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Price (₹)</th>
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Calculation</th>
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Total (₹)</th>
                <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="border border-slate-200 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                        placeholder="Item name"
                      />
                      {item.name === 'Vanity' && (
                        <select
                          value={item.vanityType}
                          onChange={(e) => updateItem(item.id, 'vanityType', e.target.value)}
                          className="px-2 py-2 border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-green-500 font-medium"
                        >
                          <option value="2F">2F</option>
                          <option value="3F">3F</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="border border-slate-200 p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={item.height}
                      onChange={(e) => updateItem(item.id, 'height', e.target.value)}
                      className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-200 p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={item.width}
                      onChange={(e) => updateItem(item.id, 'width', e.target.value)}
                      className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-200 p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-200 p-3 text-center">
                    <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 font-mono">
                      {item.height && item.width && item.price ? `${item.height} × ${item.width} × ${item.price}` : '---'}
                    </span>
                  </td>
                  <td className="border border-slate-200 p-3">
                    <span className="font-bold text-lg text-green-600">₹{item.total.toFixed(2)}</span>
                  </td>
                  <td className="border border-slate-200 p-3">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-1 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50 border-t-2 border-green-200">
                <td colSpan="5" className="border border-slate-200 p-4 text-right font-bold text-xl text-slate-800">
                  Grand Total:
                </td>
                <td className="border border-slate-200 p-4">
                  <span className="font-bold text-2xl text-green-600">₹{grandTotal.toFixed(2)}</span>
                </td>
                <td className="border border-slate-200 p-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-8 py-3 hover:bg-green-700 transition-colors flex items-center space-x-2 font-bold"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Save Draft Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InplaceFurnitureQuotation;
