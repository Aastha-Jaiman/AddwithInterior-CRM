// import React, { useState } from 'react';
// import { Wrench, ArrowLeft, Plus, Trash2, CheckCircle, Package, Settings, Briefcase } from 'lucide-react';

// const ModularKitchenQuotation = ({ onBack, onSave, clientName, projectName }) => {
//   const [sections, setSections] = useState([
//     {
//       id: 1,
//       name: 'Wooden Part',
//       icon: Package,
//       color: 'bg-orange-600',
//       items: [
//         { id: 1, name: 'Shutter', height: '', width: '', price: '', total: 0 },
//         { id: 2, name: 'Carcase', height: '', width: '', price: '', total: 0 },
//         { id: 3, name: 'Profile Shutter', height: '', width: '', price: '', total: 0 },
//         { id: 4, name: 'Shelves', height: '', width: '', price: '', total: 0 },
//         { id: 5, name: 'Counter Top', height: '', width: '', price: '', total: 0 }
//       ]
//     },
//     {
//       id: 2,
//       name: 'Hardware',
//       icon: Wrench,
//       color: 'bg-blue-600',
//       items: [
//         { id: 6, name: 'Hinges', height: '', width: '', price: '', total: 0 },
//         { id: 7, name: 'Drawer Channels', height: '', width: '', price: '', total: 0 },
//         { id: 8, name: 'Handles', height: '', width: '', price: '', total: 0 },
//         { id: 9, name: 'Soft Close', height: '', width: '', price: '', total: 0 },
//         { id: 10, name: 'Corner Solutions', height: '', width: '', price: '', total: 0 }
//       ]
//     },
//     {
//       id: 3,
//       name: 'Accessories',
//       icon: Settings,
//       color: 'bg-purple-600',
//       items: [
//         { id: 11, name: 'Pull Out Baskets', height: '', width: '', price: '', total: 0 },
//         { id: 12, name: 'Cutlery Tray', height: '', width: '', price: '', total: 0 },
//         { id: 13, name: 'Bottle Pull Out', height: '', width: '', price: '', total: 0 },
//         { id: 14, name: 'Corner Carousel', height: '', width: '', price: '', total: 0 },
//         { id: 15, name: 'Pantry Unit', height: '', width: '', price: '', total: 0 }
//       ]
//     },
//     {
//       id: 4,
//       name: 'Labour',
//       icon: Briefcase,
//       color: 'bg-red-600',
//       items: [
//         { id: 16, name: 'Installation', height: '', width: '', price: '', total: 0 },
//         { id: 17, name: 'Transportation', height: '', width: '', price: '', total: 0 },
//         { id: 18, name: 'Design Consultation', height: '', width: '', price: '', total: 0 },
//         { id: 19, name: 'Site Measurement', height: '', width: '', price: '', total: 0 }
//       ]
//     }
//   ]);

//   const updateItem = (sectionId, itemId, field, value) => {
//     const newSections = sections.map(section => {
//       if (section.id === sectionId) {
//         const newItems = section.items.map(item => {
//           if (item.id === itemId) {
//             const updatedItem = { ...item, [field]: value };
            
//             if (field === 'height' || field === 'width' || field === 'price') {
//               const height = parseFloat(updatedItem.height) || 0;
//               const width = parseFloat(updatedItem.width) || 0;
//               const price = parseFloat(updatedItem.price) || 0;
//               updatedItem.total = height * width * price;
//             }
            
//             return updatedItem;
//           }
//           return item;
//         });
        
//         return { ...section, items: newItems };
//       }
//       return section;
//     });
    
//     setSections(newSections);
//   };

//   const addItemToSection = (sectionId) => {
//     const newSections = sections.map(section => {
//       if (section.id === sectionId) {
//         const maxId = Math.max(...sections.flatMap(s => s.items.map(i => i.id)));
//         const newItem = { id: maxId + 1, name: '', height: '', width: '', price: '', total: 0 };
//         return { ...section, items: [...section.items, newItem] };
//       }
//       return section;
//     });
//     setSections(newSections);
//   };

//   const removeItemFromSection = (sectionId, itemId) => {
//     const newSections = sections.map(section => {
//       if (section.id === sectionId && section.items.length > 1) {
//         return { ...section, items: section.items.filter(item => item.id !== itemId) };
//       }
//       return section;
//     });
//     setSections(newSections);
//   };

//   const getSectionTotal = (section) => {
//     return section.items.reduce((sum, item) => sum + item.total, 0);
//   };

//   const grandTotal = sections.reduce((sum, section) => sum + getSectionTotal(section), 0);

//   const handleSubmit = () => {
//     onSave({ sections, grandTotal, type: 'modular-kitchen' });
//   };

