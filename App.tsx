
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ScanTicketPage from './pages/ScanTicketPage';
import Toast from './components/Toast';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  if (!user || user.role !== 'organizer') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { toast } = useAppContext();

    return (
        <HashRouter>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Header />
                <main className="container mx-auto p-4 md:p-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/event/:id" element={<EventDetailPage />} />
                        <Route path="/my-tickets" element={<MyTicketsPage />} />
                        <Route path="/admin" element={
                            <PrivateRoute>
                                <AdminDashboardPage />
                            </PrivateRoute>
                        } />
                        <Route path="/scan" element={
                             <PrivateRoute>
                                <ScanTicketPage />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </div>
        </HashRouter>
    );
};


const App: React.FC = () => {
  return (
    <AppProvider>
        <AppContent />
    </AppProvider>
  );
};

export default App;
