"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";

const UploadBrochure = ({ onUploadSuccess, onClose }) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.includes("pdf")) {
      setUploadError("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setUploadFile(file);
    setUploadError("");
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      // Simulate upload with dummy data
      const newBrochure = {
        id: Math.random().toString(36).substr(2, 9),
        name: uploadFile.name,
        url: "#",
        uploadedAt: new Date().toISOString(),
        category: "General",
        views: 0,
      };
      onUploadSuccess(newBrochure);
      alert("Brochure uploaded successfully");
    } catch (err) {
      setUploadError("Failed to upload brochure");
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setUploadFile(null);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl border border-blue-100/50">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center">
          <FileText className="mr-2 w-6 h-6 text-blue-600" />
          Upload New Brochure
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`p-4 sm:p-6 rounded-xl border-2 border-dashed ${
          isDragging ? "border-blue-500 bg-blue-100/50" : "border-gray-300 bg-white"
        } transition-all duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-3">
            {uploadFile ? (
              <span className="flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5 text-red-500" />
                <span>{uploadFile.name}</span>
                <button
                  onClick={handleClearFile}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ) : (
              "Drag & drop a PDF file here or click to select"
            )}
          </p>
          <label className="block">
            <input
              id="brochure-upload"
              type="file"
              accept="application/pdf"
              onChange={handleInputChange}
              ref={fileInputRef}
              className="hidden"
            />
            <span className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-indigo-600 cursor-pointer transition-all duration-200">
              <Upload className="mr-2 w-5 h-5" />
              Choose PDF File
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-3">PDF only, max 10MB</p>
          {uploadError && (
            <p className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded-md">{uploadError}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleUploadSubmit}
          disabled={uploading || !uploadFile}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center transition-all duration-200"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload Brochure
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadBrochure;