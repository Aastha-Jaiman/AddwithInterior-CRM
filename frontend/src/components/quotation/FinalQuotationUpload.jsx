// components/FinalQuotationUpload.jsx
"use client"
import React, { useState } from 'react';
import { FileText, ArrowLeft, Upload, Trash2, CheckCircle } from 'lucide-react';

const FinalQuotationUpload = ({ onBack, onUpload, clientName, projectName }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file only');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first');
      return;
    }

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Call the parent function with proper data
      onUpload({
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2)
      });
      
      setUploading(false);
      setSelectedFile(null);
      alert('Final quotation uploaded successfully!');
      
      // Go back to main view after successful upload
      onBack();
    }, 2000);
  };

  return (
    <div className="bg-white border-2 border-slate-200 overflow-hidden rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center mb-2">
              <div className="p-2 bg-white/20 mr-3 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              Final Quotation Upload
            </h1>
            <p className="text-blue-100 text-lg font-medium">
              Client: <span className="font-semibold">{clientName}</span> | 
              Project: <span className="font-semibold">{projectName}</span>
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 transition-colors flex items-center space-x-2 font-semibold rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Upload Final Quotation PDF</h2>
            <p className="text-slate-600">Upload the finalized quotation document in PDF format</p>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-slate-300 p-8 text-center mb-6 hover:border-blue-400 transition-colors rounded-xl">
            <div className="mb-4">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-2">Drop your PDF file here or click to browse</p>
              <p className="text-sm text-slate-500">Only PDF files are accepted</p>
            </div>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer transition-colors rounded-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select PDF File
            </label>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-blue-50 border-2 border-blue-200 p-4 mb-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                    <p className="text-sm text-slate-600">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-800 p-1"
                  disabled={uploading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 font-bold mx-auto rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Upload Final Quotation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalQuotationUpload;
