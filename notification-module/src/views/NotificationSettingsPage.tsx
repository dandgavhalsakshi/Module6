// // src/views/NotificationSettingsPage.tsx

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Icon, Spinner } from '@shared/ui-kit';
// import NotificationSettingsForm from '../components/NotificationSettingsForm';
// import { useNotificationsData } from '../hooks/useNotificationsData';
// import { useSettingsStore } from '../store';

// const NotificationSettingsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { updateSettings } = useNotificationsData();
//   const { settings, isLoading, error } = useSettingsStore((state: { settings: any; isLoading: any; error: any; }) => ({
//     settings: state.settings,
//     isLoading: state.isLoading,
//     error: state.error
//   }));

//   const handleSaveSettings = async (updatedSettings: any) => {
//     const success = await updateSettings(updatedSettings);
//     if (success) {
//       // Could add toast notification here
//       navigate('/');
//     }
//   };

//   const handleBack = () => {
//     navigate('/');
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 sm:p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Notification Settings</h1>
//         <Button 
//           variant="ghost" 
//           onClick={handleBack}
//           className="flex items-center gap-2"
//         >
//           <Icon name="arrow-left" size={16} />
//           Back
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center p-12">
//           <Spinner size="lg" />
//         </div>
//       ) : error ? (
//         <div className="p-4 border rounded bg-red-50 text-red-700">
//           <p className="mb-2">Failed to load notification settings</p>
//           <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
//             Try again
//           </Button>
//         </div>
//       ) : settings ? (
//         <NotificationSettingsForm 
//           currentSettings={settings} 
//           onSave={handleSaveSettings} 
//         />
//       ) : (
//         <div className="p-4 border rounded bg-yellow-50 text-yellow-700">
//           No settings found. Please refresh or contact support.
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationSettingsPage;