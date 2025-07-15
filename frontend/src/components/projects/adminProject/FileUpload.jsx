// FileUpload Component

import { Plus, Edit, Trash2, Eye, Filter, X, User, Calendar, Tag, Search, Download, Phone, Mail, MapPin, IndianRupee, FileText, Users, Briefcase } from 'lucide-react';

export const FileUpload = ({ label, field, formData, setFormData, accept, inputRef }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: { name: file.name, url: fileURL } });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="file"
        accept={accept}
        ref={field === 'image' ? inputRef : null}
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
      />
      {formData[field] && (
        <div className="mt-2 flex items-center gap-2">
          {field === 'image' ? (
            <img src={formData[field].url} alt="Preview" className="w-20 h-20 object-cover rounded" />
          ) : (
            <div className="flex items-center gap-2">
              <Download className="text-green-600" size={16} />
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {formData[field].name}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};