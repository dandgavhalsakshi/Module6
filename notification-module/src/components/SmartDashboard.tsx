import { useState, useEffect, useRef } from 'react';
import { Bell, Filter, X, Check, AlertCircle, Info, AlertTriangle, ChevronUp, ChevronDown, Moon, Sun, Loader } from 'lucide-react';

// Define alert type interface
interface Alert {
  id: number;
  message: string;
  type: string;
  read: boolean;
  timestamp: number;
}

// Define item type interface
interface Item {
  id: number;
  title: string;
  category: string;
  priority: string;
  date: string;
}

// Importing custom fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
  
  /* Animation keyframes */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(30px); opacity: 0; }
  }
  
  @keyframes bellRing {
    0% { transform: rotate(0); }
    15% { transform: rotate(15deg); }
    30% { transform: rotate(-15deg); }
    45% { transform: rotate(10deg); }
    60% { transform: rotate(-10deg); }
    75% { transform: rotate(5deg); }
    85% { transform: rotate(-5deg); }
    100% { transform: rotate(0); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 100% 0; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes highlight {
    0% { background-color: rgba(255, 255, 255, 0); }
    50% { background-color: rgba(255, 255, 255, 0.2); }
    100% { background-color: rgba(255, 255, 255, 0); }
  }
`;

// Animation utility styles
const animationStyles = `
  .bell-ring {
    animation: bellRing 1s ease-in-out;
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .fade-out {
    animation: fadeOut 0.3s ease-out forwards;
  }
  
  .scale-in {
    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  .slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
  
  .slide-out-right {
    animation: slideOutRight 0.3s ease-out forwards;
  }
  
  .pulse {
    animation: pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .highlight {
    animation: highlight 1s ease-out;
  }
  
  .shimmer {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.15) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  /* Interactive hover effects */
  .hover-lift {
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  }
  
  .hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  }
  
  .button-click {
    transition: transform 0.1s ease-out;
  }
  
  .button-click:active {
    transform: scale(0.97);
  }
  
  /* Transition effects */
  .theme-transition {
    transition: background-color 0.5s ease-out, color 0.5s ease-out, border-color 0.5s ease-out, box-shadow 0.5s ease-out;
  }
`;

export default function SmartDashboard() {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState<number | null>(null);
  
  // Animation states
  const [themeChanging, setThemeChanging] = useState(false);
  const [filterHighlight, setFilterHighlight] = useState(false);
  const [bellAnimating, setBellAnimating] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);
  const [notificationHighlight, setNotificationHighlight] = useState<number | null>(null);
  const [expandAnimation, setExpandAnimation] = useState(false);
  
  // Add refs for animation targets
  const mainContentRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const newItemRef = useRef<HTMLDivElement>(null);
  
  // Sample data for the dashboard items
  const [items, setItems] = useState<Item[]>([
    { id: 1, title: 'Sales Report', category: 'reports', priority: 'high', date: '2025-04-10' },
    { id: 2, title: 'User Feedback', category: 'customer', priority: 'medium', date: '2025-04-11' },
    { id: 3, title: 'System Update', category: 'technical', priority: 'high', date: '2025-04-12' },
    { id: 4, title: 'Marketing Campaign', category: 'marketing', priority: 'low', date: '2025-04-09' },
    { id: 5, title: 'New Feature Request', category: 'product', priority: 'medium', date: '2025-04-08' },
    { id: 6, title: 'Budget Review', category: 'finance', priority: 'high', date: '2025-04-07' },
  ]);

  // Alert type definition
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, message: 'System update required', type: 'warning', read: false, timestamp: new Date().getTime() - 3600000 },
    { id: 2, message: 'New high priority task assigned', type: 'info', read: false, timestamp: new Date().getTime() - 7200000 },
    { id: 3, message: 'Sales target achieved', type: 'success', read: true, timestamp: new Date().getTime() - 86400000 },
  ]);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Alert panel visibility and animation state
  const [showAlerts, setShowAlerts] = useState(false);
  const [notificationPanelClosing, setNotificationPanelClosing] = useState(false);
  
  // Toast notification state - updated to use Alert type or null
  const [toast, setToast] = useState<Alert | null>(null);
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.read).length;

  // Filtered items based on selected filters and search term
  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  // Format relative time for alerts
  const formatRelativeTime = (timestamp: number) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  // Mark alert as read with animation
  const markAsRead = (id: number) => {
    setNotificationHighlight(id);
    setTimeout(() => {
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      ));
      setNotificationHighlight(null);
    }, 300);
  };

  // Dismiss/remove alert with animation
  const dismissAlert = (id: number) => {
    setNotificationHighlight(id);
    setTimeout(() => {
      setAlerts(alerts.filter(alert => alert.id !== id));
      setNotificationHighlight(null);
    }, 300);
  };

  // Mark all alerts as read with animation
  const markAllAsRead = () => {
    // Highlight all unread notifications briefly
    const unreadIds = alerts.filter(alert => !alert.read).map(alert => alert.id);
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, highlighted: !alert.read }))
    );
    
    // Then mark them as read
    setTimeout(() => {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => ({ ...alert, read: true, highlighted: false }))
      );
    }, 300);
  };

  // Clear all alerts with animation
  const clearAllAlerts = () => {
    // Highlight all alerts briefly
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, highlighted: true }))
    );
    
    // Then remove them
    setTimeout(() => {
      setAlerts([]);
    }, 300);
  };

  // Show toast notification with animation
  const showToastNotification = (alert: Alert) => {
    setToastExiting(false);
    setToast(alert);
    
    // Auto dismiss toast after delay
    const timer = setTimeout(() => {
      dismissToast();
    }, 4000);
    
    return () => clearTimeout(timer);
  };
  
  // Dismiss toast with animation
  const dismissToast = () => {
    setToastExiting(true);
    setTimeout(() => {
      setToast(null);
      setToastExiting(false);
    }, 300);
  };

  // Simulate loading data
  const simulateLoading = (callback: Function) => {
    setIsLoading(true);
    setTimeout(() => {
      callback();
      setIsLoading(false);
    }, 800);
  };

  // Sample function to simulate receiving a new alert
  const addRandomAlert = () => {
    // Start bell animation
    setBellAnimating(true);
    
    // Simulate loading
    simulateLoading(() => {
      const types = ['info', 'success', 'warning', 'error'];
      const messages = [
        'New user registration',
        'System performance issue detected',
        'Weekly report is ready',
        'Payment received',
        'Server maintenance scheduled'
      ];
      
      const newAlert: Alert = {
        id: Date.now(),
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)],
        read: false,
        timestamp: new Date().getTime()
      };
      
      // Add with animation
      setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
      
      // Show toast notification
      showToastNotification(newAlert);
    });
  };
  
  // Add new item with animation
  const addRandomItem = () => {
    setLoadingItem(0); // 0 represents new item being added
    
    simulateLoading(() => {
      const categories = ['reports', 'customer', 'technical', 'marketing', 'product', 'finance'];
      const priorities = ['high', 'medium', 'low'];
      const titles = [
        'Monthly Analytics', 
        'Customer Survey Results', 
        'Infrastructure Update', 
        'Social Media Strategy', 
        'UI/UX Improvements',
        'Q2 Budget Report'
      ];
      
      const newItem: Item = {
        id: Date.now(),
        title: titles[Math.floor(Math.random() * titles.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        date: new Date().toISOString().split('T')[0]
      };
      
      // Add item with animation
      setItems(prevItems => [newItem, ...prevItems]);
      setLoadingItem(null);
      
      // Highlight the new item section
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
      
      // Show success toast
      showToastNotification({
        id: Date.now(),
        message: `New item added: ${newItem.title}`,
        type: 'success',
        read: false,
        timestamp: new Date().getTime()
      });
    });
  };

  // Bell animation effect
  useEffect(() => {
    if (bellAnimating) {
      const timeout = setTimeout(() => {
        setBellAnimating(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [bellAnimating]);
  
  // Theme change animation
  useEffect(() => {
    setThemeChanging(true);
    const timeout = setTimeout(() => {
      setThemeChanging(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [darkMode]);
  
  // Filter highlight animation
  useEffect(() => {
    if (categoryFilter !== 'all' || priorityFilter !== 'all' || searchTerm !== '') {
      setFilterHighlight(true);
      const timeout = setTimeout(() => {
        setFilterHighlight(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [categoryFilter, priorityFilter, searchTerm]);
  
  // Filter expansion animation
  useEffect(() => {
    setExpandAnimation(true);
    const timeout = setTimeout(() => {
      setExpandAnimation(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [isFilterExpanded]);

  // Toggle notification panel with click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('notification-panel');
      const bell = document.getElementById('notification-bell');
      
      if (showAlerts && panel && !panel.contains(event.target as Node) && event.target !== bell) {
        closeNotificationPanel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAlerts]);
  
  // Function to close notification panel with animation
  const closeNotificationPanel = () => {
    setNotificationPanelClosing(true);
    setTimeout(() => {
      setShowAlerts(false);
      setNotificationPanelClosing(false);
    }, 300);
  };
  
  // Function to toggle notification panel with animation
  const toggleNotificationPanel = () => {
    if (showAlerts) {
      closeNotificationPanel();
    } else {
      setShowAlerts(true);
    }
  };

  // Updated theme colors based on provided palettes
  const theme = {
    light: {
      base: '#F4EBDC', // Light Cream
      primary: '#005F73', // Deep Teal
      secondary: '#9C6644', // Warm Chestnut
      accent: '#F4A261', // Warm Sunset Orange
      text: '#283953', // Charcoal Blue
      textLight: '#8E7B6D', // Mink Gray
      cardBg: '#FFFFFF',
      priorityHigh: '#E63946', // Muted Red
      priorityMedium: '#F4A261', // Warm Sunset Orange
      priorityLow: '#005F73', // Deep Teal
      successBg: '#E9F7EF',
      successText: '#2A9D8F',
      infoBg: '#E6F3F8',
      infoText: '#005F73', // Deep Teal
      warningBg: '#FCF3CF',
      warningText: '#D4A373', // Golden Beige
      errorBg: '#FADBD8',
      errorText: '#E63946', // Muted Red
      border: '#D8C3A5' // Warm Sand
    },
    dark: {
      base: '#283953', // Charcoal Blue
      primary: '#F77F00', // Vibrant Orange
      secondary: '#8D6A9F', // Muted Purple
      accent: '#FCBF49', // Golden Yellow
      text: '#F4EBDC', // Light Cream
      textLight: '#B0BEC5', // Soft Silver Gray
      cardBg: '#3B4F71', // Steel Blue
      priorityHigh: '#D62828', // Deep Red
      priorityMedium: '#FCBF49', // Golden Yellow
      priorityLow: '#7289A4', // Muted Blue Gray
      successBg: '#1C352D',
      successText: '#2A9D8F',
      infoBg: '#1C2836',
      infoText: '#7289A4', // Muted Blue Gray
      warningBg: '#352F1A',
      warningText: '#FCBF49', // Golden Yellow
      errorBg: '#351A23',
      errorText: '#D62828', // Deep Red
      border: '#7289A4' // Muted Blue Gray
    }
  };

  // Current theme
  const currentTheme = darkMode ? theme.dark : theme.light;

  // Toggle theme with animation
  const toggleTheme = () => {
    setThemeChanging(true);
    setDarkMode(!darkMode);
  };

  return (
    <div 
      className={`flex flex-col h-screen theme-transition ${themeChanging ? 'theme-changing' : ''}`} 
      style={{
        backgroundColor: currentTheme.base,
        color: currentTheme.text,
        fontFamily: "'Open Sans', sans-serif", // Body font
      }}
    >
      {/* Inject font and animation styles */}
      <style dangerouslySetInnerHTML={{ __html: fontStyles + animationStyles }} />
      
      {/* Header */}
      <header 
        className="shadow-sm py-4 px-6 sticky top-0 z-10 theme-transition"
        style={{
          backgroundColor: darkMode ? currentTheme.cardBg : 'white',
          fontFamily: "'Lexend', sans-serif", // Header font
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold" 
              style={{ 
                color: currentTheme.text,
                fontFamily: "'Space Grotesk', sans-serif" // Title font
              }}
            >
              Smart Alert System
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Add item button */}
            <button
              onClick={addRandomItem}
              disabled={isLoading || loadingItem !== null}
              className="p-2 rounded-full button-click"
              style={{
                backgroundColor: darkMode ? 'rgba(247, 127, 0, 0.1)' : 'rgba(0, 95, 115, 0.1)',
                color: currentTheme.primary
              }}
            >
              {loadingItem === 0 ? (
                <Loader size={20} className="spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
            
            {/* Theme toggle with animation */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full flex items-center justify-center button-click"
              style={{
                backgroundColor: darkMode ? 'rgba(247, 127, 0, 0.1)' : 'rgba(0, 95, 115, 0.1)',
                color: currentTheme.primary,
                transition: 'transform 0.5s ease-out'
              }}
            >
              {darkMode ? (
                <Sun size={20} className={themeChanging ? 'spin' : ''} />
              ) : (
                <Moon size={20} className={themeChanging ? 'spin' : ''} />
              )}
            </button>
            
            {/* Alert button with notification badge and animation */}
            <div className="relative">
              <button 
                id="notification-bell"
                ref={bellRef}
                onClick={toggleNotificationPanel}
                className="p-2 rounded-full relative button-click"
                style={{
                  backgroundColor: unreadCount > 0 ? 
                    (darkMode ? 'rgba(247, 127, 0, 0.1)' : 'rgba(0, 95, 115, 0.1)') : 
                    'transparent',
                  color: unreadCount > 0 ? currentTheme.primary : currentTheme.textLight
                }}
              >
                <Bell 
                  size={22} 
                  className={bellAnimating ? 'bell-ring' : ''} 
                />
                {unreadCount > 0 && (
                  <span 
                    className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${unreadCount > 0 && bellAnimating ? 'pulse' : ''}`}
                    style={{ 
                      backgroundColor: darkMode ? '#D62828' : '#E63946',
                      fontFamily: "'Poppins', sans-serif" // Numeric badge font
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Alert panel with animations */}
              {showAlerts && (
                <div 
                  id="notification-panel"
                  className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-10 overflow-hidden ${notificationPanelClosing ? 'slide-out-right' : 'slide-in-right'}`}
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    border: `1px solid ${currentTheme.border}`,
                    fontFamily: "'Nunito', sans-serif" // Subtitle/supporting text font
                  }}
                >
                  <div 
                    className="flex justify-between items-center p-3 border-b theme-transition" 
                    style={{
                      borderColor: currentTheme.border,
                      backgroundColor: darkMode ? 'rgba(114, 137, 164, 0.2)' : 'rgba(216, 195, 165, 0.2)'
                    }}
                  >
                    <h3 
                      className="font-medium flex items-center" 
                      style={{ 
                        color: currentTheme.text,
                        fontFamily: "'Poppins', sans-serif" // Subheading font
                      }}
                    >
                      <Bell size={16} className="mr-2" style={{ color: currentTheme.primary }} />
                      Notifications
                    </h3>
                    <div className="flex space-x-2">
                      {alerts.length > 0 && (
                        <>
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs button-click"
                            style={{ color: currentTheme.primary }}
                          >
                            Mark all read
                          </button>
                          <button 
                            onClick={clearAllAlerts}
                            className="text-xs button-click"
                            style={{ color: darkMode ? '#D62828' : '#E63946' }}
                          >
                            Clear all
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div 
                        className="p-6 text-center flex flex-col items-center fade-in"
                        style={{ color: currentTheme.textLight }}
                      >
                        <Bell size={24} className="mb-2" style={{ color: currentTheme.border }} />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      alerts.map((alert, index) => {
                        // Determine alert colors based on type and theme
                        let bgColor, textColor;
                        
                        if (alert.type === 'info') {
                          bgColor = !alert.read ? currentTheme.infoBg : 'transparent';
                          textColor = currentTheme.infoText;
                        } else if (alert.type === 'success') {
                          bgColor = !alert.read ? currentTheme.successBg : 'transparent';
                          textColor = currentTheme.successText;
                        } else if (alert.type === 'warning') {
                          bgColor = !alert.read ? currentTheme.warningBg : 'transparent';
                          textColor = currentTheme.warningText;
                        } else if (alert.type === 'error') {
                          bgColor = !alert.read ? currentTheme.errorBg : 'transparent';
                          textColor = currentTheme.errorText;
                        }
                        
                        // Calculate fade-in delay based on index
                        const animationDelay = index * 50;
                        
                        return (
                          <div 
                            key={alert.id}
                            className={`p-3 border-b flex items-start fade-in hover-lift`}
                            style={{
                              backgroundColor: notificationHighlight === alert.id ? 
                                (darkMode ? '#351A23' : '#FADBD8') : 
                                bgColor,
                              borderColor: currentTheme.border,
                              animationDelay: `${animationDelay}ms`
                            }}
                          >
                            {/* Alert icon based on type */}
                            <div className="mr-3 mt-1">
                              {alert.type === 'info' && <Info size={16} style={{ color: textColor }} />}
                              {alert.type === 'success' && <Check size={16} style={{ color: textColor }} />}
                              {alert.type === 'warning' && <AlertTriangle size={16} style={{ color: textColor }} />}
                              {alert.type === 'error' && <AlertCircle size={16} style={{ color: textColor }} />}
                            </div>
                            
                            {/* Alert content */}
                            <div className="flex-grow">
                              <p className="text-sm" style={{ color: currentTheme.text }}>
                                {alert.message}
                              </p>
                              <p className="text-xs mt-1" style={{ 
                                color: currentTheme.textLight,
                                fontFamily: "'Source Sans Pro', sans-serif" // Caption font
                              }}>
                                {formatRelativeTime(alert.timestamp)}
                              </p>
                            </div>
                            
                            {/* Alert actions */}
                            <div className="flex space-x-1">
                              {!alert.read && (
                                <button 
                                  onClick={() => markAsRead(alert.id)}
                                  className="p-1 button-click"
                                  title="Mark as read"
                                  style={{ color: currentTheme.textLight }}
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              <button 
                                onClick={() => dismissAlert(alert.id)}
                                className="p-1 button-click"
                                title="Dismiss"
                                style={{ color: currentTheme.textLight }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Add test alert button */}
                  <div className="p-3 border-t theme-transition" style={{ borderColor: currentTheme.border }}>
                    <button 
                      onClick={addRandomAlert}
                      disabled={isLoading}
                      className="w-full py-2 px-3 text-sm rounded flex items-center justify-center button-click"
                      style={{ 
                        backgroundColor: darkMode ? 'rgba(247, 127, 0, 0.1)' : 'rgba(0, 95, 115, 0.1)',
                        color: currentTheme.primary
                      }}
                    >
                      {isLoading ? (
                        <Loader size={14} className="spin mr-2" />
                      ) : (
                        <Bell size={14} className="mr-2" />
                      )}
                      Simulate New Alert
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main 
        ref={mainContentRef}
        className="flex-grow p-6 overflow-auto theme-transition" 
      >
        {/* Filters */}
        <div 
          className={`p-4 rounded-lg shadow-sm mb-6 hover-lift ${filterHighlight ? 'highlight' : ''}`}
          style={{
            backgroundColor: currentTheme.cardBg,
            boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Nunito', sans-serif" // Subtitle font for filter box
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Filter size={18} className="mr-2" style={{ color: currentTheme.textLight }} />
              <span className="text-sm font-medium" style={{ 
                color: currentTheme.text,
                fontFamily: "'Poppins', sans-serif" // Section headers font
              }}>
                Filters
              </span>
            </div>
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="button-click"
              style={{ color: currentTheme.textLight }}
            >
              {isFilterExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          {/* Search always visible with micro-interaction */}
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 pl-8 border rounded-md text-sm focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: darkMode ? '#3B4F71' : 'white',
                  borderColor: searchTerm ? currentTheme.primary : currentTheme.border,
                  boxShadow: searchTerm ? `0 0 0 1px ${currentTheme.primary}` : 'none',
                  color: currentTheme.text,
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              />
              <div 
                className="absolute left-2.5 top-2.5" 
                style={{ 
                  color: searchTerm ? currentTheme.primary : currentTheme.textLight,
                  transition: 'color 0.2s ease'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 button-click"
                  style={{ color: currentTheme.textLight }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          {/* Expandable filters with animation */}
          <div 
            className={expandAnimation ? (isFilterExpanded ? 'fade-in' : 'fade-out') : ''}
            style={{ 
              display: isFilterExpanded ? 'block' : 'none',
              overflow: 'hidden',
              height: 'auto',
              opacity: isFilterExpanded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Category filter */}
              <div>
                <label className="block text-xs mb-1" style={{ 
                  color: currentTheme.textLight,
                  fontFamily: "'Source Sans Pro', sans-serif" // Caption font
                }}>
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none transition-all"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    backgroundColor: darkMode ? '#3B4F71' : 'white',
                    borderColor: categoryFilter !== 'all' ? currentTheme.primary : currentTheme.border,
                    color: currentTheme.text,
                    transition: 'border-color 0.2s ease, transform 0.2s ease'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="reports">Reports</option>
                  <option value="customer">Customer</option>
                  <option value="technical">Technical</option>
                  <option value="marketing">Marketing</option>
                  <option value="product">Product</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              
              {/* Priority filter */}
              <div>
                <label className="block text-xs mb-1" style={{ 
                  color: currentTheme.textLight,
                  fontFamily: "'Source Sans Pro', sans-serif" // Caption font
                }}>
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none transition-all"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  style={{
                    backgroundColor: darkMode ? '#3B4F71' : 'white',
                    borderColor: priorityFilter !== 'all' ? currentTheme.primary : currentTheme.border,
                    color: currentTheme.text,
                    transition: 'border-color 0.2s ease, transform 0.2s ease'
                  }}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && loadingItem === 0 && (
            <div 
              className="p-4 rounded-lg shadow-sm scale-in"
              style={{ 
                backgroundColor: currentTheme.cardBg,
                boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex flex-col space-y-4">
                <div className="h-6 w-3/4 rounded shimmer" style={{ backgroundColor: darkMode ? '#4A5D82' : '#F0F0F0' }}></div>
                <div className="h-4 w-1/4 rounded shimmer" style={{ backgroundColor: darkMode ? '#4A5D82' : '#F0F0F0' }}></div>
                <div className="h-4 w-1/2 rounded shimmer" style={{ backgroundColor: darkMode ? '#4A5D82' : '#F0F0F0' }}></div>
              </div>
            </div>
          )}
        
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              // Determine priority colors based on theme
              let priorityBg, priorityText;
              
              if (item.priority === 'high') {
                priorityBg = darkMode ? 'rgba(214, 40, 40, 0.2)' : 'rgba(230, 57, 70, 0.1)';
                priorityText = darkMode ? '#D62828' : '#E63946';
              } else if (item.priority === 'medium') {
                priorityBg = darkMode ? 'rgba(252, 191, 73, 0.2)' : 'rgba(244, 162, 97, 0.1)';
                priorityText = darkMode ? '#FCBF49' : '#F4A261';
              } else { // low
                priorityBg = darkMode ? 'rgba(114, 137, 164, 0.2)' : 'rgba(0, 95, 115, 0.1)';
                priorityText = darkMode ? '#7289A4' : '#005F73';
              }
              
              // Add staggered entrance animation
              const isNewItem = index === 0 && loadingItem === null && items[0].id !== filteredItems[0].id;
              const animationDelay = Math.min(index * 50, 300);
              
              return (
                <div 
                  key={item.id}
                  ref={isNewItem ? newItemRef : null}
                  className={`p-4 rounded-lg hover-lift ${isNewItem ? 'scale-in' : 'fade-in'} ${loadingItem === item.id ? 'shimmer' : ''}`}
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    animationDelay: `${animationDelay}ms`,
                    transform: isNewItem ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {loadingItem === item.id ? (
                    <div className="flex flex-col space-y-4">
                      <div className="h-6 w-3/4 rounded shimmer" style={{ backgroundColor: darkMode ? '#4A5D82' : '#F0F0F0' }}></div>
                      <div className="h-4 w-1/4 rounded shimmer" style={{ backgroundColor: darkMode ? '#4A5D82' : '#F0F0F0' }}></div>
                      <div className="h-4 w-1/2 rounded shimmer" style={{ backgroundColor: darkMode ? '#4A5D82' : '#F0F0F0' }}></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium" style={{ 
                          color: currentTheme.text,
                          fontFamily: "'Lexend', sans-serif" // Heading font
                        }}>
                          {item.title}
                        </h3>
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: priorityBg,
                            color: priorityText,
                            fontFamily: "'Poppins', sans-serif", // Subheading font for tags
                            transition: 'background-color 0.3s ease, color 0.3s ease'
                          }}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-sm capitalize mb-4" style={{ 
                        color: currentTheme.textLight,
                        fontFamily: "'Nunito', sans-serif" // Subtitle font
                      }}>
                        {item.category}
                      </div>
                      <div className="text-xs flex items-center" style={{ 
                        color: currentTheme.textLight,
                        fontFamily: "'Source Sans Pro', sans-serif" // Caption font
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Updated: {new Date(item.date).toLocaleDateString()}
                      </div>
                      
                      {/* Interactive edit buttons with micro-interaction */}
                      <div className="mt-4 pt-3 border-t flex justify-end space-x-2" style={{ 
                        borderColor: currentTheme.border,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                      }}>
                        <button
                          className="p-1 rounded text-xs button-click"
                          style={{ color: currentTheme.textLight }}
                          onClick={() => setLoadingItem(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="p-1 rounded text-xs button-click"
                          style={{ color: darkMode ? '#D62828' : '#E63946' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div 
              className="col-span-full text-center py-10 fade-in"
              style={{ 
                color: currentTheme.textLight,
                fontFamily: "'Nunito', sans-serif" // Subtitle font
              }}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <p className="mb-2">No items found matching your filters.</p>
                <button 
                  onClick={() => {
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                    setSearchTerm('');
                  }}
                  className="mt-2 text-sm px-4 py-2 rounded button-click"
                  style={{
                    backgroundColor: darkMode ? 'rgba(247, 127, 0, 0.1)' : 'rgba(0, 95, 115, 0.1)',
                    color: currentTheme.primary
                  }}
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Toast Notification with animation */}
      {toast && (
        <div
          ref={toastRef}
          className={`fixed bottom-4 right-4 shadow-lg rounded-lg p-4 flex items-center z-50 max-w-sm ${toastExiting ? 'slide-out-right' : 'slide-in-right'}`}
          style={{ 
            backgroundColor: currentTheme.cardBg,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontFamily: "'Nunito', sans-serif" // Subtitle font for toast
          }}
        >
          <div className="mr-3">
            {toast.type === 'info' && <Info size={20} style={{ color: currentTheme.infoText }} />}
            {toast.type === 'success' && <Check size={20} style={{ color: currentTheme.successText }} />}
            {toast.type === 'warning' && <AlertTriangle size={20} style={{ color: currentTheme.warningText }} />}
            {toast.type === 'error' && <AlertCircle size={20} style={{ color: currentTheme.errorText }} />}
          </div>
          <div className="flex-1">
            <p className="font-medium" style={{ 
              color: currentTheme.text,
              fontFamily: "'Poppins', sans-serif" // Subheading font
            }}>New Notification</p>
            <p className="text-sm" style={{ color: currentTheme.textLight }}>{toast.message}</p>
          </div>
          <button
            onClick={dismissToast}
            className="button-click"
            style={{ color: currentTheme.textLight }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Fixed action button for adding new alerts (visible on mobile) */}
      <div className="md:hidden fixed bottom-4 right-4">
        <button
          onClick={addRandomAlert}
          disabled={isLoading}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center button-click scale-in"
          style={{
            backgroundColor: darkMode ? currentTheme.primary : currentTheme.primary,
            color: '#fff'
          }}
        >
          {isLoading ? (
            <Loader size={20} className="spin" />
          ) : (
            <Bell size={20} />
          )}
        </button>
      </div>

      {/* Additional CSS for interactive hover effects on cards */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Card hover reveal buttons effect */
        .hover-lift:hover > div > div:last-child {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}} />
    </div>
  );
}