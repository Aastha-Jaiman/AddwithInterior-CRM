"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Search, Upload, X, User, Calendar, MapPin, DollarSign, UserCheck, CheckCircle, ArrowLeft, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';
import { addProject, searchAllForDropdown, updateProject } from '@/services/project.services';

// Toggle-based DropdownSelector
const DropdownSelector = React.memo(({
  type,
  label,
  icon: Icon,
  placeholder,
  searchQuery,
  onSearch,
  filteredData,
  selectedItem,
  onSelectItem,
  onClearSelection,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle open/close
  const handleToggle = () => {
    if (!disabled) setIsOpen(open => !open);
  };

  // Select item and close
  const handleSelectItem = (type, item) => {
    onSelectItem(type, item);
    setIsOpen(false);
  };

  // Clear selection and close
  const handleClearSelection = (type) => {
    onClearSelection(type);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {/* Toggle button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-white w-full justify-between ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        >
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-700">
              {selectedItem ? selectedItem.name : (placeholder || `Search ${label.toLowerCase()}...`)}
            </span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
            <div className="flex items-center space-x-2 p-2 border-b border-gray-100">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                className="flex-1 outline-none text-sm"
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => onSearch(type, e.target.value)}
                disabled={disabled}
              />
            </div>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <div
                  key={item._id}
                  onClick={() => handleSelectItem(type, item)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.email}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500">No results found.</div>
            )}
          </div>
        )}
      </div>
      {selectedItem && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium text-sm text-blue-900">{selectedItem.name}</div>
              <div className="text-xs text-blue-700">{selectedItem.email}</div>
              <div className="text-xs text-blue-700">{selectedItem.phone}</div>
              {selectedItem.address && typeof selectedItem.address === 'object' ? (
                <div className="text-xs text-blue-700">{selectedItem.address.addressinfo}</div>
              ) : (
                <div className="text-xs text-blue-700">{selectedItem.address}</div>
              )}
              {selectedItem.department && (
                <div className="text-xs text-blue-600 font-medium">{selectedItem.department}</div>
              )}
            </div>
            {!disabled && (
              <button onClick={() => handleClearSelection(type)} className="text-blue-400 hover:text-blue-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

DropdownSelector.displayName = 'DropdownSelector';

const KITCHEN_SECTIONS = [
  {
    sectionName: "Wooden Part",
    customSectionName: "",
    items: [
      { itemName: "Shutter", height: 0, width: 0, price: 50, calculation: 0, total: 0 },
      { itemName: "Carcase", height: 0, width: 0, price: 80, calculation: 0, total: 0 },
      { itemName: "Profile Shutter", height: 0, width: 0, price: 50, calculation: 0, total: 0 },
      { itemName: "Shelves", height: 0, width: 0, price: 80, calculation: 0, total: 0 },
      { itemName: "Counter Top", height: 0, width: 0, price: 80, calculation: 0, total: 0 },
    ],
    sectionTotal: 0,
  },
  {
    sectionName: "Hardware",
    customSectionName: "",
    items: [
      { itemName: "Hinges", height: 0, width: 0, price: 40, calculation: 0, total: 0 },
      { itemName: "Drawer Channels'", height: 0, width: 0, price: 60, calculation: 0, total: 0 },
      { itemName: "Handles", height: 0, width: 0, price: 20, calculation: 0, total: 0 },
      { itemName: "Soft Close", height: 0, width: 0, price: 100, calculation: 0, total: 0 },
      { itemName: "Corner Solutions", height: 0, width: 0, price: 30, calculation: 0, total: 0 },
    ],
    sectionTotal: 0,
  },
  {
    sectionName: "Accessories",
    customSectionName: "",
    items: [
      { itemName: "Pull Out Baskets", height: 0, width: 0, price: 120, calculation: 0, total: 0 },
      { itemName: "Bottle Pull Out", height: 0, width: 0, price: 80, calculation: 0, total: 0 },
      { itemName: "Cutlery Tray", height: 0, width: 0, price: 150, calculation: 0, total: 0 },
      { itemName: "Corner Carousel", height: 0, width: 0, price: 180, calculation: 0, total: 0 },
      { itemName: "Pantry Unit", height: 0, width: 0, price: 80, calculation: 0, total: 0 },
    ],
    sectionTotal: 0,
  },
  {
    sectionName: "Labour",
    customSectionName: "",
    items: [
      { itemName: "Installation", height: 0, width: 0, price: 500, calculation: 0, total: 0 },
      { itemName: "Transportation", height: 0, width: 0, price: 80, calculation: 0, total: 0 },
      { itemName: "Design Consultation", height: 0, width: 0, price: 150, calculation: 0, total: 0 },
      { itemName: "Site Measurement", height: 0, width: 0, price: 180, calculation: 0, total: 0 },
    ],
    sectionTotal: 0,
  },
];

const INPLACE_SECTIONS = [
  {
    sectionName: "Furniture",
    customSectionName: "",
    items: [
      { itemName: "Box", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
      { itemName: "Extra Drawer", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
      { itemName: "One Side Color", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
      { itemName: "Wall Panelling", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
      { itemName: "Side Table", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
      { itemName: "Vanity", height: 0, width: 0, price: 10, calculation: 0, total: 0, vanityType: "2F" },
      { itemName: "TV Unit", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
      { itemName: "Chapas Wardrobe", height: 0, width: 0, price: 10, calculation: 0, total: 0 },
    ],
    sectionTotal: 0,
  },
];

// ProjectForm unchanged except DropdownSelector toggle dropdown
const ProjectForm = ({ navigateToList, projectToEdit = null }) => {
  const isEditMode = !!projectToEdit;

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: '',
    status: 'Pending',
    clientId: '',
    salespersonId: '',
    designerId: '',
    carpenterId: '',
    estimatedBudget: '',
    finalBudget: '', // add this
    description: '',
    startingDate: '',
  });

  const [projectImages, setProjectImages] = useState([]);
  const [dropdownData, setDropdownData] = useState({ client: [], salesperson: [], designer: [], carpenter: [] });
  const [searchQueries, setSearchQueries] = useState({ client: '', salesperson: '', designer: '', carpenter: '' });
  const [selectedItems, setSelectedItems] = useState({ client: null, salesperson: null, designer: null, carpenter: null });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // States for Rough quotation calculator modal
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [calcSections, setCalcSections] = useState([]);

  const openRoughCalculator = () => {
    if (!formData.category) {
      alert("Please select category first.");
      return;
    }
    const category = formData.category.toLowerCase();
    let template = [];
    if (category === "modular_kitchen") {
      template = KITCHEN_SECTIONS;
    } else if (category === "inplace_furniture") {
      template = INPLACE_SECTIONS;
    } else {
      alert(`Unsupported project category: ${formData.category}`);
      return;
    }
    // Deep clone template
    setCalcSections(JSON.parse(JSON.stringify(template)));
    setIsCalcModalOpen(true);
  };

  const handleCalcItemChange = (sectionIndex, itemIndex, field, value) => {
    const updated = [...calcSections];
    const item = { ...updated[sectionIndex].items[itemIndex] };
    
    item[field] = value;
    
    const width = parseFloat(item.width) || 0;
    const height = parseFloat(item.height) || 0;
    const price = parseFloat(item.price) || 0;
    
    item.calculation = width * height;
    item.total = item.calculation * price;
    
    updated[sectionIndex].items[itemIndex] = item;
    
    // Recalculate section total
    updated[sectionIndex].sectionTotal = updated[sectionIndex].items.reduce(
      (sum, it) => sum + (it.total || 0), 0
    );
    
    setCalcSections(updated);
  };

  const getCalcGrandTotal = () => {
    return calcSections.reduce((sum, sec) => sum + (sec.sectionTotal || 0), 0);
  };

  const applyCalcTotal = () => {
    const grandTotal = getCalcGrandTotal();
    setFormData(prev => ({ ...prev, estimatedBudget: Math.round(grandTotal) }));
    setIsCalcModalOpen(false);
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await searchAllForDropdown();
        const { clients = [], designers = [], salespersons = [], carpenters = [] } = res.data;
        setDropdownData({ client: clients, salesperson: salespersons, designer: designers, carpenter: carpenters });
        console.log("Dropdown Data Set:", { clients, designers, salespersons, carpenters });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: projectToEdit.title || '',
        location: projectToEdit.location || '',
        category: projectToEdit.category || '',
        status: projectToEdit.status || 'Pending',
        estimatedBudget: projectToEdit.estimatedBudget || '',
        finalBudget: '',
        description: projectToEdit.description || '',
        startingDate: projectToEdit.startingDate ? projectToEdit.startingDate.split('T')[0] : '',
        clientId: projectToEdit.client?._id || '',
        salespersonId: projectToEdit.salesperson?._id || '',
        designerId: projectToEdit.designer?._id || '',
        carpenterId: projectToEdit.carpenter?._id || '',
      });

      setSelectedItems({
        client: projectToEdit.client || null,
        salesperson: projectToEdit.salesperson || null,
        designer: projectToEdit.designer || null,
        carpenter: projectToEdit.carpenter || null,
      });

      setProjectImages((projectToEdit.projectImages || []).map(img => ({
        id: img.public_id || Date.now() + Math.random(),
        preview: img.url,
        file: null,
        isExisting: true
      })));
    }
  }, [isEditMode, projectToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setProjectImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          preview: reader.result,
          isExisting: false
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setProjectImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSearch = useCallback((type, query) => {
    setSearchQueries(prev => ({ ...prev, [type]: query }));
  }, []);

  const selectItem = useCallback((type, item) => {
    setSelectedItems(prev => ({ ...prev, [type]: item }));
    setFormData(prev => ({ ...prev, [`${type}Id`]: item._id }));
    setSearchQueries(prev => ({ ...prev, [type]: '' }));
  }, []);

  const clearSelection = useCallback((type) => {
    setSelectedItems(prev => ({ ...prev, [type]: null }));
    setFormData(prev => ({ ...prev, [`${type}Id`]: '' }));
  }, []);

  const getFilteredData = useCallback((type) => {
    const query = searchQueries[type].toLowerCase();
    return dropdownData[type]?.filter(item =>
      item.name?.toLowerCase().includes(query) || item.email?.toLowerCase().includes(query)
    ) || [];
  }, [searchQueries, dropdownData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();

      if (isEditMode) {
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("finalBudget", formData.finalBudget);
        formDataToSend.append("salespersonId", formData.salespersonId);
        formDataToSend.append("designerId", formData.designerId);
        formDataToSend.append("carpenterId", formData.carpenterId);

        projectImages.forEach((img) => {
          if (!img.isExisting && img.file) {
            formDataToSend.append("projectImage", img.file);
          }
        });

        const res = await updateProject(projectToEdit._id, formDataToSend);
        setSuccessMessage("Project updated successfully!");

        console.log("res", res)
      } else {
        console.log("Submitting formData:", formData);
        Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
        projectImages.forEach((image) => {
          formDataToSend.append("projectImage", image.file);
        });
        for (let pair of formDataToSend.entries()) {
          console.log("formDataToSend Entry:", pair[0], pair[1]);
        }
        const res = await addProject(formDataToSend);
        setSuccessMessage("Project added successfully!");
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-8">
        <button
          onClick={navigateToList}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Projects</span>
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </h2>
        <p className="text-gray-600">
          {isEditMode
            ? 'Update the project details below'
            : 'Fill in the project details below'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Project Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isLoading || isEditMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                placeholder="Project location"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoading || isEditMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                required
              >
                <option value="">Select category</option>
                <option value="modular_Kitchen">Modular Kitchen</option>
                <option value="inPlace_Furniture">In Place Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
              >
                <option value="Pending">Pending</option>
                <option value="In-Process">In Process</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Starting Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleInputChange}
                  disabled={isLoading || isEditMode}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
          {/* Estimated Budget */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
            <div className="flex gap-3 items-stretch">
              <div className="relative flex-1">
                <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleInputChange}
                  disabled={isLoading || isEditMode}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                  placeholder="Enter budget amount"
                />
              </div>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={openRoughCalculator}
                  className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <DollarSign className="w-4 h-4" />
                  Rough Calculation
                </button>
              )}
            </div>
          </div>
          {/* Final Budget - Only in Edit Mode */}
          {isEditMode && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Budget</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  name="finalBudget"
                  value={formData.finalBudget || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, finalBudget: e.target.value }))}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter final budget"
                />
              </div>
            </div>
          )}
          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none disabled:bg-gray-100"
              placeholder="Project description..."
            />
          </div>
        </div>
        {/* Client */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-green-600" />
            Client Details
          </h3>
          <DropdownSelector
            type="client"
            label="Select Client"
            icon={UserCheck}
            placeholder="Search client by name or email..."
            searchQuery={searchQueries.client}
            onSearch={handleSearch}
            filteredData={getFilteredData('client')}
            selectedItem={selectedItems.client}
            onSelectItem={selectItem}
            onClearSelection={clearSelection}
            disabled={isLoading || isEditMode}
          />
        </div>
        {/* Staff */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Staff Selection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['salesperson', 'designer', 'carpenter'].map((type) => (
              <DropdownSelector
                key={type}
                type={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                icon={User}
                placeholder={`Search ${type}...`}
                searchQuery={searchQueries[type]}
                onSearch={handleSearch}
                filteredData={getFilteredData(type)}
                selectedItem={selectedItems[type]}
                onSelectItem={selectItem}
                onClearSelection={clearSelection}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
        {/* Images */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-purple-600" />
            Project Images
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600 mb-2">Click to upload images or drag and drop</div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`inline-block px-4 py-2 ${isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200'
                } rounded-lg transition-colors`}
            >
              Choose Files
            </label>
          </div>
          {projectImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {projectImages.map(image => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    disabled={isLoading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        )}
        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            disabled={isLoading}
            onClick={navigateToList}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Updating Project...' : 'Creating Project...'}
              </>
            ) : (
              isEditMode ? 'Update Project' : 'Create Project'
            )}
          </button>
        </div>
      </form>

      {/* Modal */}
      {isCalcModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quotation Calculator (Rough Estimate)</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Category: <span className="font-semibold text-blue-600">{formData.category === 'modular_Kitchen' ? 'Modular Kitchen' : 'In Place Furniture'}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCalcModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {calcSections.map((section, sIndex) => (
                <div key={sIndex} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">{section.sectionName}</h4>
                    <span className="text-sm font-semibold text-blue-700">Section Total: ₹{Number(section.sectionTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50/50 text-xs text-gray-700 uppercase border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-medium">Item Name</th>
                          <th className="px-4 py-3 text-center font-medium w-24">Width (ft)</th>
                          <th className="px-4 py-3 text-center font-medium w-24">Height (ft)</th>
                          <th className="px-4 py-3 text-center font-medium w-24">Area (sq ft)</th>
                          <th className="px-4 py-3 text-center font-medium w-28">Price / sq ft</th>
                          <th className="px-4 py-3 text-right font-medium w-32">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {section.items.map((item, iIndex) => (
                          <tr key={iIndex} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3.5 font-medium text-gray-900">{item.itemName}</td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.width || ''}
                                onChange={(e) => handleCalcItemChange(sIndex, iIndex, 'width', e.target.value)}
                                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.height || ''}
                                onChange={(e) => handleCalcItemChange(sIndex, iIndex, 'height', e.target.value)}
                                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3 text-center text-gray-500 font-medium">
                              {Number(item.calculation || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="relative inline-block">
                                <span className="absolute left-2 top-2 text-gray-400 text-xs">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={item.price || ''}
                                  onChange={(e) => handleCalcItemChange(sIndex, iIndex, 'price', e.target.value)}
                                  className="w-24 pl-5 pr-2 py-1.5 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                  placeholder="0"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              ₹{Number(item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Grand Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{Number(getCalcGrandTotal() || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCalcModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyCalcTotal}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply to Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
