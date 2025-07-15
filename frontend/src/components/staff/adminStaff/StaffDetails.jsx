// // StaffDetail Component

// "use client";
// import React, { createContext, useContext, useState } from 'react';
// import { useRouter, useParams, useSearchParams } from 'next/navigation';
// import {
//   Plus, Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, X, Save, Upload, Camera,
//   Briefcase, ArrowLeft
// } from 'lucide-react';





// export const StaffDetail = () => {
//   const { projects } = useProjects();
//   const router = useRouter();
//   const { staffId } = useParams();
//   const [staffList] = useState([
//     {
//       id: 1,
//       name: "Sarah Johnson",
//       email: "sarah.johnson@company.com",
//       phone: "+1 (555) 123-4567",
//       address: "123 Main St, New York, NY 10001",
//       category: "Designer",
//       joinDate: "2023-01-15",
//       salary: "$65,000",
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c647?w=150&h=150&fit=crop&crop=face"
//     },
//     {
//       id: 2,
//       name: "Michael Chen",
//       email: "michael.chen@company.com",
//       phone: "+1 (555) 987-6543",
//       address: "456 Oak Ave, Los Angeles, CA 90210",
//       category: "Salesperson",
//       joinDate: "2022-11-20",
//       salary: "$55,000",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
//     },
//     {
//       id: 3,
//       name: "Emily Rodriguez",
//       email: "emily.rodriguez@company.com",
//       phone: "+1 (555) 456-7890",
//       address: "789 Pine Rd, Chicago, IL 60601",
//       category: "Designer",
//       joinDate: "2023-03-10",
//       salary: "$70,000",
//       avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
//     },
//     {
//       id: 4,
//       name: "Robert Wilson",
//       email: "robert.wilson@company.com",
//       phone: "+1 (555) 321-9876",
//       address: "321 Elm St, Houston, TX 77001",
//       category: "Carpenter",
//       joinDate: "2022-08-15",
//       salary: "$58,000",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
//     }
//   ]);

//   const staff = staffList.find(s => s.id === Number(staffId));

//   if (!staff) {
//     return <div className="min-h-screen flex items-center justify-center text-slate-700">Staff member not found</div>;
//   }

//   const assignedProjects = projects.filter(project =>
//     project.designer === staff.name ||
//     project.salesperson === staff.name ||
//     (project.carpenter && project.carpenter === staff.name)
//   );

//   const projectCount = assignedProjects.length;
//   const statusCounts = assignedProjects.reduce((acc, project) => {
//     acc[project.status] = (acc[project.status] || 0) + 1;
//     return acc;
//   }, {});

//   const getStatusColor = (status) => ({
//     'Active': 'bg-emerald-600 text-white',
//     'In Progress': 'bg-amber-600 text-white',
//     'Completed': 'bg-blue-600 text-white',
//     'On Hold': 'bg-gray-600 text-white'
//   }[status] || 'bg-gray-600 text-white');

//   const handleProjectClick = (projectId) => {
//     router.push(`/projects?projectId=${projectId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
//       <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/60 px-6 py-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.push('/staff')}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
//             >
//               <ArrowLeft size={20} /> Back to Staff
//             </button>
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
//                 {staff.name}'s Details
//               </h1>
//               <p className="text-slate-600 mt-1">View staff details and assigned projects</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 space-y-6">
//           <div className="flex items-center gap-6">
//             <img
//               src={staff.avatar}
//               alt={staff.name}
//               className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900">{staff.name}</h2>
//               <p className="text-sm text-slate-600">{staff.category}</p>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <DetailItem icon={<Mail size={18} className="text-blue-600" />} label="Email" value={staff.email} />
//             <DetailItem icon={<Phone size={18} className="text-blue-600" />} label="Phone" value={staff.phone} />
//             <DetailItem icon={<MapPin size={18} className="text-blue-600" />} label="Address" value={staff.address} />
//             <DetailItem icon={<Calendar size={18} className="text-blue-600" />} label="Join Date" value={staff.joinDate} />
//             <DetailItem icon={<Briefcase size={18} className="text-blue-600" />} label="Salary" value={staff.salary} />
//           </div>
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-slate-900">Assigned Projects ({projectCount})</h3>
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-2">
//                 {Object.entries(statusCounts).map(([status, count]) => (
//                   <span
//                     key={status}
//                     className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(status)}`}
//                   >
//                     {status}: {count}
//                   </span>
//                 ))}
//               </div>
//               {assignedProjects.length > 0 ? (
//                 <div className="overflow-auto">
//                   <table className="min-w-full divide-y divide-gray-200 text-sm">
//                     <thead className="bg-slate-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Project Name</th>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Budget</th>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Final Quotation</th>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Start Date</th>
//                         <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {assignedProjects.map(project => (
//                         <tr
//                           key={project.id}
//                           className="hover:bg-slate-50 transition cursor-pointer"
//                           onClick={() => handleProjectClick(project.id)}
//                         >
//                           <td className="px-4 py-3 font-medium text-slate-800">{project.name}</td>
//                           <td className="px-4 py-3 text-slate-600">{project.category}</td>
//                           <td className="px-4 py-3">
//                             <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
//                               {project.status}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-slate-600">{project.estimatedBudget}</td>
//                           <td className="px-4 py-3 text-slate-600">{project.finalQuotation || 'N/A'}</td>
//                           <td className="px-4 py-3 text-slate-600">{project.startingDate}</td>
//                           <td className="px-4 py-3 text-slate-600">{project.location}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-slate-600">No projects assigned to this staff member.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// StaffDetail Component

"use client";
import React, { createContext, useContext, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Plus, Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, X, Save, Upload, Camera,
  Briefcase, ArrowLeft
} from 'lucide-react';




 const StaffDetail = () => {
//   const { projects } = useProjects();
  const router = useRouter();
  const { staffId } = useParams();
  const [staffList] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      category: "Designer",
      joinDate: "2023-01-15",
      salary: "$65,000",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c647?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      category: "Salesperson",
      joinDate: "2022-11-20",
      salary: "$55,000",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      address: "789 Pine Rd, Chicago, IL 60601",
      category: "Designer",
      joinDate: "2023-03-10",
      salary: "$70,000",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      phone: "+1 (555) 321-9876",
      address: "321 Elm St, Houston, TX 77001",
      category: "Carpenter",
      joinDate: "2022-08-15",
      salary: "$58,000",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  const staff = staffList.find(s => s.id === Number(staffId));

  if (!staff) {
    return <div className="min-h-screen flex items-center justify-center text-slate-700">Staff member not found</div>;
  }

//   const assignedProjects = projects.filter(project =>
//     project.designer === staff.name ||
//     project.salesperson === staff.name ||
//     (project.carpenter && project.carpenter === staff.name)
//   );

//   const projectCount = assignedProjects.length;
//   const statusCounts = assignedProjects.reduce((acc, project) => {
//     acc[project.status] = (acc[project.status] || 0) + 1;
//     return acc;
//   }, {});

  const getStatusColor = (status) => ({
    'Active': 'bg-emerald-600 text-white',
    'In Progress': 'bg-amber-600 text-white',
    'Completed': 'bg-blue-600 text-white',
    'On Hold': 'bg-gray-600 text-white'
  }[status] || 'bg-gray-600 text-white');

  const handleProjectClick = (projectId) => {
    router.push(`/projects?projectId=${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/60 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/staffusers')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              <ArrowLeft size={20} /> Back to Staff
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {staff.name}'s Details
              </h1>
              <p className="text-slate-600 mt-1">View staff details and assigned projects</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={staff.avatar}
              alt={staff.name}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{staff.name}</h2>
              <p className="text-sm text-slate-600">{staff.category}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div icon={<Mail size={18} className="text-blue-600" />} label="Email" value={staff.email} />
            <div icon={<Phone size={18} className="text-blue-600" />} label="Phone" value={staff.phone} />
            <div icon={<MapPin size={18} className="text-blue-600" />} label="Address" value={staff.address} />
            <div icon={<Calendar size={18} className="text-blue-600" />} label="Join Date" value={staff.joinDate} />
            <div icon={<Briefcase size={18} className="text-blue-600" />} label="Salary" value={staff.salary} />
          </div>
          <div className="space-y-4">
            {/* <h3 className="text-xl font-semibold text-slate-900">Assigned Projects ({projectCount})</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <span
                    key={status}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(status)}`}
                  >
                    {status}: {count}
                  </span>
                ))}
              </div>
              {assignedProjects.length > 0 ? (
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Project Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Budget</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Final Quotation</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Start Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assignedProjects.map(project => (
                        <tr
                          key={project.id}
                          className="hover:bg-slate-50 transition cursor-pointer"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">{project.name}</td>
                          <td className="px-4 py-3 text-slate-600">{project.category}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{project.estimatedBudget}</td>
                          <td className="px-4 py-3 text-slate-600">{project.finalQuotation || 'N/A'}</td>
                          <td className="px-4 py-3 text-slate-600">{project.startingDate}</td>
                          <td className="px-4 py-3 text-slate-600">{project.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-600">No projects assigned to this staff member.</p>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;