import React, { useState } from 'react';
import { X, DollarSign, Calendar, CreditCard, FileText, User, Building, CheckCircle, AlertCircle } from 'lucide-react';

const AddPaymentForm = ({ isOpen, onClose, clientsData, onPaymentAdd }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    amount: '',
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    description: '',
    milestone: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const paymentMethods = [
    'Bank Transfer',
    'UPI',
    'Cheque',
    'Cash',
    'Card Payment',
    'Online Transfer'
  ];

  const milestones = [
    'Design Approval',
    'Material Procurement',
    'Work Commencement',
    '25% Work Completion',
    '50% Work Completion',
    '75% Work Completion',
    'Project Completion',
    'Final Handover',
    'Maintenance Payment',
    'Additional Work'
  ];

  const selectedClient = clientsData.find(client => client.id === parseInt(formData.clientId));
  const selectedProject = selectedClient?.projects.find(project => project.id === parseInt(formData.projectId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientId) newErrors.clientId = 'Please select a client';
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    if (!formData.amount) newErrors.amount = 'Please enter payment amount';
    if (formData.amount && (isNaN(formData.amount) || parseFloat(formData.amount) <= 0)) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select payment method';
    if (!formData.transactionId) newErrors.transactionId = 'Please enter transaction ID';
    if (!formData.description) newErrors.description = 'Please enter payment description';
    if (!formData.milestone) newErrors.milestone = 'Please select milestone';
    if (!formData.paymentDate) newErrors.paymentDate = 'Please select payment date';

    // Check if payment amount exceeds pending amount
    if (selectedProject && formData.amount && parseFloat(formData.amount) > selectedProject.pendingAmount) {
      newErrors.amount = `Amount cannot exceed pending amount of ₹${selectedProject.pendingAmount.toLocaleString()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPayment = {
        id: Date.now(), // Generate unique ID
        amount: parseFloat(formData.amount),
        date: formData.paymentDate,
        method: formData.paymentMethod,
        status: 'Completed',
        description: formData.description,
        transactionId: formData.transactionId,
        milestone: formData.milestone,
        receipt: `ADW-REC-${Date.now().toString().slice(-6)}`
      };

      // Call the parent component's callback to add the payment
      onPaymentAdd(parseInt(formData.clientId), parseInt(formData.projectId), newPayment);
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          clientId: '',
          projectId: '',
          amount: '',
          paymentMethod: 'Bank Transfer',
          transactionId: '',
          description: '',
          milestone: '',
          paymentDate: new Date().toISOString().split('T')[0]
        });
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setFormData(prev => ({
      ...prev,
      clientId,
      projectId: '' // Reset project when client changes
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add New Payment</h2>
                <p className="text-sm text-slate-600">Record a new payment from client</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="m-6 mb-0 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-800">Payment Added Successfully!</div>
                <div className="text-sm text-emerald-600">The payment has been recorded and updated.</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Select Client
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleClientChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.clientId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              >
                <option value="">Choose a client...</option>
                {clientsData.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.clientType})
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.clientId}
                </div>
              )}
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Select Project
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                disabled={!formData.clientId}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.projectId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                } ${!formData.clientId ? 'bg-slate-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Choose a project...</option>
                {selectedClient?.projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} (Pending: ₹{project.pendingAmount.toLocaleString()})
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.projectId}
                </div>
              )}
            </div>
          </div>

          {/* Project Details (if selected) */}
          {selectedProject && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800">Project Details</h4>
                <span className="text-sm text-blue-600">
                  Status: {selectedProject.status} ({selectedProject.completion}%)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Total Amount:</span>
                  <div className="text-blue-800 font-semibold">₹{selectedProject.totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Paid Amount:</span>
                  <div className="text-blue-800 font-semibold">₹{selectedProject.paidAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Pending Amount:</span>
                  <div className="text-blue-800 font-semibold">₹{selectedProject.pendingAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Payment Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.amount && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.amount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.paymentDate ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.paymentDate && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.paymentDate}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method and Transaction ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.paymentMethod ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              {errors.paymentMethod && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.paymentMethod}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter transaction ID"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.transactionId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.transactionId && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.transactionId}
                </div>
              )}
            </div>
          </div>

          {/* Milestone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Milestone
            </label>
            <select
              name="milestone"
              value={formData.milestone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.milestone ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            >
              <option value="">Select milestone...</option>
              {milestones.map(milestone => (
                <option key={milestone} value={milestone}>{milestone}</option>
              ))}
            </select>
            {errors.milestone && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.milestone}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Payment Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter payment description..."
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Payment...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Add Payment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentForm;