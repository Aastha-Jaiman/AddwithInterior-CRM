'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Bell, 
  Settings, 
  DollarSign, 
  Monitor, 
  Rocket, 
  Clock, 
  X,
  Phone,
  BarChart3,
  CreditCard,
  MessageCircle,
  Plus,
  Download,
  Eye,
  Filter,
  FileText,
  TrendingUp,
  LogIn,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react'

// Enhanced mock data with more functionality
const mockClientData = {
  id: 'client-001',
  name: 'John Smith',
  email: 'john.smith@example.com',
  accountBalance: 1247.50,
  totalSpent: 3899.99,
  activeSubscriptions: 3,
  lastLogin: '2024-01-15T10:30:00Z',
  memberSince: '2023-03-15',
  paymentMethods: [
    {
      id: 'pm-001',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: 'pm-002',
      type: 'bank',
      last4: '5678',
      isDefault: false
    },
    {
      id: 'pm-003',
      type: 'wallet',
      isDefault: false
    }
  ],
  transactions: [
    {
      id: 'txn-001',
      date: '2024-01-15',
      description: 'Professional Web Development',
      amount: 299.99,
      status: 'completed',
      method: 'card',
      category: 'development',
      invoiceId: 'INV-2024-001',
      clientRef: 'WD-001'
    },
    {
      id: 'txn-002',
      date: '2024-01-12',
      description: 'UI/UX Design Package',
      amount: 2149.50,
      status: 'completed',
      method: 'bank',
      category: 'design',
      invoiceId: 'INV-2024-002',
      clientRef: 'UD-002'
    },
    {
      id: 'txn-003',
      date: '2024-01-10',
      description: 'Mobile App Development',
      amount: 1500.00,
      status: 'pending',
      method: 'card',
      category: 'mobile',
      invoiceId: 'INV-2024-003',
      clientRef: 'MA-003'
    },
    {
      id: 'txn-004',
      date: '2024-01-08',
      description: 'SEO Optimization Service',
      amount: 489.99,
      status: 'completed',
      method: 'wallet',
      category: 'seo',
      invoiceId: 'INV-2024-004',
      clientRef: 'SEO-004'
    },
    {
      id: 'txn-005',
      date: '2024-01-05',
      description: 'Digital Marketing Campaign',
      amount: 349.99,
      status: 'failed',
      method: 'card',
      category: 'marketing',
      invoiceId: 'INV-2024-005',
      clientRef: 'DM-005'
    }
  ],
  invoices: [
    {
      id: 'INV-2024-001',
      transactionId: 'txn-001',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 299.99,
      status: 'paid',
      items: [
        { description: 'Web Development - 20 hours', quantity: 1, rate: 149.99, amount: 149.99 },
        { description: 'Testing & Deployment', quantity: 1, rate: 150.00, amount: 150.00 }
      ]
    },
    {
      id: 'INV-2024-002',
      transactionId: 'txn-002',
      issueDate: '2024-01-12',
      dueDate: '2024-02-12',
      amount: 2149.50,
      status: 'paid',
      items: [
        { description: 'UI/UX Design', quantity: 1, rate: 1299.99, amount: 1299.99 },
        { description: 'Prototype Development', quantity: 1, rate: 449.99, amount: 449.99 },
        { description: 'Design System', quantity: 1, rate: 399.52, amount: 399.52 }
      ]
    },
    {
      id: 'INV-2024-003',
      transactionId: 'txn-003',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      amount: 1500.00,
      status: 'pending',
      items: [
        { description: 'Mobile App Development - Deposit', quantity: 1, rate: 1500.00, amount: 1500.00 }
      ]
    }
  ],
  recentActivity: [
    {
      id: 'act-001',
      type: 'payment',
      description: 'Web Development Payment Completed',
      amount: 299.99,
      timestamp: '2024-01-15T09:00:00Z',
      status: 'success'
    },
    {
      id: 'act-002',
      type: 'invoice',
      description: 'Invoice INV-2024-002 generated',
      timestamp: '2024-01-12T10:30:00Z',
      status: 'success'
    },
    {
      id: 'act-003',
      type: 'download',
      description: 'Downloaded invoice INV-2024-001',
      timestamp: '2024-01-11T15:20:00Z',
      status: 'success'
    }
  ],
  notifications: [
    {
      id: 'notif-001',
      title: 'Invoice Ready for Download',
      message: 'Your invoice INV-2024-001 for Web Development is ready for download.',
      type: 'success',
      timestamp: '2024-01-15T09:00:00Z',
      read: false
    },
    {
      id: 'notif-002',
      title: 'Payment Due Reminder',
      message: 'Mobile App Development payment is due in 3 days.',
      type: 'warning',
      timestamp: '2024-01-14T12:00:00Z',
      read: true
    }
  ]
}

