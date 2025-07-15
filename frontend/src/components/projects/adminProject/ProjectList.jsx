

// ProjectList Component
import { Plus, Edit, Trash2, Eye, Filter, X, User, Calendar, Tag, Search, Download, Phone, Mail, MapPin, IndianRupee, FileText, Users, Briefcase } from 'lucide-react';

export const ProjectList = ({ projects, filteredProjects, handleView, handleEdit, handleDelete, handleDownload, setShowForm }) => {
  const getStatusColor = (status) => ({
    'Active': 'bg-emerald-500 text-white',
    'In Progress': 'bg-amber-500 text-white',
    'Completed': 'bg-blue-500 text-white',
    'On Hold': 'bg-gray-500 text-white'
  }[status] || 'bg-gray-500 text-white');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
            <span className="text-sm text-gray-500">{filteredProjects.length} of {projects.length} projects</span>
          </div>
        </div>
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Get started by creating your first project</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} /> Create Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design Status</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  </tr>
</thead>
              <tbody className="bg-white divide-y divide-gray-200">
{filteredProjects.map((project) => (
  <tr key={project.id} className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12">
          <img className="h-12 w-12 rounded-lg object-cover" src={project.image?.url || '/placeholder.jpg'} alt={project.name} />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{project.name}</div>
          <div className="text-sm text-gray-500">{project.location}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{project.customer.name}</div>
      <div className="text-sm text-gray-500">{project.customer.phone}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{project.category}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      <div className="font-medium">{project.estimatedBudget}</div>
      {project.finalQuotation && <div className="text-green-600 text-xs">Final: {project.finalQuotation}</div>}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>{project.status}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {project.designFile ? (
        <div className="flex items-center space-x-2">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Design Ready
          </span>
          <button 
            onClick={() => handleDownload(project.designFile)} 
            className="text-blue-600 hover:text-blue-900 transition-colors" 
            title="Download Design"
          >
            <Download size={14} />
          </button>
        </div>
      ) : (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Design Pending
        </span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      <div className="text-sm font-medium">{project.designer}</div>
      <div className="text-sm text-gray-500">{project.salesperson}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-1 text-gray-400" /> {project.startingDate}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center space-x-2">
        <button onClick={() => handleView(project)} className="text-blue-600 hover:text-blue-900 transition-colors" title="View Details">
          <Eye size={16} />
        </button>
        <button onClick={() => handleEdit(project)} className="text-green-600 hover:text-green-900 transition-colors" title="Edit Project">
          <Edit size={16} />
        </button>
        <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete Project">
          <Trash2 size={16} />
        </button>
        {project.roughQuotation && (
          <button onClick={() => handleDownload(project.roughQuotation)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Download Rough Quotation">
            <Download size={16} /> <span className="text-xs">Rough</span>
          </button>
        )}
        {project.designFile && project.finalQuotationFile && (
          <button onClick={() => handleDownload(project.finalQuotationFile)} className="text-green-600 hover:text-green-900 transition-colors" title="Download Final Quotation">
            <Download size={16} /> <span className="text-xs">Final</span>
          </button>
        )}
      </div>
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};






// // Add this column after the Status column in the table header
// <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design Status</th>

// // Add this cell in the table body after the Status cell
// <td className="px-6 py-4 whitespace-nowrap">
//   {project.designFile ? (
//     <div className="flex items-center space-x-2">
//       <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//         Design Ready
//       </span>
//       <button 
//         onClick={() => handleDownload(project.designFile)} 
//         className="text-blue-600 hover:text-blue-900 transition-colors" 
//         title="Download Design"
//       >
//         <Download size={14} />
//       </button>
//     </div>
//   ) : (
//     <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
//       Design Pending
//     </span>
//   )}
// </td>

// // Update the actions column to show final quotation option only when design is available
{/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex items-center space-x-2">
    <button onClick={() => handleView(project)} className="text-blue-600 hover:text-blue-900 transition-colors" title="View Details">
      <Eye size={16} />
    </button>
    <button onClick={() => handleEdit(project)} className="text-green-600 hover:text-green-900 transition-colors" title="Edit Project">
      <Edit size={16} />
    </button>
    <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete Project">
      <Trash2 size={16} />
    </button>
    {project.roughQuotation && (
      <button onClick={() => handleDownload(project.roughQuotation)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Download Rough Quotation">
        <Download size={16} /> <span className="text-xs">Rough</span>
      </button>
    )}
    {project.designFile && project.finalQuotationFile && (
      <button onClick={() => handleDownload(project.finalQuotationFile)} className="text-green-600 hover:text-green-900 transition-colors" title="Download Final Quotation">
        <Download size={16} /> <span className="text-xs">Final</span>
      </button>
    )}
  </div>
</td> */}