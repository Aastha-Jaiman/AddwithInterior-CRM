"use client";
import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Upload,
    File,
    User,
    Calendar,
    MapPin,
    DollarSign,
    FileText,
    Plus,
    Trash2,
    Camera,
    ChevronDown,
} from "lucide-react";

const ProjectForm = ({ currentView, selectedProject, navigateToList, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        estimatedBudget: "",
        finalBudget: "",
        designer: "",
        salesperson: "",
        carpenters: [""],
        startingDate: "",
        location: "",
        description: "",
        projectImage: null,
        roughQuotation: null,
        designPdf: null, // Add this line
        finalQuotation: null,
        currentStatus: "pending",
        customerName: "",
        customerNumber: "",
        customerEmail: "",
        customerAddress: "",
    });


    const teamMembers = {
        salespersons: [
            { id: 1, name: "Mike Johnson" },
            { id: 2, name: "Lisa Anderson" },
            { id: 3, name: "Robert Wilson" }
        ],
        designers: [
            { id: 1, name: "Sarah Wilson" },
            { id: 2, name: "Alex Cooper" },
            { id: 3, name: "Emma Davis" }
        ],
        carpenters: [
            { id: 1, name: "David Brown" },
            { id: 2, name: "Tom Wilson" },
            { id: 3, name: "Robert Davis" },
            { id: 4, name: "James Miller" }
        ]
    };

    const clients = [
        {
            id: 1,
            name: "John Doe",
            number: "+91 9876543210",
            email: "john@example.com",
            address: "123 Main St, Mumbai"
        },
        {
            id: 2,
            name: "Jane Smith",
            number: "+91 8765432109",
            email: "jane@example.com",
            address: "456 Oak Ave, Delhi"
        },
        {
            id: 3,
            name: "Alice Brown",
            number: "+91 7654321098",
            email: "alice@example.com",
            address: "789 Pine Rd, Bangalore"
        }
    ];

    const [errors, setErrors] = useState({});
    const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

    useEffect(() => {
        if (currentView === 'edit' && selectedProject) {
            setFormData({
                name: selectedProject.name || "",
                category: selectedProject.category || "",
                estimatedBudget: selectedProject.estimatedBudget || "",
                finalBudget: selectedProject.finalBudget || "",
                designer: selectedProject.designer || "",
                salesperson: selectedProject.salesperson || "",
                carpenters: selectedProject.carpenter || [""],
                startingDate: selectedProject.startingDate || "",
                location: selectedProject.location || "",
                description: selectedProject.description || "",
                projectImage: null,
                roughQuotation: null,
                designPdf: null, // Add this line
                finalQuotation: null,
                currentStatus: selectedProject.designStatus || "pending",
                customerName: selectedProject.customerName || "",
                customerNumber: selectedProject.customerNumber || "",
                customerEmail: selectedProject.customerEmail || "",
                customerAddress: selectedProject.customerAddress || "",
            });
        } else if (currentView === 'create') {
            setFormData({
                name: "",
                category: "",
                estimatedBudget: "",
                finalBudget: "",
                designer: "",
                salesperson: "",
                carpenters: [""],
                startingDate: "",
                location: "",
                description: "",
                projectImage: null,
                roughQuotation: null,
                designPdf: null, // Add this line
                finalQuotation: null,
                currentStatus: "pending",
                customerName: "",
                customerNumber: "",
                customerEmail: "",
                customerAddress: "",
            });
            setErrors({});
        }
    }, [currentView, selectedProject]);


    // Form handlers
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleClientSelect = (client) => {
        setFormData({
            ...formData,
            customerName: client.name,
            customerNumber: client.number,
            customerEmail: client.email,
            customerAddress: client.address,
        });
        setClientDropdownOpen(false);
    };

    const handleClientInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const addCarpenter = () => {
        setFormData({
            ...formData,
            carpenters: [...formData.carpenters, ""],
        });
    };

    const removeCarpenter = (index) => {
        const newCarpenters = formData.carpenters.filter((_, i) => i !== index);
        setFormData({ ...formData, carpenters: newCarpenters });
    };

    const updateCarpenter = (index, value) => {
        const newCarpenters = [...formData.carpenters];
        newCarpenters[index] = value;
        setFormData({ ...formData, carpenters: newCarpenters });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = "Project name is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.estimatedBudget) newErrors.estimatedBudget = "Estimated budget is required";
        if (!formData.designer) newErrors.designer = "Designer is required";
        if (!formData.salesperson) newErrors.salesperson = "Salesperson is required";
        if (!formData.startingDate) newErrors.startingDate = "Starting date is required";
        if (!formData.location) newErrors.location = "Location is required";
        if (!formData.customerName) newErrors.customerName = "Customer name is required";
        if (!formData.customerNumber) newErrors.customerNumber = "Customer number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={navigateToList}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Projects
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {currentView === 'edit' ? "Edit Project" : "Create New Project"}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {currentView === 'edit' ? "Update project information" : "Fill in the project details"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Project Information */}
                    <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Project Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                        } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    placeholder="Enter project name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.category ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                        } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Modular Kitchen">Modular Kitchen</option>
                                    <option value="Inplace Furniture">Inplace Furniture</option>
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estimated Budget *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="number"
                                        name="estimatedBudget"
                                        value={formData.estimatedBudget}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.estimatedBudget ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                            } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="0"
                                    />
                                </div>
                                {errors.estimatedBudget && <p className="mt-1 text-sm text-red-600">{errors.estimatedBudget}</p>}
                            </div>

                            {currentView === 'edit' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Final Budget
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="finalBudget"
                                            value={formData.finalBudget}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Starting Date *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="startingDate"
                                        value={formData.startingDate}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.startingDate ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                            } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    />
                                </div>
                                {errors.startingDate && <p className="mt-1 text-sm text-red-600">{errors.startingDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Location *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.location ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                            } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="Enter location"
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            {currentView === 'edit' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Status
                                    </label>
                                    <select
                                        name="currentStatus"
                                        value={formData.currentStatus}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="uploaded">Uploaded</option>
                                        <option value="finalize">Finalized</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter project description"
                            />
                        </div>
                    </section>

                    {/* Team Assignment */}
                    <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-green-600" />
                            Team Assignment
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Designer *
                                </label>
                                <select
                                    name="designer"
                                    value={formData.designer}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.designer ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                        } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                >
                                    <option value="">Select Designer</option>
                                    {teamMembers.designers.map(designer => (
                                        <option key={designer.id} value={designer.name}>{designer.name}</option>
                                    ))}
                                </select>
                                {errors.designer && <p className="mt-1 text-sm text-red-600">{errors.designer}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Salesperson *
                                </label>
                                <select
                                    name="salesperson"
                                    value={formData.salesperson}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.salesperson ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                        } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                >
                                    <option value="">Select Salesperson</option>
                                    {teamMembers.salespersons.map(person => (
                                        <option key={person.id} value={person.name}>{person.name}</option>
                                    ))}
                                </select>
                                {errors.salesperson && <p className="mt-1 text-sm text-red-600">{errors.salesperson}</p>}
                            </div>
                        </div>

                        {/* Carpenters */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Carpenters
                                </label>
                                <button
                                    type="button"
                                    onClick={addCarpenter}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Carpenter
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.carpenters.map((carpenter, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <select
                                            value={carpenter}
                                            onChange={(e) => updateCarpenter(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select Carpenter</option>
                                            {teamMembers.carpenters.map(carp => (
                                                <option key={carp.id} value={carp.name}>{carp.name}</option>
                                            ))}
                                        </select>
                                        {formData.carpenters.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCarpenter(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Document Upload */}
                    <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Upload className="h-5 w-5 text-purple-600" />
                            Document Upload
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Project Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Image
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="projectImage"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="hidden"
                                        id="projectImage"
                                    />
                                    <label
                                        htmlFor="projectImage"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                                    >
                                        <Camera className="h-6 w-6 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formData.projectImage ? formData.projectImage.name : "Upload Image"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Rough Quotation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rough Quotation
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="roughQuotation"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleInputChange}
                                        className="hidden"
                                        id="roughQuotation"
                                    />
                                    <label
                                        htmlFor="roughQuotation"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all"
                                    >
                                        <File className="h-6 w-6 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formData.roughQuotation ? formData.roughQuotation.name : "Upload Quotation"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Design PDF - Always show */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Design PDF
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="designPdf"
                                        accept=".pdf"
                                        onChange={handleInputChange}
                                        className="hidden"
                                        id="designPdf"
                                    />
                                    <label
                                        htmlFor="designPdf"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                                    >
                                        <File className="h-6 w-6 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formData.designPdf ? formData.designPdf.name : "Upload Design PDF"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Final Quotation - Only show after Design PDF is uploaded OR in edit mode if design exists */}
                            {(formData.designPdf || (currentView === 'edit' && selectedProject?.documents?.design)) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Final Quotation
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            name="finalQuotation"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleInputChange}
                                            className="hidden"
                                            id="finalQuotation"
                                        />
                                        <label
                                            htmlFor="finalQuotation"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
                                        >
                                            <File className="h-6 w-6 text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {formData.finalQuotation ? formData.finalQuotation.name : "Upload Final Quotation"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Conditional message for Final Quotation */}
                        {!formData.designPdf && currentView === 'create' && (
                            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Upload Design PDF first to enable Final Quotation upload
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Client Details */}
                    <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-orange-600" />
                            Client Details
                        </h3>

                        {/* Client Name Dropdown/Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Customer Name *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => handleClientInputChange('customerName', e.target.value)}
                                    onFocus={() => setClientDropdownOpen(true)}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerName ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                        } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    placeholder="Select or enter customer name"
                                />
                                <ChevronDown
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                                    onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                                />

                                {clientDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {clients
                                            .filter(client =>
                                                client.name.toLowerCase().includes(formData.customerName.toLowerCase())
                                            )
                                            .map(client => (
                                                <div
                                                    key={client.id}
                                                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                                                    onClick={() => handleClientSelect(client)}
                                                >
                                                    <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{client.number}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                            {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Customer Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.customerNumber}
                                    onChange={(e) => handleClientInputChange('customerNumber', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerNumber ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                                        } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    placeholder="Enter customer number"
                                />
                                {errors.customerNumber && <p className="mt-1 text-sm text-red-600">{errors.customerNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Customer Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => handleClientInputChange('customerEmail', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter customer email"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Customer Address
                            </label>
                            <textarea
                                value={formData.customerAddress}
                                onChange={(e) => handleClientInputChange('customerAddress', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter customer address"
                            />
                        </div>
                    </section>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={navigateToList}
                            className="px-6 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        >
                            {currentView === 'edit' ? "Update Project" : "Create Project"}
                        </button>
                    </div>
                </form>

                {/* Close dropdown on outside click */}
                {clientDropdownOpen && (
                    <div
                        className="fixed inset-0 z-5"
                        onClick={() => setClientDropdownOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectForm;
