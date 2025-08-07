// "use client"
// import { useParams } from 'next/navigation';

// const StaffProjectDetails = () => {
//   const params = useParams();
//   const { id } = params;

//   // Fetch project details using `id`

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold">Project Details: {id}</h1>
//       {/* Render your project info here */}
//     </div>
//   );
// };

// export default StaffProjectDetails;



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Pencil } from "lucide-react";

const StaffProjectDetails = () => {
  const params = useParams();
  const { id } = params();
  const [project, setProject] = useState(null);

  // Mock fetch from project array (replace with API call in real app)
  const mockProjects = [
    {
      _id: "68919e3380457debbd9233ca",
      title: "Modular Kitchen Project....",
      category: "modular_Kitchen",
      description: "This project is for a luxury modular kitchen.",
      estimatedBudget: "estimatedBudget",
      finalBudget: "14999998",
      startingDate: "2025-08-10T00:00:00.000Z",
      location: "Jaipur",
      client: {
        name: "Alice Smith 1",
        phone: "9079981550",
      },
      salesperson: {
        name: "Neeraj Sharma",
      },
      designer: {
        name: "Dhanii",
      },
      projectImages: [
        {
          url: "https://source.unsplash.com/random/100x100?project",
        },
      ],
      designsUploaded: false,
    },
  ];

  useEffect(() => {
    const foundProject = mockProjects.find((p) => p._id === id);
    setProject(foundProject);
  }, [id]);

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <button className="flex items-center text-sm text-gray-500 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </button>

          <button className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Project
          </button>
        </div>

        {/* Title Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={project.projectImages[0]?.url}
              alt="Project"
              className="w-16 h-16 rounded border object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{project.title}</h2>
              <p className="text-sm text-gray-500">{project.category}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{project.description}</p>
        </div>

        {/* Budget & Timeline + Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Budget & Timeline */}
          <div className="bg-white p-4 rounded-lg shadow-sm border lg:col-span-2 space-y-3">
            <h3 className="font-medium text-gray-800 mb-2">💲 Budget & Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-center">
                <p className="text-xs text-gray-500">Estimated Budget</p>
                <p className="text-blue-700 font-semibold text-base">
                  ₹{project.estimatedBudget}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded text-center">
                <p className="text-xs text-gray-500">Final Budget</p>
                <p className="text-green-700 font-semibold text-base">
                  ₹{Number(project.finalBudget).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Starting Date</p>
                <p className="text-gray-700 font-medium">
                  {new Date(project.startingDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-gray-700 font-medium">{project.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-gray-700 font-medium">{project.category}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Documents
            </h3>
            <p className="text-sm text-gray-500 text-center py-6">
              No documents uploaded yet
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-2">
          <h3 className="font-medium text-gray-800 mb-2">👤 Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer Name</p>
              <p className="text-gray-700 font-medium">{project.client?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="text-gray-700 font-medium">{project.client?.phone}</p>
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-2">
          <h3 className="font-medium text-gray-800 mb-2">👥 Team Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Salesperson</p>
              <p className="text-gray-700 font-medium">{project.salesperson?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Designer</p>
              <p className="text-gray-700 font-medium">{project.designer?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProjectDetails;
