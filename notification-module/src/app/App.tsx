import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch } from "@/pages";
import SmartDashboard from '../components/SmartDashboard';

const App: FC = () => {
  return (
    <>
      <Routes>
        
        <Route index element={<SmartDashboard />} />
        
      </Routes>
    </>
  );
};

export default App;
