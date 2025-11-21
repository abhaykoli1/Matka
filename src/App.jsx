import { Routes, Route, Navigate, Outlet } from "react-router-dom"; // <-- **Outlet added here**
import Layout from "./components/layout/layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/MatkaLandingPage";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminLayout from "./components/Admin/AdminLayout";
import UserManagement from "./pages/Admin/UserManagement";
import UserDetails from "./pages/Admin/UserDetails";
import UserBidHistory from "./pages/Admin/UserBidHistory";
import HowToPlay from "./pages/Admin/HowToPlay";
import ProfilePage from "./pages/ProfilePage";
import WalletPage from "./pages/WalletPage";
import WinHistory from "./pages/WinHistory";
import MyBids from "./pages/MyBids";
import AddMoney from "./pages/AddMoney";
// import GaliDesawarRate from "./pages/GaliDesawarRate";

import Charts from "./pages/Charts";
import RateCard from "./pages/KingJackpot";
import StarlineGame from "./pages/StarlineGame";
import BidHistoryPage from "./pages/BidHistory";
import WithdrawRequest from "./pages/WithdrawRequest";
import MyWithdrawals from "./pages/WithdrawlHistory";
import AdminDepositRequests from "./pages/Admin/AdminDepositRequests";
import AdminWithdrawalRequests from "./pages/Admin/WithdrawRequests";
import MarketList from "./pages/Admin/Market/MarketList";
import Games from "./pages/Games";
import MatkaGame from "./pages/MatkaGame";
import Passbook from "./pages/Passbook";
import MyDepositHistory from "./pages/DipositeHistory";
import AdminQRManager from "./pages/Admin/Qr/AdminQRManager";
import AdminStarline from "./pages/Admin/Starline/AdminStarline";
import StarlineGames from "./pages/StarlineUI/StarlineGamePanna";
import StarlineGamePannaBed from "./pages/StarlineUI/StarlineGamePannaBed";
import AdminDeclareStarlineResult from "./pages/Admin/Starline/AdminDeclareStarlineResult";
import StarlineResultBox from "./pages/StarlineUI/StarlineResultBox";
import AdminDepositApprovals from "./pages/Admin/Deposit/AdminDepositApprovals";

// import RajdhaniDay from "./pages/RajdhaniDay";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  // Check for the token stored during login
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // Redirect to login page if token is missing
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the nested routes using Outlet
  return <Outlet />;
};

const PublicOnlyRoute = ({ redirectPath = "/" }) => {
  // Check for the token
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // If token exists (user is logged in), redirect them away
    return <Navigate to={redirectPath} replace />;
  }

  // If no token, allow the nested route (e.g., /login, /signup) to render
  return <Outlet />;
};

const App = () => {
  return (
    <section className="">
      <div className="fixed top-0 left-0 right-0 bottom-0 z-0 bg-black">
        <div className="h-full  bg-gradient-to-tr from-purple-700 via-black/10 to-blue-500  shadow-lg flex items-center justify-center text-white text-xl font-semibold"></div>
      </div>
      <div className="bg-[rgba(0,0,0,0.6)]  fixed top-0 left-0 right-0 bottom-0 "></div>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Admin Routes - Assumed public or handled by AdminLayout for now */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="markets" element={<MarketList />} />
          <Route path="user-details" element={<UserDetails />} />
          <Route path="user-bid-history" element={<UserBidHistory />} />
          <Route path="deposite-requests" element={<AdminDepositRequests />} />
          <Route path="qr-manager" element={<AdminQRManager />} />
          <Route path="starline" element={<AdminStarline />} />
          <Route path="deposit-approvals" element={<AdminDepositApprovals />} />
          <Route
            path="starline-declare-result"
            element={<AdminDeclareStarlineResult />}
          />
          <Route
            path="withdrawal-requests"
            element={<AdminWithdrawalRequests />}
          />
        </Route>

        {/* Protected Routes (Requires accessToken) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="wallet" element={<WalletPage />} />

            <Route path="win-history" element={<WinHistory />} />
            <Route path="withdraw-request" element={<WithdrawRequest />} />
            {/* <Route path="withdraw-points" element={<WithdrawPoints />} /> */}
            <Route path="my-bids" element={<MyBids />} />
            <Route path="how-to-play" element={<HowToPlay />} />
            <Route path="add-points" element={<AddMoney />} />
            <Route path="king-jackpot" element={<RateCard />} />
            <Route path="charts" element={<Charts />} />
            <Route path="starline" element={<StarlineGame />} />
            <Route path="bid-history" element={<BidHistoryPage />} />
            <Route path="withdraw-history" element={<MyWithdrawals />} />
            <Route path="starline-result-box" element={<StarlineResultBox />} />

            <Route path="deposit-history" element={<MyDepositHistory />} />
            <Route path="passbook" element={<Passbook />} />

            <Route path="/starline/:marketId" element={<StarlineGames />} />
            <Route
              path="/starline/:marketId/:gameId"
              element={<StarlineGamePannaBed />}
            />

            <Route path="/play/:marketId" element={<Games />} />
            <Route path="/game/:marketId/:gameId" element={<MatkaGame />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </section>
  );
};

export default App;
