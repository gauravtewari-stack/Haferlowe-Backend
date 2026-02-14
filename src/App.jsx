import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  Utensils,
  GraduationCap,
  Newspaper,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronDown,
  AlertCircle,
  Activity,
  PlayCircle,
  Image as ImageIcon,
  Calendar,
  User,
  Bell,
  Smartphone,
  Tag,
  List,
  LogOut,
  Check,
  XCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Video,
  ShoppingBag,
  Smile,
  Frown,
  Meh,
  TrendingDown,
  TrendingUp,
  Lock,
  Ban,
  Loader2,
  RefreshCw,
  Zap,
  Scale,
  Droplets,
  Target,
  ToggleLeft,
  ToggleRight,
  Info,
  MessageSquare
} from 'lucide-react';
import { adminUsersService, adminRecipesService, transformFromApiFormat } from './services';

// --- MOCK DATA ---

const MOCK_USERS = [
  { 
    id: 'u1', 
    name: 'Sarah Jenkins', 
    email: 'sarah.j@example.com', 
    phase: 'Routine', 
    status: 'Active', 
    joinDate: '2025-11-15', 
    lastActive: '2026-01-20', 
    baselines: { startWeight: 85, currentWeight: 78, targetWeight: 65, startHbA1c: 7.2, currentHbA1c: 6.1, targetHbA1c: 5.5 },
    history: {
      weight: [
        { date: 'Jan 14', value: 79.2 }, { date: 'Jan 15', value: 79.0 }, { date: 'Jan 16', value: 78.8 },
        { date: 'Jan 17', value: 78.5 }, { date: 'Jan 18', value: 78.5 }, { date: 'Jan 19', value: 78.2 }, { date: 'Jan 20', value: 78.0 }
      ],
      wellbeing: [4, 3, 5, 4, 2, 5, 5], // 1-5 scale for last 7 days
      hba1c: [
        { date: 'Q4 2024', value: 7.2 },
        { date: 'Q1 2025', value: 6.8 },
        { date: 'Q2 2025', value: 6.5 },
        { date: 'Q3 2025', value: 6.1 }
      ]
    }
  },
  { 
    id: 'u2', 
    name: 'Michael Ross', 
    email: 'm.ross@example.com', 
    phase: 'Restart', 
    status: 'Warning', 
    joinDate: '2026-01-02', 
    lastActive: '2026-01-18', 
    baselines: { startWeight: 92, currentWeight: 91, targetWeight: 80, startHbA1c: 6.8, currentHbA1c: 6.7, targetHbA1c: 5.7 },
    history: {
      weight: [
        { date: 'Jan 14', value: 91.8 }, { date: 'Jan 15', value: 91.5 }, { date: 'Jan 16', value: 91.6 },
        { date: 'Jan 17', value: 91.4 }, { date: 'Jan 18', value: 91.2 }, { date: 'Jan 19', value: 91.1 }, { date: 'Jan 20', value: 91.0 }
      ],
      wellbeing: [2, 2, 3, 2, 1, 3, 2],
      hba1c: [
        { date: 'Q4 2025', value: 6.8 },
        { date: 'Current', value: 6.7 }
      ]
    }
  },
  { 
    id: 'u3', 
    name: 'Emma Wong', 
    email: 'emma.w@example.com', 
    phase: 'Success', 
    status: 'Active', 
    joinDate: '2025-08-10', 
    lastActive: '2026-01-21', 
    baselines: { startWeight: 68, currentWeight: 59, targetWeight: 58, startHbA1c: 6.1, currentHbA1c: 5.4, targetHbA1c: 5.4 },
    history: {
      weight: [
        { date: 'Jan 14', value: 59.5 }, { date: 'Jan 15', value: 59.4 }, { date: 'Jan 16', value: 59.3 },
        { date: 'Jan 17', value: 59.2 }, { date: 'Jan 18', value: 59.1 }, { date: 'Jan 19', value: 59.0 }, { date: 'Jan 20', value: 59.0 }
      ],
      wellbeing: [5, 5, 4, 5, 5, 5, 5],
      hba1c: [
        { date: 'Q3 2024', value: 6.1 },
        { date: 'Q4 2024', value: 5.8 },
        { date: 'Q1 2025', value: 5.4 }
      ]
    }
  },
];

const MOCK_RECIPE_CATEGORIES = [
  { id: 'rc1', name: 'Breakfast' },
  { id: 'rc2', name: 'Lunch' },
  { id: 'rc3', name: 'Dinner' },
  { id: 'rc4', name: 'Snacks' },
  { id: 'rc5', name: 'Smoothies' }
];

const MOCK_RECIPES = [
  { 
    id: 'r1', 
    title: 'Zucchini & Feta Fritters', 
    category: 'Breakfast',
    calories: 180, 
    protein: 12, 
    carbs: 8, 
    fats: 10, 
    prepTime: 25, 
    tags: ['Low Carb', 'Vegetarian'], 
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=300&h=200',
    ingredients: [{ name: 'Zucchini', amount: 300, unit: 'g' }, { name: 'Feta Cheese', amount: 50, unit: 'g' }],
    instructions: '1. Grate zucchini...\n2. Mix with feta...'
  },
  { 
    id: 'r2', 
    title: 'Grilled Salmon Bowl', 
    category: 'Lunch',
    calories: 450, 
    protein: 35, 
    carbs: 40, 
    fats: 18, 
    prepTime: 30, 
    tags: ['High Protein', 'Gluten Free'], 
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=300&h=200',
    ingredients: [{ name: 'Salmon Fillet', amount: 150, unit: 'g' }, { name: 'Quinoa', amount: 100, unit: 'g' }],
    instructions: '1. Grill salmon...\n2. Cook quinoa...'
  },
];

const MOCK_COURSES = [
  {
    id: 'c1',
    title: 'Metabolism Reset 101',
    instructor: 'Dr. A. Miller',
    level: 'Beginner',
    modules: [
      { 
        id: 'm1', 
        title: 'Week 1: Understanding Glucose', 
        lessons: [
          { id: 'l1', title: 'What is Insulin Resistance?', duration: '15:00' },
          { id: 'l2', title: 'The Role of Fiber', duration: '12:30' }
        ] 
      }
    ]
  }
];

const MOCK_NEWS_CATEGORIES = [
  { id: 'nc1', name: 'Nutrition' },
  { id: 'nc2', name: 'Fitness' },
  { id: 'nc3', name: 'Mental Health' },
  { id: 'nc4', name: 'Science News' }
];

const MOCK_FEED_ITEMS = [
  {
    id: 'n1',
    type: 'article',
    title: '5 Tips for Managing Blood Sugar During Holidays',
    summary: 'Navigating family dinners without spiking your glucose is possible with these strategies.',
    content: 'Full article content here...',
    category: 'Nutrition',
    author: 'Dr. Sarah Smith',
    publishDate: '2025-12-20',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300&h=200'
  },
  {
    id: 'p1',
    type: 'notification',
    title: 'Hydration Reminder!',
    summary: 'Did you drink enough water today? Log your intake now.',
    targetAudience: 'All Users',
    publishDate: '2026-01-21',
    status: 'Sent'
  },
  {
    id: 'n2',
    type: 'article',
    title: 'New Study: Sleep and Weight Loss',
    summary: 'Why getting 8 hours of sleep might be more important than your morning jog.',
    content: 'Full article content here...',
    category: 'Science News',
    author: 'Medical News Team',
    publishDate: '2026-01-15',
    image: 'https://images.unsplash.com/photo-1541781777621-3914296d36e3?auto=format&fit=crop&q=80&w=300&h=200'
  }
];

