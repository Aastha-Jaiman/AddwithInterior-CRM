"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, DollarSign, User, FileText, Clock, CheckCircle, AlertCircle, Home, Palette, Hammer, Camera, Phone, Mail, MapPin, CreditCard, TrendingUp, Eye, Download, Filter } from 'lucide-react';

const AdminPaymentHistory = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [expandedPayments, setExpandedPayments] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced Interior Design CRM Data
  const clientsData = [
    {
      id: 1,
      name: "Sharma Family",
      email: "rajesh.sharma@gmail.com",
      phone: "+91 98765 43210",
      address: "Sector 12, Noida, UP",
      clientType: "Residential",
      totalProjects: 2,
      totalAmount: 1850000,
      paidAmount: 1350000,
      pendingAmount: 500000,
      nextPaymentDue: "2024-04-15",
      clientSince: "2023-08-15",
      projects: [
        {
          id: 101,
          name: "3BHK Complete Interior Design",
          category: "Residential",
          area: "1200 sq ft",
          location: "Noida Sector 12",
          totalAmount: 1200000,
          paidAmount: 900000,
          pendingAmount: 300000,
          status: "In Progress",
          completion: 75,
          startDate: "2023-09-01",
          expectedCompletion: "2024-04-30",
          designer: "Priya Mehta",
          services: ["Modular Kitchen", "Living Room", "Bedrooms", "Bathrooms"],
          payments: [
            {
              id: 1001,
              amount: 360000,
              date: "2023-09-01",
              method: "Bank Transfer",
              status: "Completed",
              description: "Advance Payment - 30% (Design & Planning)",
              transactionId: "ADW123456",
              milestone: "Design Approval",
              receipt: "ADW-REC-001"
            },
            {
              id: 1002,
              amount: 300000,
              date: "2023-11-15",
              method: "Cheque",
              status: "Completed",
              description: "Material Purchase - 25% (Kitchen & Furniture)",
              transactionId: "CHQ789012",
              milestone: "Material Procurement",
              receipt: "ADW-REC-002"
            },
            {
              id: 1003,
              amount: 240000,
              date: "2024-01-20",
              method: "UPI",
              status: "Completed",
              description: "Installation Phase 1 - 20% (Kitchen & Living)",
              transactionId: "UPI345678",
              milestone: "50% Work Completion",
              receipt: "ADW-REC-003"
            },
            {
              id: 1004,
              amount: 300000,
              date: "2024-04-15",
              method: "Pending",
              status: "Pending",
              description: "Final Payment - 25% (Completion & Finishing)",
              transactionId: "Pending",
              milestone: "Project Completion",
              receipt: "Pending"
            }
          ]
        },
        {
          id: 102,
          name: "Balcony Garden Setup",
          category: "Landscaping",
          area: "150 sq ft",
          location: "Noida Sector 12",
          totalAmount: 650000,
          paidAmount: 450000,
          pendingAmount: 200000,
          status: "In Progress",
          completion: 60,
          startDate: "2024-02-01",
          expectedCompletion: "2024-05-15",
          designer: "Amit Kumar",
          services: ["Vertical Garden", "Outdoor Furniture", "Lighting"],
          payments: [
            {
              id: 1005,
              amount: 195000,
              date: "2024-02-01",
              method: "Bank Transfer",
              status: "Completed",
              description: "Design & Planning - 30%",
              transactionId: "ADW567890",
              milestone: "Design Approval",
              receipt: "ADW-REC-004"
            },
            {
              id: 1006,
              amount: 255000,
              date: "2024-03-10",
              method: "UPI",
              status: "Completed",
              description: "Material & Plants - 40%",
              transactionId: "UPI901234",
              milestone: "Material Procurement",
              receipt: "ADW-REC-005"
            },
            {
              id: 1007,
              amount: 200000,
              date: "2024-05-15",
              method: "Pending",
              status: "Pending",
              description: "Installation & Finishing - 30%",
              transactionId: "Pending",
              milestone: "Project Completion",
              receipt: "Pending"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Nexus Corporate Solutions",
      email: "admin@nexuscorp.com",
      phone: "+91 87654 32109",
      address: "Cyber City, Gurugram",
      clientType: "Commercial",
      totalProjects: 1,
      totalAmount: 2500000,
      paidAmount: 1750000,
      pendingAmount: 750000,
      nextPaymentDue: "2024-04-20",
      clientSince: "2023-12-01",
      projects: [
        {
          id: 201,
          name: "Corporate Office Interior",
          category: "Commercial",
          area: "5000 sq ft",
          location: "Gurugram Cyber City",
          totalAmount: 2500000,
          paidAmount: 1750000,
          pendingAmount: 750000,
          status: "In Progress",
          completion: 80,
          startDate: "2023-12-15",
          expectedCompletion: "2024-05-30",
          designer: "Neha Gupta",
          services: ["Reception Area", "Conference Rooms", "Workstations", "CEO Cabin", "Break Area"],
          payments: [
            {
              id: 2001,
              amount: 750000,
              date: "2023-12-15",
              method: "Bank Transfer",
              status: "Completed",
              description: "Advance Payment - 30% (Design & Planning)",
              transactionId: "ADW234567",
              milestone: "Design Approval",
              receipt: "ADW-REC-006"
            },
            {
              id: 2002,
              amount: 500000,
              date: "2024-01-30",
              method: "Cheque",
              status: "Completed",
              description: "Material Purchase - 20% (Furniture & Fixtures)",
              transactionId: "CHQ456789",
              milestone: "Material Procurement",
              receipt: "ADW-REC-007"
            },
            {
              id: 2003,
              amount: 500000,
              date: "2024-03-15",
              method: "Bank Transfer",
              status: "Completed",
              description: "Installation Phase - 20% (Workstations & Lighting)",
              transactionId: "ADW678901",
              milestone: "60% Work Completion",
              receipt: "ADW-REC-008"
            },
            {
              id: 2004,
              amount: 750000,
              date: "2024-04-20",
              method: "Pending",
              status: "Pending",
              description: "Final Payment - 30% (Completion & Handover)",
              transactionId: "Pending",
              milestone: "Project Completion",
              receipt: "Pending"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Agarwal Residence",
      email: "sunil.agarwal@hotmail.com",
      phone: "+91 76543 21098",
      address: "DLF Phase 2, Gurugram",
      clientType: "Residential",
      totalProjects: 3,
      totalAmount: 950000,
      paidAmount: 950000,
      pendingAmount: 0,
      nextPaymentDue: null,
      clientSince: "2023-06-10",
      projects: [
        {
          id: 301,
          name: "Master Bedroom Makeover",
          category: "Residential",
          area: "350 sq ft",
          location: "DLF Phase 2",
          totalAmount: 450000,
          paidAmount: 450000,
          pendingAmount: 0,
          status: "Completed",
          completion: 100,
          startDate: "2023-06-15",
          expectedCompletion: "2023-09-30",
          designer: "Kavya Sharma",
          services: ["Wardrobe", "Bed Design", "Lighting", "Flooring"],
          payments: [
            {
              id: 3001,
              amount: 135000,
              date: "2023-06-15",
              method: "UPI",
              status: "Completed",
              description: "Advance Payment - 30%",
              transactionId: "UPI123789",
              milestone: "Design Approval",
              receipt: "ADW-REC-009"
            },
            {
              id: 3002,
              amount: 180000,
              date: "2023-08-01",
              method: "Bank Transfer",
              status: "Completed",
              description: "Material & Labor - 40%",
              transactionId: "ADW789123",
              milestone: "Material Installation",
              receipt: "ADW-REC-010"
            },
            {
              id: 3003,
              amount: 135000,
              date: "2023-09-30",
              method: "Cheque",
              status: "Completed",
              description: "Final Payment - 30%",
              transactionId: "CHQ987654",
              milestone: "Project Completion",
              receipt: "ADW-REC-011"
            }
          ]
        }
      ]
    }
  ];

  const togglePaymentExpansion = (paymentId) => {
    setExpandedPayments(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'Pending': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'In Progress': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getClientTypeColor = (type) => {
    switch (type) {
      case 'Residential': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'Commercial': return 'text-indigo-700 bg-indigo-100 border-indigo-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'Pending': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredClients = clientsData.filter(client => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return client.pendingAmount > 0;
    if (filterStatus === 'completed') return client.pendingAmount === 0;
    return true;
  });

  if (selectedClient) {
    const client = clientsData.find(c => c.id === selectedClient);

    return (
      <div className="min-h-screen  ">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-white">
          <button
            onClick={() => setSelectedClient(null)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-px bg-slate-300"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Client Payment Details
            </h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-4">
          <div className=''>


            {/* Client Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200  p-8 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{client.name}</h2>
                    <div className="flex items-center space-x-4 text-slate-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {client.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {client.phone}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {client.address}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getClientTypeColor(client.clientType)}`}>
                        {client.clientType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <span>Client Since: {formatDate(client.clientSince)}</span>
                      <span>•</span>
                      <span>{client.totalProjects} Projects</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">Total Project Value</div>
                    <div className="text-3xl font-bold text-slate-800 mb-4">{formatCurrency(client.totalAmount)}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-emerald-600 font-medium">Received</div>
                        <div className="text-lg font-bold text-emerald-700">{formatCurrency(client.paidAmount)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-amber-600 font-medium">Pending</div>
                        <div className="text-lg font-bold text-amber-700">{formatCurrency(client.pendingAmount)}</div>
                      </div>
                    </div>
                    {client.nextPaymentDue && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-xs text-amber-600 font-medium">Next Payment Due</div>
                        <div className="text-sm font-semibold text-amber-800">{formatDate(client.nextPaymentDue)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-8">
              {client.projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  {/* Project Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{project.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getClientTypeColor(project.category)}`}>
                              {project.category}
                            </span>
                            <span>{project.area}</span>
                            <span>•</span>
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>Designer: {project.designer}</span>
                            <span>•</span>
                            <span>Started: {formatDate(project.startDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-1">Project Value</div>
                        <div className="text-xl font-bold text-slate-800">{formatCurrency(project.totalAmount)}</div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{project.completion}%</span>
                          </div>
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${project.completion}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mt-4">
                      <div className="text-sm font-medium text-slate-700 mb-2">Services Included:</div>
                      <div className="flex flex-wrap gap-2">
                        {project.services.map((service, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-slate-800">Payment Timeline</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>Paid: <span className="font-semibold text-emerald-600">{formatCurrency(project.paidAmount)}</span></span>
                        <span>•</span>
                        <span>Pending: <span className="font-semibold text-amber-600">{formatCurrency(project.pendingAmount)}</span></span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {project.payments.map((payment, index) => (
                        <div key={payment.id} className="border border-slate-200 rounded-xl overflow-hidden">
                          <div
                            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                            onClick={() => togglePaymentExpansion(payment.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  {expandedPayments[payment.id] ?
                                    <ChevronDown className="w-5 h-5 text-slate-400" /> :
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                  }
                                </div>
                                <div className="flex items-center space-x-3">
                                  {getPaymentStatusIcon(payment.status)}
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                    {index + 1}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-800">{payment.description}</div>
                                  <div className="text-sm text-slate-500">
                                    {formatDate(payment.date)} • {payment.milestone}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-slate-800">{formatCurrency(payment.amount)}</div>
                                <div className="text-sm text-slate-600">{payment.method}</div>
                              </div>
                            </div>
                          </div>

                          {expandedPayments[payment.id] && (
                            <div className="px-4 pb-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                  <div className="text-sm font-medium text-slate-700 mb-1">Transaction ID</div>
                                  <div className="text-sm text-slate-600 font-mono">{payment.transactionId}</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-700 mb-1">Payment Method</div>
                                  <div className="text-sm text-slate-600">{payment.method}</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-700 mb-1">Receipt No.</div>
                                  <div className="text-sm text-slate-600 font-mono">{payment.receipt}</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-700 mb-1">Milestone</div>
                                  <div className="text-sm text-slate-600">{payment.milestone}</div>
                                </div>
                              </div>
                              {payment.status === 'Completed' && (
                                <div className="flex items-center space-x-2 mt-4">
                                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                                    <Download className="w-4 h-4" />
                                    <span>Download Receipt</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 p-6 bg-white">
        <div className="flex items-center space-x-4">
          {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div> */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Payment History
            </h1>
          </div>
        </div>

      </div>


      <div className="max-w-7xl mx-auto p-6">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-emerald-600 mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(clientsData.reduce((sum, client) => sum + client.paidAmount, 0))}
                </div>
                <div className="text-sm text-slate-500 mt-1">Received Payments</div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-amber-600 mb-1">Pending Amount</div>
                <div className="text-2xl font-bold text-amber-700">
                  {formatCurrency(clientsData.reduce((sum, client) => sum + client.pendingAmount, 0))}
                </div>
                <div className="text-sm text-slate-500 mt-1">Outstanding Payments</div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-600 mb-1">Active Projects</div>
                <div className="text-2xl font-bold text-blue-700">
                  {clientsData.reduce((sum, client) => sum + client.projects.filter(p => p.status === 'In Progress').length, 0)}
                </div>
                <div className="text-sm text-slate-500 mt-1">Currently Running</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Hammer className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-600 mb-1">Total Clients</div>
                <div className="text-2xl font-bold text-purple-700">
                  {clientsData.length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Active Relationships</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
            <div className="flex items-center space-x-3">
              
              {/* <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button> */}
              {/* <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button> */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-slate-600" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Clients</option>
                    <option value="pending">Pending Payments</option>
                    <option value="completed">Completed Payments</option>
                  </select>
                </div>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <DollarSign className="w-4 h-4" />
                <span>Add Payment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Client Portfolio</h2>
            <div className="text-sm text-slate-500">
              Showing {filteredClients.length} of {clientsData.length} clients
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
              <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-slate-700">
                <div>Client Name</div>
                <div>Received Payment</div>
                <div>Pending Payment</div>
                <div>Last Payment Date</div>
                <div>Total Projects</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-200">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Client Name */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.clientType}</div>
                      </div>
                    </div>

                    {/* Received Payment */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-emerald-700">
                        {formatCurrency(client.paidAmount)}
                      </div>
                    </div>

                    {/* Pending Payment */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-amber-700">
                        {formatCurrency(client.pendingAmount)}
                      </div>
                    </div>

                    {/* Last Payment Date */}
                    <div className="text-center">
                      <div className="text-sm text-slate-600">
                        {client.lastPaymentDate ? formatDate(client.lastPaymentDate) : 'No payments yet'}
                      </div>
                    </div>

                    {/* Total Projects */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-slate-700">
                        {client.totalProjects}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelectedClient(client.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentHistory;