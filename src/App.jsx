import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForgetPassword from './Pages/ForgetPassword';
import LoginPage from './Pages/LoginPage';
import OtpVerification from './Pages/OtpVerification';
import ResetPassword from './Pages/ResetPassword';
import ResetSuccessful from './Pages/ResetSuccessful';

import Media from "./Pages/Media/Media"
import Results from "./Pages/Result/Results"

import Dashboard from './Dashboard/Dashboard';
import TestingServices from './Pages/TestingServices/TestingServices';
import Voucher from './Pages/Vouchers/Voucher';
import Deal from './Pages/Deals/Deals';
import ProductList from './Pages/ProductList/ProductList';
import OrderList from './Pages/Orders/Orders';
import Home from './Pages/Home/Home';
import ContactQueries from './Pages/ContactQueries/ContactQueries';
import PaymentInformation from './Pages/My Payment Informations/MyPaymentInformations';
import Transactions from './Pages/Transactions/Transactions';
import ProfileUpdate from './Pages/Profile/Profile';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Inventory from './Pages/Inventory/Inventory';
import AlphaPte from './Pages/Orders/AlphaPte';
import Alpha from './Pages/Alpa/Alpha';
const queryClient = new QueryClient();
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This adds the animation
    });
  }, [pathname]);

  return null;
};
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      
    <Router>
    <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path='/otp-verification' element={<OtpVerification/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/reset-successful' element={<ResetSuccessful/>}/>

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home/>} />
        <Route path="/dashboard/media" element={<Media />} />
          
          <Route path="/dashboard/result" element={<Results />} />
          <Route path="/dashboard/testingservices" element={<TestingServices/>}/>
          <Route path='/dashboard/voucher' element={<Voucher/>}/>
          <Route path='/dashboard/deals' element={<Deal/>} />
          <Route path='/dashboard/productlist' element={<ProductList/>}/>
          <Route path='/dashboard/orders' element={<OrderList/>} />
          <Route path='/dashboard/contact' element={<ContactQueries/>}/>
          <Route path='/dashboard/paymentinformation' element={<PaymentInformation/>}/>
          <Route path="/dashboard/transactions" element={<Transactions/>}/>
          <Route path="/dashboard/admin-profile" element={<ProfileUpdate/>}/>
          <Route path='/dashboard/inventory' element={<Inventory/>}/>
          <Route path='/dashboard/alpha' element={<Alpha/>}/>
          </Route>
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;