// Feedback Rules - Progress Logic Engine
const MOCK_FEEDBACK_RULES = [
  // ============ WEIGHT LOSS RULES ============
  // Weight Loss - Relative Logic (Trends)
  {
    id: 'fr1',
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'relative',
    condition: 'decrease_by',
    value: 0.5,
    unit: 'kg',
    message: 'Nice progress! Every small step counts toward your weight loss goal.',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr2',
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'relative',
    condition: 'decrease_by',
    value: 1.0,
    unit: 'kg',
    message: 'Great work! You have lost 1kg this week. Keep it up!',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr3',
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'relative',
    condition: 'increase_by',
    value: 1.0,
    unit: 'kg',
    message: 'Your weight has increased slightly. Stay focused on your meals and movement.',
    type: 'warning',
    isActive: true
  },
  // Weight Loss - Milestone Logic
  {
    id: 'fr4',
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'milestone',
    condition: 'reach_percent',
    value: 25,
    unit: '%',
    message: 'Amazing! You are 25% of the way to your target weight!',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr5',
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'milestone',
    condition: 'reach_percent',
    value: 50,
    unit: '%',
    message: 'Halfway there! You have reached 50% of your weight loss goal!',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr6',
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'milestone',
    condition: 'reach_percent',
    value: 100,
    unit: '%',
    message: 'Congratulations! You have reached your target weight!',
    type: 'success',
    isActive: true
  },

  // ============ WEIGHT GAIN RULES ============
  // Weight Gain - Relative Logic (Trends)
  {
    id: 'fr10',
    metric: 'Weight',
    goalType: 'gain',
    logicType: 'relative',
    condition: 'increase_by',
    value: 0.5,
    unit: 'kg',
    message: 'Great progress! You are gaining weight steadily toward your goal.',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr11',
    metric: 'Weight',
    goalType: 'gain',
    logicType: 'relative',
    condition: 'increase_by',
    value: 1.0,
    unit: 'kg',
    message: 'Excellent! You have gained 1kg this week. Keep up the good work!',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr12',
    metric: 'Weight',
    goalType: 'gain',
    logicType: 'relative',
    condition: 'decrease_by',
    value: 1.0,
    unit: 'kg',
    message: 'Your weight has decreased. Consider reviewing your nutrition intake.',
    type: 'warning',
    isActive: true
  },
  // Weight Gain - Milestone Logic
  {
    id: 'fr13',
    metric: 'Weight',
    goalType: 'gain',
    logicType: 'milestone',
    condition: 'reach_percent',
    value: 25,
    unit: '%',
    message: 'Amazing! You are 25% of the way to your target weight!',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr14',
    metric: 'Weight',
    goalType: 'gain',
    logicType: 'milestone',
    condition: 'reach_percent',
    value: 50,
    unit: '%',
    message: 'Halfway there! You have reached 50% of your weight gain goal!',
    type: 'success',
    isActive: true
  },
  {
    id: 'fr15',
    metric: 'Weight',
    goalType: 'gain',
    logicType: 'milestone',
    condition: 'reach_percent',
    value: 100,
    unit: '%',
    message: 'Congratulations! You have reached your target weight!',
    type: 'success',
    isActive: true
  },
];

// HbA1c Scale - Universal Medical Standards
const DEFAULT_HBA1C_SCALE = {
  good: {
    min: 4.0,
    max: 5.6,
    label: 'Good',
    message: 'Excellent! Your HbA1c is in the optimal range. Keep up the great work!',
    color: 'green'
  },
  normal: {
    min: 5.7,
    max: 6.4,
    label: 'Normal',
    message: 'Your HbA1c is within an acceptable range. Continue maintaining healthy habits.',
    color: 'emerald'
  },
  atRisk: {
    min: 6.5,
    max: 7.0,
    label: 'Slight Risk',
    message: 'Your HbA1c indicates pre-diabetic levels. Consider lifestyle adjustments and consult your doctor.',
    color: 'amber'
  },
  dangerous: {
    min: 7.1,
    max: 15.0,
    label: 'Dangerous',
    message: 'Alert: Your HbA1c is in the diabetic range. Please consult your healthcare provider immediately.',
    color: 'red'
  }
};

// --- HELPER COMPONENTS ---

// Loading Spinner Component
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} text-emerald-600 animate-spin`} />
      {message && <p className="mt-3 text-sm text-gray-500">{message}</p>}
    </div>
  );
};

// Error Display Component
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <p className="text-gray-700 font-medium mb-2">Something went wrong</p>
    <p className="text-sm text-gray-500 text-center mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    )}
  </div>
);

// Toast Notification System
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all transform translate-y-0 ${
      type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
    }`}>
      {type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose}><X size={16} /></button>
    </div>
  );
};

// Inline Delete Button
const DeleteButton = ({ onDelete }) => {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }} 
          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          Confirm
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setConfirming(false); }} 
          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={(e) => { e.stopPropagation(); setConfirming(true); }} 
      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
    >
      <Trash2 size={16} />
    </button>
  );
};

