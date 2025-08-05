"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Search, Upload, X, User, Calendar, MapPin, DollarSign, UserCheck, CheckCircle } from 'lucide-react';
import { addProject, searchAllForDropdown } from '@/services/project.services';

// DropdownSelector component - same as before
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
  onClearSelection 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-white">
        <Icon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder || `Search ${label.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => onSearch(type, e.target.value)}
          className="flex-1 outline-none text-sm"
        />
        <Search className="w-4 h-4 text-gray-400" />
      </div>

      {searchQuery && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {filteredData.map(item => (
            <div
              key={item._id}
              onClick={() => onSelectItem(type, item)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-500">{item.email}</div>
            </div>
          ))}
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
            {selectedItem.address && (
              <div className="text-xs text-blue-700">{selectedItem.address}</div>
            )}
            {selectedItem.department && (
              <div className="text-xs text-blue-600 font-medium">{selectedItem.department}</div>
            )}
          </div>
          <button
            onClick={() => onClearSelection(type)}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )}
  </div>
));

DropdownSelector.displayName = 'DropdownSelector';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: '',
    status: 'pending',
    clientId: '',
    salespersonId: '',
    designerId: '',
    carpenterId: '',
    estimatedBudget: '',
    description: '',
    startingDate: '',
  });

  const [projectImages, setProjectImages] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    client: [],
    salesperson: [],
    designer: [],
    carpenter: [],
  });

  const [searchQueries, setSearchQueries] = useState({
    client: '',
    salesperson: '',
    designer: '',
    carpenter: ''
  });

  const [selectedItems, setSelectedItems] = useState({
    client: null,
    salesperson: null,
    designer: null,
    carpenter: null
  });

  // Add these new states for loading and success
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await searchAllForDropdown();
        const { clients = [], designers = [], salespersons = [], carpenters = [] } = res.data;

        setDropdownData({
          client: clients,
          salesperson: salespersons,
          designer: designers,
          carpenter: carpenters,
        });

        console.log("Dropdown Data Set:", { clients, designers, salespersons, carpenters });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

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
          preview: reader.result
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
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query)
    ) || [];
  }, [searchQueries, dropdownData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setSuccessMessage(''); // Clear previous success message

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formDataToSend.append(key, v));
        } else {
          formDataToSend.append(key, value);
        }
      });

      projectImages.forEach((image) => {
        formDataToSend.append("projectImage", image.file); // Use image.file instead of image
      });

      const response = await addProject(formDataToSend);
      console.log("Project added successfully:", response.data);
      
      // Set success message
      setSuccessMessage('Project added successfully!');
      
      // Optional: Reset form after successful submission
      // setFormData({
      //   title: '',
      //   location: '',
      //   category: '',
      //   status: 'pending',
      //   clientId: '',
      //   salespersonId: '',
      //   designerId: '',
      //   carpenterId: '',
      //   estimatedBudget: '',
      //   description: '',
      //   startingDate: '',
      // });
      // setProjectImages([]);
      // setSelectedItems({
      //   client: null,
      //   salesperson: null,
      //   designer: null,
      //   carpenter: null
      // });

    } catch (error) {
      console.error("Error submitting project:", error);
      setSuccessMessage(''); // Clear success message on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create New Project</h2>
        <p className="text-gray-600">Fill in the project details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Information section - same as before */}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                  placeholder="Enter budget amount"
                />
              </div>
            </div>
          </div>

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

        {/* Client Details */}
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
          />
        </div>

        {/* Staff Selection */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Staff Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DropdownSelector
              type="salesperson"
              label="Salesperson"
              icon={User}
              placeholder="Search salesperson..."
              searchQuery={searchQueries.salesperson}
              onSearch={handleSearch}
              filteredData={getFilteredData('salesperson')}
              selectedItem={selectedItems.salesperson}
              onSelectItem={selectItem}
              onClearSelection={clearSelection}
            />
            <DropdownSelector
              type="designer"
              label="Designer"
              icon={User}
              placeholder="Search designer..."
              searchQuery={searchQueries.designer}
              onSearch={handleSearch}
              filteredData={getFilteredData('designer')}
              selectedItem={selectedItems.designer}
              onSelectItem={selectItem}
              onClearSelection={clearSelection}
            />
            <DropdownSelector
              type="carpenter"
              label="Carpenter"
              icon={User}
              placeholder="Search carpenter..."
              searchQuery={searchQueries.carpenter}
              onSearch={handleSearch}
              filteredData={getFilteredData('carpenter')}
              selectedItem={selectedItems.carpenter}
              onSelectItem={selectItem}
              onClearSelection={clearSelection}
            />
          </div>
        </div>

        {/* Project Images */}
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
              className={`inline-block px-4 py-2 ${
                isLoading 
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

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            disabled={isLoading}
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
                Creating Project...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
