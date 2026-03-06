import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import Tools from "./pages/Tools";
import Admin from "./pages/Admin";
import QrGenerator from "./pages/QrGenerator";
import InputTester from "./pages/InputTester";
import UrlShortener from "./pages/UrlShortener";
import TextSummarizer from "./pages/TextSummarizer";
import Compiler from "./pages/Compiler";
import Navbar from './components/Navbar'
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/ReactToastify.css'

const App = () => {
  const { showLogin } = useContext(AppContext)
  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50" >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/qr" element={<QrGenerator />} />
        <Route path="/input-tester" element={<InputTester />} />
        <Route path="/shorten" element={<UrlShortener />} />
        <Route path="/summarize" element={<TextSummarizer />} />
        <Route path="/compiler" element={<Compiler />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