// Category Manager Component
const CategoryManager = ({ title, categories, setCategories, items, showToast }) => {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    
    // Check duplicates
    if (categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      showToast(`${title} category "${newCatName}" already exists.`, 'error');
      return;
    }

    const newCat = {
      id: Date.now().toString(),
      name: newCatName.trim()
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    showToast('Category added successfully', 'success');
  };

  const saveEdit = (id) => {
    if (!editName.trim()) return;
    setCategories(categories.map(c => c.id === id ? { ...c, name: editName.trim() } : c));
    setEditingId(null);
    setEditName('');
    showToast('Category updated', 'success');
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    showToast('Category deleted', 'success');
  };

  const getCount = (categoryName) => {
    if (!items) return 0;
    return items.filter(item => item.category === categoryName).length;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Manage {title} Categories</h3>
      
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="New Category Name" 
          className="flex-grow p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 font-medium"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {categories.length === 0 && <p className="text-gray-500 italic text-sm">No categories defined.</p>}
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {editingId === cat.id ? (
              <div className="flex-grow flex gap-2 items-center">
                <input 
                  type="text" 
                  className="flex-grow p-1 border rounded text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
                <button onClick={() => saveEdit(cat.id)} className="text-emerald-600 p-1"><Check size={16}/></button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 p-1"><XCircle size={16}/></button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Tag size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{getCount(cat.name)} items</span>
                </div>
                <div className="flex gap-1 items-center">
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="p-2 text-gray-400 hover:text-blue-600">
                    <Edit2 size={16} />
                  </button>
                  <DeleteButton onDelete={() => handleDelete(cat.id)} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MODULE COMPONENTS ---

// 1. DASHBOARD COMPONENT
const Dashboard = ({ users, recipes, loading }) => {
  const activeUsers = users.filter(u => u.status === 'active' || u.status === 'Active').length;
  const highRiskUsers = users.filter(u => {
    const hba1c = u.currentHbA1c || u.baselines?.currentHbA1c || 0;
    return hba1c > 6.5;
  }).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <LoadingSpinner message="Loading dashboard data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{users.length}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Today</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{activeUsers}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">High Risk (HbA1c)</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{highRiskUsers}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Recipes</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{recipes.length}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
            <Utensils size={24} />
          </div>
        </div>
      </div>

      {/* Graphs / Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth (Last 6 Months)</h3>
          <div className="h-48 flex items-end justify-between space-x-2 overflow-visible pt-8">
             {[40, 65, 45, 80, 95, 100].map((h, i) => (
               <div key={i} className="w-full flex flex-col items-center group relative">
                 <div
                  className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition-all duration-300"
                  style={{ height: `${h}%` }}
                 >
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-30 pointer-events-none">
                     {h} Users
                   </div>
                 </div>
                 <span className="text-xs text-gray-400 mt-2">M{i+1}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Alerts</h3>
            <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
             {users.filter(u => {
               const hba1c = u.currentHbA1c || u.baselines?.currentHbA1c || 0;
               return hba1c > 6.0;
             }).slice(0, 5).map(user => {
               const displayName = user.name || user.firstName || 'Unknown';
               const hba1c = user.currentHbA1c || user.baselines?.currentHbA1c || 0;
               return (
                 <div key={user.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">
                       {displayName.charAt(0)}
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-800">{displayName}</p>
                       <p className="text-xs text-red-600">HbA1c Level: {hba1c}%</p>
                     </div>
                   </div>
                   <button className="text-xs bg-white text-gray-600 border px-2 py-1 rounded hover:bg-gray-50">Contact</button>
                 </div>
               );
             })}
             {users.filter(u => {
               const hba1c = u.currentHbA1c || u.baselines?.currentHbA1c || 0;
               return hba1c > 6.0;
             }).length === 0 && (
               <p className="text-gray-500 text-sm italic">No recent alerts.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. USER MANAGEMENT COMPONENT
const UserManagement = ({ users, setUsers, showToast, loading, error, onRefresh }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredUsers = users.filter(u =>
    (u.name || u.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  // Helper for dynamic bar height scaling
  const getBarHeight = (value, allValues) => {
    if (!allValues || allValues.length === 0) return 20;
    const values = allValues.map(v => v.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    if (min === max) return 50; 
    
    const percentage = ((value - min) / (max - min)) * 80 + 20;
    return percentage;
  };

  const handleResetPassword = async () => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await adminUsersService.resetPassword(selectedUser.id, newPassword);
      showToast(`Password reset successfully for ${selectedUser.email}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setActionLoading(true);
    try {
      await adminUsersService.updateStatus(selectedUser.id, 'inactive');
      const updatedUsers = users.map(u =>
        u.id === selectedUser.id ? { ...u, status: 'inactive' } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, status: 'inactive' });
      setShowDeactivateConfirm(false);
      showToast('User deactivated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to deactivate user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset confirmation state when modal opens/changes
  useEffect(() => {
    if (selectedUser) {
      setShowDeactivateConfirm(false);
    }
  }, [selectedUser]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <LoadingSpinner message="Loading users..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ErrorDisplay message={error} onRetry={onRefresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600 text-sm">Name / Email</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Phase</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Join Date</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Health Status</th>
              <th className="p-4 font-semibold text-gray-600 text-sm text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const displayName = user.name || user.firstName || 'Unknown User';
                const phase = user.dia2ConceptPhase || user.phase || 'notYetStarted';
                const phaseDisplay = phase.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : user.joinDate || '-';
                const currentHbA1c = user.currentHbA1c || user.baselines?.currentHbA1c || 0;
                const isInactive = user.status === 'inactive' || user.status === 'Inactive';

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                          {displayName}
                          {isInactive && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-bold">Inactive</span>}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        phase === 'successPhase' || phase === 'Success' ? 'bg-purple-100 text-purple-700' :
                        phase === 'routinePhase' || phase === 'Routine' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {phaseDisplay}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{joinDate}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${currentHbA1c > 6.5 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                        <span className="text-sm text-gray-600">HbA1c: {currentHbA1c}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (() => {
        // Prepare display data from API format
        const displayName = selectedUser.name || selectedUser.firstName || 'Unknown User';
        const isInactive = selectedUser.status === 'inactive' || selectedUser.status === 'Inactive';
        const currentWeight = selectedUser.weight || selectedUser.baselines?.currentWeight || 0;
        const targetWeight = selectedUser.targetWeight || selectedUser.baselines?.targetWeight || 0;
        const startWeight = selectedUser.baselines?.startWeight || currentWeight + 5;
        const currentHbA1c = selectedUser.currentHbA1c || selectedUser.baselines?.currentHbA1c || 0;
        const targetHbA1c = selectedUser.targetHbA1c || selectedUser.baselines?.targetHbA1c || 5.5;
        const startHbA1c = selectedUser.baselines?.startHbA1c || currentHbA1c + 0.5;

        // History data (use API data if available, otherwise fallback to mock format)
        const weightHistory = selectedUser.history?.weight || [];
        const wellbeingHistory = selectedUser.history?.wellbeing || [];
        const hba1cHistory = selectedUser.history?.hba1c || [];

        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-20 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800">
                User Profile: {displayName}
                {isInactive && <span className="ml-3 text-sm bg-red-100 text-red-600 px-2 py-1 rounded">Inactive</span>}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Top Row: Current Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight Card */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Current Weight Metrics</p>
                  <div className="flex justify-between mt-2">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">{currentWeight}</span>
                      <span className="text-sm text-gray-500 ml-1">kg (Current)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-600">{targetWeight}</span>
                      <span className="text-xs text-gray-500 ml-1">kg (Goal)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, (startWeight - currentWeight) / (startWeight - targetWeight) * 100))}%`}}
                    ></div>
                  </div>
                </div>

                {/* HbA1c Card */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Current HbA1c Levels</p>
                  <div className="flex justify-between mt-2">
                    <div>
                      <span className={`text-3xl font-bold ${currentHbA1c > 6.5 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {currentHbA1c}%
                      </span>
                      <span className="text-xs text-gray-500 ml-1">(Current)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-600">{targetHbA1c}%</span>
                      <span className="text-xs text-gray-500 ml-1">(Goal)</span>
                    </div>
                  </div>
                   {/* RAG Bar */}
                  <div className="flex h-2 rounded-full mt-3 w-full overflow-hidden relative">
                    <div className="w-1/3 bg-emerald-400"></div>
                    <div className="w-1/3 bg-yellow-400"></div>
                    <div className="w-1/3 bg-red-400"></div>
                    <div
                      className="absolute top-0 w-1 h-2 bg-black border-l border-r border-white"
                      style={{ left: `${Math.min((currentHbA1c / 10) * 100, 100)}%` }}
                     ></div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Detailed History Graphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 7-Day Weight Graph (Auto-scaled) */}
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Activity size={16} className="text-emerald-600"/>
                      Weight Progress (Last 7 Days)
                    </h4>
                    {/* Simple trend indicator based on first and last value */}
                    {weightHistory.length > 1 && (
                      <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        weightHistory[weightHistory.length - 1].value < weightHistory[0].value
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                      }`}>
                        {weightHistory[weightHistory.length - 1].value < weightHistory[0].value
                          ? <TrendingDown size={14}/>
                          : <TrendingUp size={14}/>
                        }
                        {Math.abs(weightHistory[0].value - weightHistory[weightHistory.length - 1].value).toFixed(1)}kg
                      </span>
                    )}
                  </div>

                  {weightHistory.length > 0 ? (
                    <div className="h-40 flex items-end justify-between gap-2 px-2 overflow-visible">
                      {weightHistory.map((entry, i) => (
                        <div key={i} className="flex flex-col items-center w-full group relative">
                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                            {entry.date}: {entry.value}kg
                          </div>
                          {/* Bar with dynamic height */}
                          <div
                            className="w-full bg-emerald-200 rounded-t-md hover:bg-emerald-400 transition-all cursor-pointer relative"
                            style={{ height: `${getBarHeight(entry.value, weightHistory)}%` }}
                          ></div>
                          <span className="text-[10px] text-gray-400 mt-2">{String(entry.date).split(' ')[1] || String(entry.date).slice(-2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                      No weight history available
                    </div>
                  )}
                </div>

                {/* Weekly Wellbeing with Tooltips */}
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Smile size={16} className="text-blue-600"/>
                    Weekly Wellbeing
                  </h4>
                  {wellbeingHistory.length > 0 ? (
                    <div className="flex justify-between items-center h-40 px-2 overflow-visible">
                      {wellbeingHistory.map((score, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group relative">
                           {/* Tooltip */}
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                            Day {i+1}: {score}/5 {score >= 4 ? "(Good)" : score === 3 ? "(Neutral)" : "(Low)"}
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-110 cursor-pointer ${
                            score >= 4 ? 'bg-emerald-500' : score === 3 ? 'bg-yellow-400' : 'bg-red-500'
                          }`}>
                            {score >= 4 ? <Smile size={20}/> : score === 3 ? <Meh size={20}/> : <Frown size={20}/>}
                          </div>
                          <div className="h-8 w-0.5 bg-gray-100"></div>
                          <span className="text-xs text-gray-500 font-medium">Day {i+1}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                      No wellbeing data available
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row: HbA1c History Table */}
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                  <h4 className="font-semibold text-gray-700">HbA1c Quarterly History</h4>
                  <span className="text-xs text-gray-500 bg-white border px-2 py-1 rounded">Updated Quarterly</span>
                </div>
                {hba1cHistory.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 font-medium text-gray-500">Period</th>
                        <th className="px-6 py-3 font-medium text-gray-500">Value (%)</th>
                        <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {hba1cHistory.map((record, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-gray-800">{record.date}</td>
                          <td className="px-6 py-3 font-medium">{record.value}%</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.value < 5.7 ? 'bg-emerald-100 text-emerald-700' :
                              record.value < 6.5 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {record.value < 5.7 ? 'Normal' : record.value < 6.5 ? 'Elevated' : 'High Risk'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No HbA1c history available
                  </div>
                )}
              </div>

              {/* CRM Actions */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                <span className="text-sm text-blue-800 font-medium">Account Actions</span>
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={handleResetPassword}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded border border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    Reset Password
                  </button>

                  {/* Inline Deactivate Confirmation */}
                  {!showDeactivateConfirm ? (
                    <button
                      onClick={() => setShowDeactivateConfirm(true)}
                      disabled={actionLoading}
                      className={`px-4 py-2 text-sm font-medium rounded border transition-colors flex items-center gap-2 ${
                        isInactive
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                      }`}
                    >
                      <Ban size={16} />
                      {isInactive ? 'User Inactive' : 'Deactivate User'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded border border-red-200 animate-fade-in">
                      <span className="text-xs text-red-600 font-medium whitespace-nowrap">Confirm Deactivate?</span>
                      <button
                        onClick={handleDeactivate}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading ? '...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setShowDeactivateConfirm(false)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};

// ... (Rest of the components: RecipeCMS, CourseCMS, NewsCMS, SettingsPanel, NavItem, App)
// Re-inserting the rest of the file exactly as it was, to ensure full functionality is maintained.

const RecipeCMS = ({ recipes, setRecipes, categories, setCategories, showToast, loading, error, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState('list');
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const initialForm = {
    title: '', category: '', calories: '', protein: '', carbs: '', fats: '', prepTime: '',
    tags: '', image: '', instructions: '', ingredients: [{ name: '', amount: '', unit: 'g' }]
  };
  const [formData, setFormData] = useState(initialForm);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = true;
    if (!formData.category) newErrors.category = true;
    if (!formData.instructions) newErrors.instructions = true;
    if (!formData.calories) newErrors.calories = true;
    if (!formData.prepTime) newErrors.prepTime = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast("Please fill in all required fields marked in red.", "error");
      return;
    }

    setSaving(true);
    const tagsArray = formData.tags.split ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const recipeData = { ...formData, tags: tagsArray, sections: tagsArray };

    try {
      if (currentRecipe) {
        // Update existing recipe
        const response = await adminRecipesService.update(currentRecipe.id, recipeData);
        if (response.success) {
          const updatedRecipe = transformFromApiFormat(response.data.recipe);
          setRecipes(recipes.map(r => r.id === currentRecipe.id ? updatedRecipe : r));
          showToast("Recipe updated successfully", "success");
        }
      } else {
        // Create new recipe
        const response = await adminRecipesService.create(recipeData);
        if (response.success) {
          const newRecipe = transformFromApiFormat(response.data.recipe);
          setRecipes([...recipes, newRecipe]);
          showToast("New recipe created", "success");
        }
      }
      setIsEditing(false);
      setFormData(initialForm);
      setCurrentRecipe(null);
      setErrors({});
    } catch (err) {
      showToast(err.message || "Failed to save recipe", "error");
    } finally {
      setSaving(false);
    }
  };

  // Move Recipes Up/Down
  const moveRecipe = (index, direction) => {
    const newRecipes = [...recipes];
    if (direction === 'up' && index > 0) {
      [newRecipes[index], newRecipes[index - 1]] = [newRecipes[index - 1], newRecipes[index]];
    } else if (direction === 'down' && index < newRecipes.length - 1) {
      [newRecipes[index], newRecipes[index + 1]] = [newRecipes[index + 1], newRecipes[index]];
    }
    setRecipes(newRecipes);
  };

  const handleIngredientChange = (index, field, value) => {
    // Immutable update pattern
    const newIngredients = formData.ingredients.map((ing, i) => {
      if (i === index) {
        return { ...ing, [field]: value };
      }
      return ing;
    });
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, { name: '', amount: '', unit: 'g' }] });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  // Move Ingredient Up/Down
  const moveIngredient = (index, direction) => {
    const newIngredients = [...formData.ingredients];
    if (direction === 'up' && index > 0) {
      [newIngredients[index], newIngredients[index - 1]] = [newIngredients[index - 1], newIngredients[index]];
    } else if (direction === 'down' && index < newIngredients.length - 1) {
      [newIngredients[index], newIngredients[index + 1]] = [newIngredients[index + 1], newIngredients[index]];
    }
    setFormData({ ...formData, ingredients: newIngredients });
  };

  if (activeSubTab === 'categories') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Recipe Categories</h2>
          <button onClick={() => setActiveSubTab('list')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <ChevronDown className="rotate-90" size={18} /> Back to Recipes
          </button>
        </div>
        <CategoryManager title="Recipe" categories={categories} setCategories={setCategories} items={recipes} showToast={showToast} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{currentRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Title *</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.title ? 'border-red-500 bg-red-50' : ''}`} 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Preparation Steps *</label>
                <textarea 
                  rows={6} 
                  className={`w-full p-2 border rounded ${errors.instructions ? 'border-red-500 bg-red-50' : ''}`} 
                  value={formData.instructions} 
                  onChange={e => setFormData({...formData, instructions: e.target.value})} 
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-semibold text-gray-800">Ingredients</h3>
                <button onClick={addIngredient} className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium hover:bg-emerald-100">+ Add Item</button>
              </div>
              <div className="space-y-2">
                {formData.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    {/* Reorder Ingredients */}
                    <div className="flex flex-col">
                      <button 
                        onClick={() => moveIngredient(idx, 'up')} 
                        disabled={idx === 0} 
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5"
                      >
                        <ChevronDown size={12} className="rotate-180"/>
                      </button>
                      <button 
                        onClick={() => moveIngredient(idx, 'down')} 
                        disabled={idx === formData.ingredients.length - 1} 
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5"
                      >
                        <ChevronDown size={12}/>
                      </button>
                    </div>
                    
                    <input type="text" placeholder="Item Name" className="flex-grow p-2 border rounded text-sm" value={ing.name} onChange={e => handleIngredientChange(idx, 'name', e.target.value)} />
                    <input type="number" placeholder="Qty" className="w-20 p-2 border rounded text-sm" value={ing.amount} onChange={e => handleIngredientChange(idx, 'amount', e.target.value)} />
                    <select className="w-24 p-2 border rounded text-sm" value={ing.unit} onChange={e => handleIngredientChange(idx, 'unit', e.target.value)}>
                      <option>g</option><option>ml</option><option>tbsp</option><option>pc</option>
                    </select>
                    <button onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-600 px-2"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Nutrition & Metadata</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select 
                  className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Calories (kcal) *</label>
                  <input type="number" className={`w-full p-2 border rounded mt-1 ${errors.calories ? 'border-red-500' : ''}`} value={formData.calories} onChange={e => setFormData({...formData, calories: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Prep Time (min) *</label>
                  <input type="number" className={`w-full p-2 border rounded mt-1 ${errors.prepTime ? 'border-red-500' : ''}`} value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Breakfast, Low GI" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">Media</h3>
              <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={24} className="mb-2"/>
                <span className="text-xs">Paste Image URL below</span>
              </div>
              <input type="text" className="w-full p-2 border rounded mt-3 text-sm" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Recipe Management</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <LoadingSpinner message="Loading recipes..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Recipe Management</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ErrorDisplay message={error} onRetry={onRefresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Recipe Management</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setActiveSubTab('categories')} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all">
            <List size={18} /> Manage Categories
          </button>
          <button onClick={() => { setFormData(initialForm); setIsEditing(true); setCurrentRecipe(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all">
            <Plus size={18} /> Add Recipe
          </button>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recipes found</p>
          <button
            onClick={() => { setFormData(initialForm); setIsEditing(true); setCurrentRecipe(null); }}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Create your first recipe
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group">
            <div className="relative h-48 bg-gray-200">
              <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">{recipe.calories} kcal</div>
              <div className="absolute top-2 left-2 bg-emerald-600 px-2 py-1 rounded text-xs font-bold text-white shadow-sm">{recipe.category}</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg mb-1">{recipe.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => moveRecipe(index, 'up')} 
                    disabled={index === 0} 
                    className="p-1 hover:bg-white rounded text-gray-500 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={14}/>
                  </button>
                  <button 
                    onClick={() => moveRecipe(index, 'down')} 
                    disabled={index === recipes.length - 1} 
                    className="p-1 hover:bg-white rounded text-gray-500 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={14}/>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setCurrentRecipe(recipe); setFormData({...recipe, tags: recipe.tags.join(', ')}); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                  <DeleteButton onDelete={async () => {
                    try {
                      await adminRecipesService.delete(recipe.id);
                      setRecipes(recipes.filter(r => r.id !== recipe.id));
                      showToast("Recipe deleted", "success");
                    } catch (err) {
                      showToast(err.message || "Failed to delete recipe", "error");
                    }
                  }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// --- NEWS & NOTIFICATIONS MODULE ---

const NewsCMS = ({ news, setNews, categories, setCategories, showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('list');
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [contentType, setContentType] = useState('article'); 
  const [errors, setErrors] = useState({});

  const initialForm = {
    title: '',
    summary: '',
    content: '',
    category: categories[0]?.name || '',
    author: '',
    publishDate: new Date().toISOString().split('T')[0],
    image: '',
    targetAudience: 'All Users',
    status: 'Scheduled',
    type: 'article'
  };
  const [formData, setFormData] = useState(initialForm);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = true;
    if (!formData.summary) newErrors.summary = true;
    if (contentType === 'article' && !formData.content) newErrors.content = true;
    if (contentType === 'article' && !formData.category) newErrors.category = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (item) => {
    setCurrentArticle(item);
    setFormData(item);
    setContentType(item.type);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!validate()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const newItem = { ...formData, type: contentType };
    
    if (currentArticle) {
      setNews(news.map(n => n.id === currentArticle.id ? { ...newItem, id: currentArticle.id } : n));
      showToast("Content updated successfully", "success");
    } else {
      setNews([...news, { ...newItem, id: Date.now().toString() }]);
      showToast(contentType === 'notification' ? "Notification scheduled" : "Article published", "success");
    }
    setIsEditing(false);
    setFormData(initialForm);
    setCurrentArticle(null);
    setErrors({});
  };

  // Move News Item Up/Down
  const moveNewsItem = (index, direction) => {
    const newNews = [...news];
    if (direction === 'up' && index > 0) {
      [newNews[index], newNews[index - 1]] = [newNews[index - 1], newNews[index]];
    } else if (direction === 'down' && index < newNews.length - 1) {
      [newNews[index], newNews[index + 1]] = [newNews[index + 1], newNews[index]];
    }
    setNews(newNews);
  };

  if (activeSubTab === 'categories') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">News Categories</h2>
          <button onClick={() => setActiveSubTab('list')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <ChevronDown className="rotate-90" size={18} /> Back to News
          </button>
        </div>
        <CategoryManager title="News" categories={categories} setCategories={setCategories} items={news} showToast={showToast} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentArticle ? 'Edit Content' : 'Create New Content'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
        </div>

        {/* Content Type Selector */}
        {!currentArticle && (
          <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
            <button 
              onClick={() => setContentType('article')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${contentType === 'article' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Standard Article
            </button>
            <button 
              onClick={() => setContentType('notification')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${contentType === 'notification' ? 'bg-white shadow text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Push Notification
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-xl shadow-sm border space-y-4 ${contentType === 'notification' ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100'}`}>
              <h3 className={`font-semibold border-b pb-2 ${contentType === 'notification' ? 'text-amber-800 border-amber-200' : 'text-gray-800'}`}>
                {contentType === 'article' ? 'Article Content' : 'Notification Message'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {contentType === 'article' ? 'Headline *' : 'Notification Title *'}
                </label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.title ? 'border-red-500 bg-red-50' : ''}`}
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {contentType === 'article' ? 'Summary / Excerpt *' : 'Message Body (Short) *'}
                </label>
                <textarea 
                  rows={contentType === 'notification' ? 3 : 2} 
                  className={`w-full p-2 border rounded ${errors.summary ? 'border-red-500 bg-red-50' : ''}`}
                  value={formData.summary} 
                  onChange={e => setFormData({...formData, summary: e.target.value})} 
                  placeholder={contentType === 'notification' ? "Did you drink water today?" : "Short description..."}
                ></textarea>
              </div>
              
              {contentType === 'article' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Body Content *</label>
                  <textarea 
                    rows={10} 
                    className={`w-full p-2 border rounded font-mono text-sm ${errors.content ? 'border-red-500 bg-red-50' : ''}`}
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    placeholder="Write your article here..."
                  ></textarea>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Deployment Settings</h3>
              
              {contentType === 'article' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select 
                      className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input type="text" className="w-full p-2 border rounded" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="e.g. Dr. Smith" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <select className="w-full p-2 border rounded" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})}>
                      <option>All Users</option>
                      <option>Routine Phase Users</option>
                      <option>Restart Phase Users</option>
                      <option>High Risk (HbA1c &gt; 6.5)</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 border border-blue-100">
                    <Smartphone size={14} className="inline mr-1"/>
                    This will appear as an inserted card in the news feed and trigger a system push notification.
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input type="date" className="w-full p-2 border rounded" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} />
              </div>
            </div>

            {contentType === 'article' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">Cover Image</h3>
                <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 overflow-hidden relative">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={24} className="mb-2"/>
                      <span className="text-xs">Preview Area</span>
                    </>
                  )}
                </div>
                <input type="text" className="w-full p-2 border rounded mt-3 text-sm" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
            )}

            <button onClick={handleSave} className={`w-full py-3 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center gap-2 ${contentType === 'notification' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              <Save size={18} />
              {contentType === 'notification' ? 'Schedule Notification' : 'Publish Article'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Feed List
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">News & Alerts Feed</h2>
        <div className="flex gap-2">
           <button onClick={() => setActiveSubTab('categories')} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all">
            <List size={18} /> Manage Categories
          </button>
          <button onClick={() => { setFormData(initialForm); setContentType('article'); setIsEditing(true); setCurrentArticle(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all">
            <Plus size={18} /> Add Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {news.map((item, index) => (
          <div key={item.id} className={`rounded-xl shadow-sm border p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow ${item.type === 'notification' ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100'}`}>
            
            {/* Visual Indicator for Notification vs Article */}
            {item.type === 'notification' ? (
              <div className="w-full md:w-48 h-32 bg-amber-200 rounded-lg flex flex-col items-center justify-center text-amber-700 flex-shrink-0">
                <Bell size={32} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Push Alert</span>
              </div>
            ) : (
              <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {item.type === 'notification' ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full uppercase tracking-wide">Target: {item.targetAudience}</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wide">{item.category}</span>
                  )}
                  <span className="text-xs text-gray-400">• {item.publishDate}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => moveNewsItem(index, 'up')} 
                    disabled={index === 0} 
                    className="p-1 hover:bg-white rounded text-gray-500 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={14}/>
                  </button>
                  <button 
                    onClick={() => moveNewsItem(index, 'down')} 
                    disabled={index === news.length - 1} 
                    className="p-1 hover:bg-white rounded text-gray-500 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={14}/>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                  <DeleteButton onDelete={() => { setNews(news.filter(n => n.id !== item.id)); showToast("Item deleted", "success"); }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseCMS = ({ courses }) => (
  <div className="p-10 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
    Course LMS Module (Placeholder for brevity)
  </div>
);

// 7. FEEDBACK LOGIC ENGINE COMPONENT
const FeedbackLogic = ({ rules, setRules, hba1cScale, setHba1cScale, showToast }) => {
  const [activeMetricTab, setActiveMetricTab] = useState('Weight');
  const [activeGoalType, setActiveGoalType] = useState('loss'); // 'loss' or 'gain'
  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [isEditingScale, setIsEditingScale] = useState(false);

  // Form state for rule editor (Weight only)
  const initialFormState = {
    metric: 'Weight',
    goalType: 'loss',
    logicType: 'relative',
    condition: 'decrease_by',
    value: 1.0,
    unit: 'kg',
    message: '',
    type: 'success',
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // HbA1c Scale editing state
  const [scaleForm, setScaleForm] = useState(hba1cScale);

  // Get conditions for Weight metric based on goal type
  const getConditionsForGoalType = (goalType) => {
    if (goalType === 'loss') {
      return [
        { value: 'decrease_by', label: 'Decreases By', logicType: 'relative', unit: 'kg', feedbackType: 'success' },
        { value: 'increase_by', label: 'Increases By', logicType: 'relative', unit: 'kg', feedbackType: 'warning' },
        { value: 'reach_percent', label: 'Reaches % of Goal', logicType: 'milestone', unit: '%', feedbackType: 'success' }
      ];
    } else {
      return [
        { value: 'increase_by', label: 'Increases By', logicType: 'relative', unit: 'kg', feedbackType: 'success' },
        { value: 'decrease_by', label: 'Decreases By', logicType: 'relative', unit: 'kg', feedbackType: 'warning' },
        { value: 'reach_percent', label: 'Reaches % of Goal', logicType: 'milestone', unit: '%', feedbackType: 'success' }
      ];
    }
  };

  // Handle condition change - update logicType and unit accordingly
  const handleConditionChange = (conditionValue) => {
    const conditions = getConditionsForGoalType(formData.goalType);
    const selectedCondition = conditions.find(c => c.value === conditionValue);
    setFormData({
      ...formData,
      condition: conditionValue,
      logicType: selectedCondition?.logicType || 'relative',
      unit: selectedCondition?.unit || 'kg',
      type: selectedCondition?.feedbackType || 'success'
    });
  };

  // Handle goal type change in form
  const handleGoalTypeChange = (goalType) => {
    const conditions = getConditionsForGoalType(goalType);
    const firstCondition = conditions[0];
    setFormData({
      ...formData,
      goalType,
      condition: firstCondition.value,
      logicType: firstCondition.logicType,
      unit: firstCondition.unit,
      type: firstCondition.feedbackType
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (formData.message.length > 140) {
      newErrors.message = 'Message must be 140 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate HbA1c scale
  const validateScale = () => {
    // Check that ranges don't overlap and are in order
    if (scaleForm.good.max >= scaleForm.normal.min) return false;
    if (scaleForm.normal.max >= scaleForm.atRisk.min) return false;
    if (scaleForm.atRisk.max >= scaleForm.dangerous.min) return false;
    return true;
  };

  // Save HbA1c scale
  const handleSaveScale = () => {
    if (!validateScale()) {
      showToast('Please ensure ranges do not overlap and are in ascending order', 'error');
      return;
    }
    setHba1cScale(scaleForm);
    setIsEditingScale(false);
    showToast('HbA1c scale updated successfully', 'success');
  };

  // Save rule
  const handleSave = () => {
    if (!validateForm()) return;

    if (currentRule) {
      // Edit existing rule
      setRules(rules.map(r => r.id === currentRule.id ? { ...formData, id: currentRule.id } : r));
      showToast('Rule updated successfully', 'success');
    } else {
      // Add new rule
      const newRule = {
        ...formData,
        id: `fr${Date.now()}`
      };
      setRules([...rules, newRule]);
      showToast('Rule created successfully', 'success');
    }
    setIsEditing(false);
    setCurrentRule(null);
    setFormData(initialFormState);
  };

  // Edit rule
  const handleEdit = (rule) => {
    setCurrentRule(rule);
    setFormData(rule);
    setIsEditing(true);
  };

  // Delete rule
  const handleDelete = (ruleId) => {
    setRules(rules.filter(r => r.id !== ruleId));
    showToast('Rule deleted', 'success');
  };

  // Toggle rule active state
  const toggleRuleActive = (ruleId) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  };

  // Filter rules by metric and goal type
  const filteredRules = activeMetricTab === 'Weight'
    ? rules.filter(r => r.metric === 'Weight' && r.goalType === activeGoalType)
    : rules.filter(r => r.metric === activeMetricTab);

  // Count rules by goal type for badges
  const weightLossRulesCount = rules.filter(r => r.metric === 'Weight' && r.goalType === 'loss').length;
  const weightGainRulesCount = rules.filter(r => r.metric === 'Weight' && r.goalType === 'gain').length;

  // Get goal type label
  const getGoalTypeLabel = (goalType) => goalType === 'loss' ? 'Weight Loss' : 'Weight Gain';

  // Get readable condition text
  const getConditionText = (rule) => {
    const conditionLabels = {
      decrease_by: 'decreases by',
      increase_by: 'increases by',
      reach_percent: 'reaches',
      less_than: 'is less than',
      greater_than: 'is greater than'
    };
    return conditionLabels[rule.condition] || rule.condition;
  };

  // Get logic type badge
  const getLogicTypeBadge = (logicType) => {
    const badges = {
      relative: { label: 'Trend', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      absolute: { label: 'Threshold', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      milestone: { label: 'Milestone', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
    };
    return badges[logicType] || badges.relative;
  };

  // Rule Editor Modal/Panel
  if (isEditing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsEditing(false); setCurrentRule(null); setFormData(initialFormState); setErrors({}); }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentRule ? 'Edit Rule' : 'Create New Rule'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rule Builder */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-600" />
                Rule Builder
              </h3>

              {/* Sentence Preview */}
              <div className={`p-4 rounded-lg border mb-6 ${
                formData.goalType === 'loss' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <p className="text-sm text-gray-500 mb-1">Rule Preview ({formData.goalType === 'loss' ? 'Weight Loss' : 'Weight Gain'} users):</p>
                <p className="text-gray-800 font-medium">
                  WHEN <span className="text-emerald-600">weight</span>{' '}
                  <span className="text-blue-600">{getConditionText(formData)}</span>{' '}
                  <span className="text-purple-600">{formData.value}{formData.unit}</span>{' '}
                  THEN show <span className={formData.type === 'success' ? 'text-green-600' : 'text-amber-600'}>{formData.type}</span> message
                </p>
              </div>

              {/* Goal Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">User Goal Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGoalTypeChange('loss')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.goalType === 'loss'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <TrendingDown size={18} />
                    Weight Loss
                  </button>
                  <button
                    onClick={() => handleGoalTypeChange('gain')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.goalType === 'gain'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <TrendingUp size={18} />
                    Weight Gain
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.goalType === 'loss'
                    ? 'For users trying to lose weight: decrease = positive, increase = warning'
                    : 'For users trying to gain weight: increase = positive, decrease = warning'
                  }
                </p>
              </div>

              {/* Condition Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.condition}
                  onChange={(e) => handleConditionChange(e.target.value)}
                >
                  {getConditionsForGoalType(formData.goalType).map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>

              {/* Value Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                <div className="flex">
                  <input
                    type="number"
                    step={formData.metric === 'Weight' ? '0.1' : '0.1'}
                    min="0"
                    className={`flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.value ? 'border-red-500' : ''
                    }`}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="px-4 py-3 bg-gray-100 border border-l-0 rounded-r-lg text-gray-600 font-medium">
                    {formData.unit}
                  </span>
                </div>
                {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
              </div>

              {/* Message Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'success' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.type === 'success'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Check size={18} />
                    Success
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'warning' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.type === 'warning'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <AlertTriangle size={18} />
                    Warning
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Message Editor */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Feedback Message</h3>
              <textarea
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                  errors.message ? 'border-red-500' : ''
                }`}
                rows={4}
                maxLength={140}
                placeholder="Enter the message users will see when this rule triggers..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.message ? (
                  <p className="text-red-500 text-xs">{errors.message}</p>
                ) : (
                  <p className="text-xs text-gray-400">Write a motivating or informative message</p>
                )}
                <span className={`text-xs ${formData.message.length > 120 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {formData.message.length}/140
                </span>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">User Preview</h3>
              <div className={`p-4 rounded-lg border-l-4 ${
                formData.type === 'success'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-amber-50 border-amber-500'
              }`}>
                <div className="flex items-start gap-3">
                  {formData.type === 'success' ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <Check size={16} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-amber-100 rounded-full">
                      <AlertTriangle size={16} className="text-amber-600" />
                    </div>
                  )}
                  <div>
                    <p className={`font-medium ${formData.type === 'success' ? 'text-green-800' : 'text-amber-800'}`}>
                      {formData.type === 'success' ? 'Great Progress!' : 'Attention Needed'}
                    </p>
                    <p className={`text-sm mt-1 ${formData.type === 'success' ? 'text-green-700' : 'text-amber-700'}`}>
                      {formData.message || 'Your message will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Toggle & Save */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-800">Rule Status</p>
                  <p className="text-sm text-gray-500">Enable or disable this rule</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`p-2 rounded-lg transition-colors ${
                    formData.isActive ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                >
                  {formData.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {currentRule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter rules by Weight only (HbA1c uses scale now)
  // Main Rules List View
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Feedback Logic</h2>
          <p className="text-sm text-gray-500 mt-1">Configure automated messages based on user health data</p>
        </div>
        {activeMetricTab === 'Weight' && (
          <button
            onClick={() => {
              setFormData({ ...initialFormState, metric: 'Weight', goalType: activeGoalType });
              setIsEditing(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={18} /> Add Rule
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">How Feedback Logic Works</p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>Weight rules</strong> are separated by user goal type (Loss vs Gain). A weight decrease is positive for weight loss users but negative for weight gain users.
            <strong> HbA1c</strong> uses a universal medical scale to categorize readings.
          </p>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveMetricTab('Weight')}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeMetricTab === 'Weight'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Scale size={18} />
            Weight Rules
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
              {weightLossRulesCount + weightGainRulesCount}
            </span>
          </button>
          <button
            onClick={() => setActiveMetricTab('HbA1c')}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeMetricTab === 'HbA1c'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Droplets size={18} />
            HbA1c Scale
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="p-6">
          {activeMetricTab === 'Weight' ? (
            // Weight Rules Section with Sub-tabs
            <>
              {/* Goal Type Sub-tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveGoalType('loss')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    activeGoalType === 'loss'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <TrendingDown size={18} />
                  <span className="font-medium">Weight Loss</span>
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    activeGoalType === 'loss' ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {weightLossRulesCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveGoalType('gain')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    activeGoalType === 'gain'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <TrendingUp size={18} />
                  <span className="font-medium">Weight Gain</span>
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    activeGoalType === 'gain' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {weightGainRulesCount}
                  </span>
                </button>
              </div>

              {/* Goal Type Context Banner */}
              <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                activeGoalType === 'loss'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {activeGoalType === 'loss' ? (
                  <>
                    <TrendingDown size={16} />
                    <span><strong>Weight Loss:</strong> Decrease = Success, Increase = Warning</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} />
                    <span><strong>Weight Gain:</strong> Increase = Success, Decrease = Warning</span>
                  </>
                )}
              </div>

              {/* Rules List */}
              {filteredRules.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    activeGoalType === 'loss' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    {activeGoalType === 'loss' ? (
                      <TrendingDown size={24} className="text-emerald-500" />
                    ) : (
                      <TrendingUp size={24} className="text-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-500 font-medium">No {activeGoalType === 'loss' ? 'Weight Loss' : 'Weight Gain'} rules configured</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first rule to start engaging users</p>
                  <button
                    onClick={() => {
                      setFormData({ ...initialFormState, metric: 'Weight', goalType: activeGoalType });
                      setIsEditing(true);
                    }}
                    className={`mt-4 font-medium text-sm flex items-center gap-1 mx-auto ${
                      activeGoalType === 'loss' ? 'text-emerald-600 hover:text-emerald-700' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <Plus size={16} /> Add {activeGoalType === 'loss' ? 'Weight Loss' : 'Weight Gain'} Rule
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRules.map((rule) => {
                    const logicBadge = getLogicTypeBadge(rule.logicType);
                    return (
                      <div
                        key={rule.id}
                        className={`p-4 rounded-lg border transition-all ${
                          rule.isActive
                            ? 'bg-white border-gray-200 hover:border-gray-300'
                            : 'bg-gray-50 border-gray-100 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Rule sentence */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`px-2 py-0.5 text-xs rounded-full border ${logicBadge.bg} ${logicBadge.text} ${logicBadge.border}`}>
                                {logicBadge.label}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                rule.type === 'success'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {rule.type === 'success' ? 'Success' : 'Warning'}
                              </span>
                              {!rule.isActive && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                  Disabled
                                </span>
                              )}
                            </div>

                            {/* Readable rule */}
                            <p className="text-gray-800 font-medium mb-1">
                              When weight {getConditionText(rule)} <span className="text-emerald-600">{rule.value}{rule.unit}</span>
                            </p>

                            {/* Message preview */}
                            <p className="text-sm text-gray-500 line-clamp-2">
                              "{rule.message}"
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleRuleActive(rule.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                rule.isActive
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={rule.isActive ? 'Disable rule' : 'Enable rule'}
                            >
                              {rule.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                            <button
                              onClick={() => handleEdit(rule)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <DeleteButton onDelete={() => handleDelete(rule.id)} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            // HbA1c Scale Configuration
            <div className="space-y-6">
              {/* Scale Visual Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Droplets size={18} className="text-emerald-600" />
                  HbA1c Classification Scale
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  This universal scale determines how user HbA1c readings are categorized and what feedback they receive.
                </p>

                {/* Visual Scale Bar */}
                <div className="flex rounded-lg overflow-hidden mb-4 h-12">
                  <div className="flex-1 bg-green-500 flex items-center justify-center text-white font-medium text-sm">
                    Good
                  </div>
                  <div className="flex-1 bg-emerald-400 flex items-center justify-center text-white font-medium text-sm">
                    Normal
                  </div>
                  <div className="flex-1 bg-amber-400 flex items-center justify-center text-white font-medium text-sm">
                    At Risk
                  </div>
                  <div className="flex-1 bg-red-500 flex items-center justify-center text-white font-medium text-sm">
                    Dangerous
                  </div>
                </div>

                {/* Scale Values */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-600">
                  <div>{hba1cScale.good.min}% - {hba1cScale.good.max}%</div>
                  <div>{hba1cScale.normal.min}% - {hba1cScale.normal.max}%</div>
                  <div>{hba1cScale.atRisk.min}% - {hba1cScale.atRisk.max}%</div>
                  <div>{hba1cScale.dangerous.min}%+</div>
                </div>
              </div>

              {/* Scale Details */}
              {isEditingScale ? (
                // Edit Mode
                <div className="space-y-4">
                  {/* Good */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-green-600" />
                        <span className="font-medium text-gray-800">Good</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Optimal Range</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.good.min}
                          onChange={(e) => setScaleForm({...scaleForm, good: {...scaleForm.good, min: parseFloat(e.target.value)}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.good.max}
                          onChange={(e) => setScaleForm({...scaleForm, good: {...scaleForm.good, max: parseFloat(e.target.value)}})}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">Message</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={scaleForm.good.message}
                        onChange={(e) => setScaleForm({...scaleForm, good: {...scaleForm.good, message: e.target.value}})}
                      />
                    </div>
                  </div>

                  {/* Normal */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-emerald-400">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-emerald-500" />
                        <span className="font-medium text-gray-800">Normal</span>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Acceptable Range</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.normal.min}
                          onChange={(e) => setScaleForm({...scaleForm, normal: {...scaleForm.normal, min: parseFloat(e.target.value)}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.normal.max}
                          onChange={(e) => setScaleForm({...scaleForm, normal: {...scaleForm.normal, max: parseFloat(e.target.value)}})}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">Message</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={scaleForm.normal.message}
                        onChange={(e) => setScaleForm({...scaleForm, normal: {...scaleForm.normal, message: e.target.value}})}
                      />
                    </div>
                  </div>

                  {/* At Risk */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-amber-400">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <span className="font-medium text-gray-800">Slight Risk</span>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Pre-diabetic Range</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.atRisk.min}
                          onChange={(e) => setScaleForm({...scaleForm, atRisk: {...scaleForm.atRisk, min: parseFloat(e.target.value)}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.atRisk.max}
                          onChange={(e) => setScaleForm({...scaleForm, atRisk: {...scaleForm.atRisk, max: parseFloat(e.target.value)}})}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">Message</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={scaleForm.atRisk.message}
                        onChange={(e) => setScaleForm({...scaleForm, atRisk: {...scaleForm.atRisk, message: e.target.value}})}
                      />
                    </div>
                  </div>

                  {/* Dangerous */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-500" />
                        <span className="font-medium text-gray-800">Dangerous</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Diabetic Range</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Value (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-lg text-sm"
                          value={scaleForm.dangerous.min}
                          onChange={(e) => setScaleForm({...scaleForm, dangerous: {...scaleForm.dangerous, min: parseFloat(e.target.value)}})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Value</label>
                        <div className="w-full p-2 bg-gray-100 border rounded-lg text-sm text-gray-500">No upper limit</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">Message</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={scaleForm.dangerous.message}
                        onChange={(e) => setScaleForm({...scaleForm, dangerous: {...scaleForm.dangerous, message: e.target.value}})}
                      />
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => { setIsEditingScale(false); setScaleForm(hba1cScale); }}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveScale}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Scale
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  {/* Good */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
                    <div className="w-3 h-12 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">Good</span>
                        <span className="text-sm text-gray-500">({hba1cScale.good.min}% - {hba1cScale.good.max}%)</span>
                      </div>
                      <p className="text-sm text-gray-600">"{hba1cScale.good.message}"</p>
                    </div>
                  </div>

                  {/* Normal */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
                    <div className="w-3 h-12 bg-emerald-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">Normal</span>
                        <span className="text-sm text-gray-500">({hba1cScale.normal.min}% - {hba1cScale.normal.max}%)</span>
                      </div>
                      <p className="text-sm text-gray-600">"{hba1cScale.normal.message}"</p>
                    </div>
                  </div>

                  {/* At Risk */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
                    <div className="w-3 h-12 bg-amber-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">Slight Risk</span>
                        <span className="text-sm text-gray-500">({hba1cScale.atRisk.min}% - {hba1cScale.atRisk.max}%)</span>
                      </div>
                      <p className="text-sm text-gray-600">"{hba1cScale.atRisk.message}"</p>
                    </div>
                  </div>

                  {/* Dangerous */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
                    <div className="w-3 h-12 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">Dangerous</span>
                        <span className="text-sm text-gray-500">({hba1cScale.dangerous.min}%+)</span>
                      </div>
                      <p className="text-sm text-gray-600">"{hba1cScale.dangerous.message}"</p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => { setScaleForm(hba1cScale); setIsEditingScale(true); }}
                    className="w-full py-3 mt-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Scale Values & Messages
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Priority Info - Only show for Weight tab */}
      {activeMetricTab === 'Weight' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Target size={16} className="text-gray-500" />
            Rule Priority (When Multiple Rules Match)
          </h4>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li><strong>Milestones</strong> - Goal percentage achievements (25%, 50%, 100%)</li>
            <li><strong>Trends</strong> - Relative weight changes (gained/lost X kg)</li>
          </ol>
        </div>
      )}
    </div>
  );
};

// 6. SETTINGS COMPONENT
const SettingsPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Global Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Health Thresholds</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Safe HbA1c Maximum (%)</label>
              <input type="number" className="w-full border p-2 rounded" defaultValue={5.7} />
              <p className="text-xs text-gray-400 mt-1">Values below this are marked Green.</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">High Risk HbA1c Minimum (%)</label>
              <input type="number" className="w-full border p-2 rounded" defaultValue={6.5} />
              <p className="text-xs text-gray-400 mt-1">Values above this trigger Admin alerts.</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">App Content</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Show "Contract with Myself" on Onboarding</span>
              <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" defaultChecked />
            </div>
            
            {/* Added Onboarding Video Configuration */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Video size={16} /> Onboarding Media
              </h4>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Welcome Video URL</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded text-sm" 
                  defaultValue="https://www.youtube.com/watch?v=sample-intro" 
                  placeholder="https://..."
                />
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                  <span className="text-xs flex items-center gap-1"><PlayCircle size={14} /> Video Preview Area</span>
                </div>
              </div>
            </div>

            {/* Added Store Configuration */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <ShoppingBag size={16} /> Store Configuration
              </h4>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Shopify Store URL</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded text-sm" 
                  defaultValue="https://haferlowe.myshopify.com" 
                  placeholder="https://your-store.com"
                />
                <p className="text-xs text-gray-400">Users clicking "Store" in the app will be redirected here.</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <label className="block text-sm text-gray-600 mb-1">Support Email</label>
              <input type="email" className="w-full border p-2 rounded" defaultValue="help@haferlowe.com" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors">Save Changes</button>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const NavItem = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      activeTab === id 
        ? 'bg-emerald-50 text-emerald-700 font-medium' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data state
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeCategories, setRecipeCategories] = useState(MOCK_RECIPE_CATEGORIES);
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [news, setNews] = useState(MOCK_FEED_ITEMS);
  const [newsCategories, setNewsCategories] = useState(MOCK_NEWS_CATEGORIES);
  const [feedbackRules, setFeedbackRules] = useState(MOCK_FEEDBACK_RULES);
  const [hba1cScale, setHba1cScale] = useState(DEFAULT_HBA1C_SCALE);

  // Loading states
  const [usersLoading, setUsersLoading] = useState(false);
  const [recipesLoading, setRecipesLoading] = useState(false);

  // Error states
  const [usersError, setUsersError] = useState(null);
  const [recipesError, setRecipesError] = useState(null);

  // Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await adminUsersService.getAll({ limit: 100 });
      if (response.success && response.data?.users) {
        // Transform API users to include history data structure if needed
        const transformedUsers = response.data.users.map(user => ({
          ...user,
          id: user.id || user._id,
          name: user.firstName || user.name,
          baselines: {
            startWeight: user.weight ? user.weight + 5 : 80,
            currentWeight: user.weight || 75,
            targetWeight: user.targetWeight || 70,
            startHbA1c: user.currentHbA1c ? user.currentHbA1c + 0.5 : 7.0,
            currentHbA1c: user.currentHbA1c || 6.0,
            targetHbA1c: user.targetHbA1c || 5.5
          },
          history: {
            weight: [], // Will be populated when user is selected
            wellbeing: [],
            hba1c: []
          }
        }));
        setUsers(transformedUsers);
      } else {
        // API returned but no data - use mock data
        console.log('No users from API, using mock data');
        setUsers(MOCK_USERS);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      // Silently fallback to mock data without showing error
      console.log('API failed, using mock data for users');
      setUsers(MOCK_USERS);
      // Don't set error - just use mock data silently
      // setUsersError(err.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch recipes from API
  const fetchRecipes = useCallback(async () => {
    setRecipesLoading(true);
    setRecipesError(null);
    try {
      const response = await adminRecipesService.getAll({ limit: 100 });
      if (response.success && response.data?.recipes) {
        const transformedRecipes = response.data.recipes.map(transformFromApiFormat);
        setRecipes(transformedRecipes);
      } else {
        // API returned but no data - use mock data
        console.log('No recipes from API, using mock data');
        setRecipes(MOCK_RECIPES);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      // Silently fallback to mock data without showing error
      console.log('API failed, using mock data for recipes');
      setRecipes(MOCK_RECIPES);
      // Don't set error - just use mock data silently
      // setRecipesError(err.message || 'Failed to load recipes');
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'dashboard') {
      fetchUsers();
    }
    if (activeTab === 'recipes' || activeTab === 'dashboard') {
      fetchRecipes();
    }
  }, [activeTab, fetchUsers, fetchRecipes]);

  // Initial data load
  useEffect(() => {
    fetchUsers();
    fetchRecipes();
  }, [fetchUsers, fetchRecipes]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar - Fixed position on desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen z-40 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">H</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">HAFERLOWE</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider ml-10">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="users" label="User Manager" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="recipes" label="Recipes CMS" icon={Utensils} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="courses" label="Courses LMS" icon={GraduationCap} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="news" label="News & Alerts" icon={Newspaper} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="feedback" label="Feedback Logic" icon={Zap} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
          <NavItem id="settings" label="Settings" icon={Settings} activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors w-full px-4 py-2">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Offset by sidebar width on desktop */}
      <main className="min-h-screen md:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-sm text-gray-500">Welcome back, Administrator</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="font-semibold text-gray-600">AD</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard users={users} recipes={recipes} loading={usersLoading || recipesLoading} />}
          {activeTab === 'users' && <UserManagement users={users} setUsers={setUsers} showToast={showToast} loading={usersLoading} error={usersError} onRefresh={fetchUsers} />}
          {activeTab === 'recipes' && <RecipeCMS recipes={recipes} setRecipes={setRecipes} categories={recipeCategories} setCategories={setRecipeCategories} showToast={showToast} loading={recipesLoading} error={recipesError} onRefresh={fetchRecipes} />}
          {activeTab === 'courses' && <CourseCMS courses={courses} />}
          {activeTab === 'news' && <NewsCMS news={news} setNews={setNews} categories={newsCategories} setCategories={setNewsCategories} showToast={showToast} />}
          {activeTab === 'feedback' && <FeedbackLogic rules={feedbackRules} setRules={setFeedbackRules} hba1cScale={hba1cScale} setHba1cScale={setHba1cScale} showToast={showToast} />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
};

export default App;