//   return (
//     <div className="bg-white border border-slate-200 overflow-hidden">
//       {/* Header */}
//       <div className="bg-orange-600 text-white p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center mb-1">
//               <div className="p-2 bg-white/20 mr-3">
//                 <Wrench className="h-6 w-6" />
//               </div>
//               Modular Kitchen Quotation
//             </h1>
//             <p className="text-orange-100 font-medium">
//               Client: <span className="font-semibold">{clientName}</span> | 
//               Project: <span className="font-semibold">{projectName}</span>
//             </p>
//           </div>
//           <button
//             onClick={onBack}
//             className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 transition-colors flex items-center space-x-2 font-semibold"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back</span>
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {sections.map((section) => {
//           const IconComponent = section.icon;
//           return (
//             <div key={section.id} className="mb-6 last:mb-0">
//               <div className={`${section.color} text-white p-4 flex justify-between items-center`}>
//                 <h2 className="text-xl font-bold flex items-center">
//                   <div className="p-1 bg-white/20 mr-2">
//                     <IconComponent className="h-5 w-5" />
//                   </div>
//                   {section.name}
//                 </h2>
//                 <button
//                   onClick={() => addItemToSection(section.id)}
//                   className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 transition-colors flex items-center space-x-1 font-semibold text-sm"
//                 >
//                   <Plus className="h-4 w-4" />
//                   <span>Add Item</span>
//                 </button>
//               </div>
              
//               <div className="overflow-x-auto border border-slate-200">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50">
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Item Name</th>
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Height (H)</th>
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Width (W)</th>
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Price (₹)</th>
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Calculation</th>
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Total (₹)</th>
//                       <th className="border border-slate-200 p-3 text-left font-bold text-slate-700">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {section.items.map((item) => (
//                       <tr key={item.id} className="hover:bg-slate-50">
//                         <td className="border border-slate-200 p-3">
//                           <input
//                             type="text"
//                             value={item.name}
//                             onChange={(e) => updateItem(section.id, item.id, 'name', e.target.value)}
//                             className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
//                             placeholder="Item name"
//                           />
//                         </td>
//                         <td className="border border-slate-200 p-3">
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={item.height}
//                             onChange={(e) => updateItem(section.id, item.id, 'height', e.target.value)}
//                             className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
//                             placeholder="0.00"
//                           />
//                         </td>
//                         <td className="border border-slate-200 p-3">
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={item.width}
//                             onChange={(e) => updateItem(section.id, item.id, 'width', e.target.value)}
//                             className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
//                             placeholder="0.00"
//                           />
//                         </td>
//                         <td className="border border-slate-200 p-3">
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={item.price}
//                             onChange={(e) => updateItem(section.id, item.id, 'price', e.target.value)}
//                             className="w-full p-2 border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
//                             placeholder="0.00"
//                           />
//                         </td>
//                         <td className="border border-slate-200 p-3 text-center">
//                           <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 font-mono">
//                             {item.height && item.width && item.price ? `${item.height} × ${item.width} × ${item.price}` : '---'}
//                           </span>
//                         </td>
//                         <td className="border border-slate-200 p-3">
//                           <span className="font-bold text-lg text-orange-600">₹{item.total.toFixed(2)}</span>
//                         </td>
//                         <td className="border border-slate-200 p-3">
//                           <button
//                             onClick={() => removeItemFromSection(section.id, item.id)}
//                             disabled={section.items.length <= 1}
//                             className="p-1 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                     <tr className="bg-blue-50 border-t-2 border-blue-200">
//                       <td colSpan="5" className="border border-slate-200 p-3 text-right font-bold text-lg text-slate-800">
//                         Section Total:
//                       </td>
//                       <td className="border border-slate-200 p-3">
//                         <span className="font-bold text-xl text-blue-600">₹{getSectionTotal(section).toFixed(2)}</span>
//                       </td>
//                       <td className="border border-slate-200 p-3"></td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           );
//         })}

//         {/* Grand Total */}
//         <div className="bg-green-50 border-2 border-green-200 p-6 mb-6">
//           <div className="text-center">
//             <p className="text-xl text-green-700 mb-2 font-semibold">Total Project Cost</p>
//             <span className="text-4xl font-bold text-green-600">₹{grandTotal.toFixed(2)}</span>
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button
//             onClick={handleSubmit}
//             className="bg-green-600 text-white px-8 py-3 hover:bg-green-700 transition-colors flex items-center space-x-2 font-bold"
//           >
//             <CheckCircle className="h-5 w-5" />
//             <span>Save Draft Quotation</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModularKitchenQuotation;


// hooks/useQuotation.js
import { addQuotation, getAllClientsEmail, getProjectsByClientEmail } from "@/services/quotation.services";
import { useState } from "react";


export const useQuotation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createQuotation = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addQuotation(data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  };

  const fetchClients = async () => {
    try {
      return await getAllClientsEmail();
    } catch (err) {
      throw err;
    }
  };

  const fetchProjectsByEmail = async (email) => {
    try {
      return await getProjectsByClientEmail(email);
    } catch (err) {
      throw err;
    }
  };

  return { loading, error, createQuotation, fetchClients, fetchProjectsByEmail };
};
