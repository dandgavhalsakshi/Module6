import { Route, Routes } from "react-router-dom";
import type { MountProps } from './types/index';
// import { Layout } from "@/app/Layout";
// import { Home, NoMatch } from "@/pages";
import PredictiveAlert from './components/PredictiveAlert';
import  NotificationSettings from './components/NotificationSettingsForm'

const App: React.FC<MountProps> = (props) => {
  return (
    <>
      <Routes>
        
        <Route index element={<PredictiveAlert />} />
        <Route path="/settings" element={<NotificationSettings />} />

      </Routes>
    </>
  );
};
export default App;