const ClientPanel = () => {
  const router = useRouter()
  const [clientData, setClientData] = useState(mockClientData)
  const [activeTab, setActiveTab] = useState('overview')
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)

  useEffect(() => {
    const unread = clientData.notifications.filter(n => !n.read).length
    setUnreadNotifications(unread)
  }, [clientData.notifications])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Button Functions with Routing
  const handleBookConsultation = () => {
    router.push('/book-consultation')
  }

  const handleViewProjects = () => {
    router.push('/projects')
  }

  const handleMakePayment = () => {
    setShowAddPaymentModal(true)
  }

  const handleContactDesigner = () => {
    router.push('/contact-support')
  }

  const handleAddPaymentMethod = () => {
    const newMethod = {
      id: `pm-${Date.now()}`,
      type: 'card',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      brand: 'MasterCard',
      expiryDate: '12/27',
      isDefault: false
    }
    
    setClientData(prev => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, newMethod]
    }))
  }

  const handlePaymentMethodSettings = (methodId) => {
    router.push(`/payment-methods/${methodId}/settings`)
  }

  const handleNotificationClick = () => {
    setShowNotificationSettings(!showNotificationSettings)
  }

  const handleSettingsClick = () => {
    router.push('/account-settings')
  }

  const downloadInvoice = (invoiceId) => {
    const invoice = clientData.invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      const content = `
PROFESSIONAL SERVICES INVOICE
Invoice ID: ${invoice.id}
Issue Date: ${formatDate(invoice.issueDate)}
Due Date: ${formatDate(invoice.dueDate)}
Amount: ${formatCurrency(invoice.amount)}
Status: ${invoice.status.toUpperCase()}

SERVICES PROVIDED:
${invoice.items.map(item => 
  `${item.description} - Qty: ${item.quantity} - Rate: ${formatCurrency(item.rate)} - Amount: ${formatCurrency(item.amount)}`
).join('\n')}

Total Amount: ${formatCurrency(invoice.amount)}

Thank you for choosing our professional services!
Contact: support@company.com | Phone: (555) 123-4567
      `
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${invoiceId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'download',
        description: `Downloaded invoice ${invoiceId}`,
        timestamp: new Date().toISOString(),
        status: 'success'
      }
      
      setClientData(prev => ({
        ...prev,
        recentActivity: [newActivity, ...prev.recentActivity]
      }))
    }
  }

  const previewInvoice = (invoiceId) => {
    router.push(`/invoices/${invoiceId}/preview`)
  }

  const markNotificationAsRead = (notificationId) => {
    setClientData(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }))
  }

  const markAllNotificationsAsRead = () => {
    setClientData(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif => ({ ...notif, read: true }))
    }))
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'development': return <Monitor className="w-5 h-5" />
      case 'design': return <BarChart3 className="w-5 h-5" />
      case 'mobile': return <Phone className="w-5 h-5" />
      case 'seo': return <TrendingUp className="w-5 h-5" />
      case 'marketing': return <BarChart3 className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredTransactions = clientData.transactions.filter(transaction => 
    transactionFilter === 'all' || transaction.status === transactionFilter
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header - Clean White Theme */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome back, {clientData.name.split(' ')[0]}
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Professional Client • Member since {formatDate(clientData.memberSince)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <button 
                onClick={handleNotificationClick}
                className="relative p-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button 
                onClick={handleSettingsClick}
                className="p-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings Dropdown */}
        {showNotificationSettings && (
          <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">Notification Settings</h4>
              <button 
                onClick={() => setShowNotificationSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={markAllNotificationsAsRead}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Mark All Read
              </button>
              <button 
                onClick={() => router.push('/notification-settings')}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Notification Settings
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards - Clean White Theme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Account Balance</p>
                <div className="flex items-center space-x-1 md:space-x-2 mt-1">
                  {balanceVisible ? (
                    <p className="text-lg md:text-2xl font-bold text-gray-900">
                      {formatCurrency(clientData.accountBalance)}
                    </p>
                  ) : (
                    <p className="text-lg md:text-2xl font-bold text-gray-900">••••••</p>
                  )}
                  <button 
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {formatCurrency(clientData.totalSpent)}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {clientData.activeSubscriptions}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Last Visit</p>
                <p className="text-xs md:text-sm font-bold text-gray-900">
                  {formatDateTime(clientData.lastLogin)}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-4 md:mb-6">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
                { key: 'transactions', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
                { key: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
                { key: 'payments', label: 'Payment Methods', icon: <DollarSign className="w-4 h-4" /> },
                { key: 'activity', label: 'Activity', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'notifications', label: `Notifications ${unreadNotifications > 0 ? `(${unreadNotifications})` : ''}`, icon: <Bell className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-1 md:space-x-2 py-2 md:py-3 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Add Payment Modal */}
        {showAddPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Make a Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Visa •••• 4242</option>
                    <option>Bank •••• 5678</option>
                    <option>Digital Wallet</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      router.push('/payment-success')
                      setShowAddPaymentModal(false)
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Pay Now
                  </button>
                  <button 
                    onClick={() => setShowAddPaymentModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-4 md:space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Quick Actions */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Quick Actions</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button 
                    onClick={handleBookConsultation}
                    className="flex flex-col items-center justify-center space-y-2 p-3 md:p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 shadow-sm border border-blue-200"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-xs md:text-sm font-medium text-center">Book Consultation</span>
                  </button>
                  <button 
                    onClick={handleViewProjects}
                    className="flex flex-col items-center justify-center space-y-2 p-3 md:p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 shadow-sm border border-green-200"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-xs md:text-sm font-medium text-center">View Projects</span>
                  </button>
                  <button 
                    onClick={handleMakePayment}
                    className="flex flex-col items-center justify-center space-y-2 p-3 md:p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 shadow-sm border border-purple-200"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs md:text-sm font-medium text-center">Make Payment</span>
                  </button>
                  <button 
                    onClick={handleContactDesigner}
                    className="flex flex-col items-center justify-center space-y-2 p-3 md:p-4 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-all duration-200 shadow-sm border border-cyan-200"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs md:text-sm font-medium text-center">Contact Support</span>
                  </button>
                </div>
              </div>

              {/* Account Summary */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Account Summary</span>
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Email</span>
                    <span className="text-sm md:text-base text-gray-900 font-medium break-all">{clientData.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Member Since</span>
                    <span className="text-sm md:text-base text-gray-900 font-medium">{formatDate(clientData.memberSince)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Payment Methods</span>
                    <span className="text-sm md:text-base text-gray-900 font-medium">{clientData.paymentMethods.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Account Status</span>
                    <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Transactions</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select 
                      value={transactionFilter}
                      onChange={(e) => setTransactionFilter(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Transactions</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getCategoryIcon(transaction.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs md:text-sm text-gray-600">
                              <span>{formatDate(transaction.date)}</span>
                              <span>•</span>
                              <span className="capitalize">{transaction.method}</span>
                              <span>•</span>
                              <span>Ref: {transaction.clientRef}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div className="text-right">
                            <p className="text-base md:text-lg font-bold text-gray-900">
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                          {transaction.invoiceId && (
                            <button 
                              onClick={() => downloadInvoice(transaction.invoiceId)}
                              className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs border border-blue-200"
                            >
                              <Download className="w-3 h-3" />
                              <span className="hidden sm:inline">Invoice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Invoices & Receipts</span>
                </h3>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {clientData.invoices.map((invoice) => (
                    <div key={invoice.id} className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h4 className="text-base md:text-lg font-semibold text-gray-900">
                              {invoice.id}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit border ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs md:text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Issue Date:</span> {formatDate(invoice.issueDate)}
                            </div>
                            <div>
                              <span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span> {formatCurrency(invoice.amount)}
                            </div>
                            <div>
                              <span className="font-medium">Items:</span> {invoice.items.length}
                            </div>
                          </div>
                          
                          {/* Invoice Items */}
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Invoice Items:</h5>
                            <div className="space-y-1">
                              {invoice.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-xs text-gray-600">
                                  <span className="flex-1">{item.description}</span>
                                  <span className="text-right">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center text-sm font-semibold text-gray-900">
                              <span>Total:</span>
                              <span>{formatCurrency(invoice.amount)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-row lg:flex-col gap-2">
                          <button 
                            onClick={() => downloadInvoice(invoice.id)}
                            className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm whitespace-nowrap"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                          <button 
                            onClick={() => previewInvoice(invoice.id)}
                            className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Payment Methods</span>
                  </h3>
                  <button 
                    onClick={handleAddPaymentMethod}
                    className="inline-flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {clientData.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-gray-500" />
                        <div>
                          <p className="text-sm md:text-base font-medium text-gray-900 capitalize">
                            {method.brand || method.type} {method.last4 && `•••• ${method.last4}`}
                          </p>
                          {method.expiryDate && (
                            <p className="text-xs md:text-sm text-gray-600">Expires {method.expiryDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                        <button 
                          onClick={() => handlePaymentMethodSettings(method.id)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Recent Activity</span>
                </h3>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {clientData.recentActivity.map((activity) => {
                    const getActivityIcon = (type) => {
                      switch (type) {
                        case 'payment': return <CreditCard className="w-5 h-5" />
                        case 'invoice': return <FileText className="w-5 h-5" />
                        case 'download': return <Download className="w-5 h-5" />
                        case 'login': return <LogIn className="w-5 h-5" />
                        default: return <FileText className="w-5 h-5" />
                      }
                    }

                    return (
                      <div key={activity.id} className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            {formatDateTime(activity.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.amount && (
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(activity.amount)}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </h3>
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Mark All Read
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {clientData.notifications.map((notification) => {
                    const getNotificationIcon = (type) => {
                      switch (type) {
                        case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
                        case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        case 'error': return <XCircle className="w-5 h-5 text-red-500" />
                        default: return <Info className="w-5 h-5 text-blue-500" />
                      }
                    }

                    return (
                      <div 
                        key={notification.id} 
                        className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm md:text-base font-medium ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs md:text-sm mt-1 ${
                              notification.read ? 'text-gray-600' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDateTime(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientPanel
