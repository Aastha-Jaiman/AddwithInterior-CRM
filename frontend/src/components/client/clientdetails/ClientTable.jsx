import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const ClientTable = ({ 
  filteredClient, 
  showClientDetails, 
  handleEdit, 
  handleDelete 
}) => {
  return (
    <div className="px-6 py-6 max-w-full">
      <div className="overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-max divide-y divide-gray-200 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Avatar</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Project Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Join Date</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClient.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 whitespace-nowrap">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm cursor-pointer hover:ring-blue-500 transition-all"
                    onClick={() => showClientDetails(client)}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-slate-800 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap" onClick={() => showClientDetails(client)}>
                  {client.name}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{client.email}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{client.phone}</td>
                <td className="px-4 py-3 text-slate-600">{client.projectName}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{client.joinDate}</td>
                <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => showClientDetails(client)}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded-md transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleEdit(client)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-md transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;