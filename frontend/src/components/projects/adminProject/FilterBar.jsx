// FilterBar Component
import { Plus, Edit, Trash2, Eye, Filter, X, User, Calendar, Tag, Search, Download, Phone, Mail, MapPin, IndianRupee, FileText, Users, Briefcase } from 'lucide-react';

export const FilterBar = ({ categories, activeFilter, setActiveFilter, searchTerm, setSearchTerm }) => (
  <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 px-6 py-4">
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
          <Filter size={18} className="text-white" />
        </div>
        <span className="text-sm font-medium text-slate-700">Filter by:</span>
      </div>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeFilter === category
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
            : 'bg-white/80 hover:bg-white text-slate-700 shadow-md hover:shadow-lg'
          }`}
        >
          {category}
        </button>
      ))}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-md"
        />
      </div>
    </div>
  </div>
);