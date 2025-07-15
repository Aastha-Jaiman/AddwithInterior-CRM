"use client"
import React, { useState } from 'react';
import { Eye, FileText, User, Calendar, MapPin, IndianRupee, Users, Building, Phone, Mail } from 'lucide-react';

const SalespersonProjects = () => {
  const [projects] = useState([
    {
      id: 1,
      name: "Premium Modular Kitchen",
      category: "Modular Kitchen",
      estimatedBudget: "₹2,50,000",
      finalQuotation: "₹2,35,000",
      status: "Completed",
      designer: "Rajesh Kumar",
      salesperson: "Priya Sharma",
      projectType: "Residential",
      image: {
        name: "kitchen_image.jpg",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop"
      },
      description: "High-quality modular kitchen with premium fittings and modern design. Features include soft-close drawers, premium hardware, and contemporary styling.",
      startingDate: "2024-03-15",
      endDate: "2024-05-15",
      duration: "2 months",
      location: "Jaipur, RJ",
      budget: 250000,
      actualCost: 235000,
      paidAmount: 150000,
      remainingAmount: 85000,
      customer: {
        name: "Amit Verma",
        phone: "+91 98765 43210",
        email: "amit.verma@email.com",
        address: "123 Green Park, Malviya Nagar, Jaipur, Rajasthan - 302017"
      },
      client: {
        name: "Amit Verma",
        phone: "+91 98765 43210",
        email: "amit.verma@email.com",
        address: "123 Green Park, Malviya Nagar, Jaipur, Rajasthan - 302017"
      },
      projectManager: "Rajesh Kumar",
      architect: "Vikram Singh",
      contractor: "Deepak Builders",
      teamMembers: [
        { name: "Suresh Carpenter", role: "Lead Carpenter" },
        { name: "Ramesh Electrician", role: "Electrical Work" }
      ],
      roughQuotation: {
        name: "Kitchen_Rough_Quote.pdf",
        url: "https://example.com/kitchen_rough_quote.pdf"
      },
      designFile: {
        name: "Kitchen_Final_Design.pdf",
        url: "https://example.com/kitchen_final_design.pdf"
      },
      finalQuotationFile: {
        name: "Kitchen_Final_Quote.pdf",
        url: "https://example.com/kitchen_final_quote.pdf"
      },
      documents: [
        {
          name: "Kitchen_Design_Plan.pdf",
          url: "https://example.com/kitchen_design.pdf",
          type: "Design Plan"
        },
        {
          name: "Material_List.pdf",
          url: "https://example.com/material_list.pdf",
          type: "Material List"
        }
      ],
      specifications: {
        cabinetMaterial: "Marine Plywood",
        shutterFinish: "Laminate",
        hardware: "Hettich",
        countertop: "Granite",
        appliances: "Modular Hob, Chimney"
      },
      notes: "Client prefers white and grey color combination. Extra storage required for utensils. Electrical points to be modified as per design.",
      startDate: "2024-03-15"
    },
    {
      id: 2,
      name: "Luxury Bedroom Set",
      category: "Inplace Furniture",
      estimatedBudget: "₹1,80,000",
      finalQuotation: null,
      status: "In Progress",
      designer: "Neha Gupta",
      salesperson: "Suresh Patel",
      projectType: "Residential",
      image: {
        name: "bedroom_image.jpg",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop"
      },
      description: "Complete bedroom furniture set with wardrobe, bed, and study table. Premium wood finish with modern design elements.",
      startingDate: "2024-04-20",
      endDate: "2024-06-20",
      duration: "2 months",
      location: "Delhi, DL",
      budget: 180000,
      actualCost: null,
      paidAmount: 50000,
      remainingAmount: 130000,
      customer: {
        name: "Kavita Singh",
        phone: "+91 87654 32109",
        email: "kavita.singh@email.com",
        address: "456 South Extension, Part 1, New Delhi - 110049"
      },
      client: {
        name: "Kavita Singh",
        phone: "+91 87654 32109",
        email: "kavita.singh@email.com",
        address: "456 South Extension, Part 1, New Delhi - 110049"
      },
      projectManager: "Neha Gupta",
      architect: "Ravi Sharma",
      contractor: "Modern Interiors",
      teamMembers: [
        { name: "Anil Kumar", role: "Furniture Specialist" },
        { name: "Mohan Polisher", role: "Finishing Expert" }
      ],
      roughQuotation: {
        name: "Bedroom_Rough_Quote.pdf",
        url: "https://example.com/bedroom_rough_quote.pdf"
      },
      designFile: null,
      finalQuotationFile: null,
      documents: [
        {
          name: "Bedroom_Design.pdf",
          url: "https://example.com/bedroom_design.pdf",
          type: "Design Layout"
        }
      ],
      specifications: {
        bedSize: "King Size",
        wardrobeType: "6 Door Wardrobe",
        material: "Engineered Wood",
        finish: "Walnut Veneer",
        hardware: "Hafele"
      },
      notes: "Client wants matching bedside tables. Mirror finish required on wardrobe doors.",
      startDate: "2024-04-20"
    },
    {
      id: 3,
      name: "Office Conference Room",
      category: "Office Furniture",
      estimatedBudget: "₹3,50,000",
      finalQuotation: null,
      status: "Active",
      designer: "Mohit Agarwal",
      salesperson: "Ravi Kumar",
      projectType: "Commercial",
      image: {
        name: "conference_room.jpg",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop"
      },
      description: "Modern conference room setup with executive table, chairs, and storage solutions. Professional design with contemporary elements.",
      startingDate: "2024-05-01",
      endDate: "2024-07-01",
      duration: "2 months",
      location: "Mumbai, MH",
      budget: 350000,
      actualCost: null,
      paidAmount: 100000,
      remainingAmount: 250000,
      customer: {
        name: "TechCorp Solutions",
        phone: "+91 99887 76543",
        email: "procurement@techcorp.com",
        address: "789 Business District, Andheri East, Mumbai - 400069"
      },
      client: {
        name: "TechCorp Solutions",
        phone: "+91 99887 76543",
        email: "procurement@techcorp.com",
        address: "789 Business District, Andheri East, Mumbai - 400069"
      },
      projectManager: "Mohit Agarwal",
      architect: "Sanjay Mehta",
      contractor: "Elite Interiors",
      teamMembers: [
        { name: "Dinesh Carpenter", role: "Lead Carpenter" },
        { name: "Rakesh Upholsterer", role: "Upholstery Work" }
      ],
      roughQuotation: {
        name: "Conference_Rough_Quote.pdf",
        url: "https://example.com/conference_rough_quote.pdf"
      },
      designFile: {
        name: "Conference_Final_Design.pdf",
        url: "https://example.com/conference_final_design.pdf"
      },
      finalQuotationFile: null,
      documents: [
        {
          name: "Conference_Layout.pdf",
          url: "https://example.com/conference_layout.pdf",
          type: "Layout Plan"
        }
      ],
      specifications: {
        tableSize: "12 Seater",
        chairType: "Executive Chairs",
        material: "Solid Wood",
        finish: "Mahogany",
        storage: "Built-in Cabinets"
      },
      notes: "Client requires AV equipment integration. Cable management to be hidden. Premium leather upholstery preferred.",
      startDate: "2024-05-01"
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Active':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Projects
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                {selectedProject.status}
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src={selectedProject.image.url} 
                    alt={selectedProject.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedProject.name}</h2>
                    <p className="text-gray-600 mb-3">{selectedProject.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{selectedProject.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProject.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedProject.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Budget:</span>
                  <span className="font-medium">{selectedProject.estimatedBudget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Final Quotation:</span>
                  <span className="font-medium">{selectedProject.finalQuotation || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(selectedProject.paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-red-600">{formatCurrency(selectedProject.remainingAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Client Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Name:</span>
                  <p className="font-medium">{selectedProject.client.name}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Phone:</span>
                  <p className="font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {selectedProject.client.phone}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Email:</span>
                  <p className="font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {selectedProject.client.email}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Address:</span>
                  <p className="font-medium flex items-start">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5" />
                    {selectedProject.client.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Team */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Project Team
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Project Manager:</span>
                  <p className="font-medium">{selectedProject.projectManager}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Designer:</span>
                  <p className="font-medium">{selectedProject.designer}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Architect:</span>
                  <p className="font-medium">{selectedProject.architect}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Contractor:</span>
                  <p className="font-medium">{selectedProject.contractor}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Salesperson:</span>
                  <p className="font-medium">{selectedProject.salesperson}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Project Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Start Date:</span>
                  <p className="font-medium">{selectedProject.startingDate}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">End Date:</span>
                  <p className="font-medium">{selectedProject.endDate}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Duration:</span>
                  <p className="font-medium">{selectedProject.duration}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Project Type:</span>
                  <p className="font-medium">{selectedProject.projectType}</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(selectedProject.specifications).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProject.roughQuotation && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Rough Quotation</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedProject.roughQuotation.name}</p>
                </div>
              )}
              {selectedProject.designFile && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Design File</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedProject.designFile.name}</p>
                </div>
              )}
              {selectedProject.finalQuotationFile && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Final Quotation</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedProject.finalQuotationFile.name}</p>
                </div>
              )}
              {selectedProject.documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{doc.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">{doc.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {selectedProject.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedProject.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and view all project details</p>
            </div>
            <div className="text-sm text-gray-500">
              Total Projects: {projects.length}
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={project.image.url} 
                          alt={project.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.projectType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.client.name}</div>
                      <div className="text-sm text-gray-500">{project.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.estimatedBudget}</div>
                      <div className="text-sm text-gray-500">
                        Paid: {formatCurrency(project.paidAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.designer}</div>
                      <div className="text-sm text-gray-500">{project.salesperson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.startingDate}</div>
                      <div className="text-sm text-gray-500">{project.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalespersonProjects;