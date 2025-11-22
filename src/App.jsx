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
import StarlineGame from "./pages/StarlineUI/StarlineGame";
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
import WalletTransactionHistory from "./pages/Wallet/walletHistory";
import StarlineBidHistory from "./pages/StarlineUI/StarlineBidHistory";
import StarlineWinHistory from "./pages/StarlineUI/StarlineWinHistory";
import AdminJackpot from "./pages/Admin/Jackpot/AdminJackpot";
import JackpotGame from "./pages/JackpotUI/JackpotGame";
import JackpotBidHistory from "./pages/JackpotUI/JackpotBidHistory";
import JackpotGamePanna from "./pages/JackpotUI/JackpotGamePanna";
import JackpotGamePannaBed from "./pages/JackpotUI/JackpotGamePannaBed";
import JackpotWinHistory from "./pages/JackpotUI/JackpotWinHistory";
import GameRatePage from "./pages/GameRate";
import ContactUs from "./pages/ContactUs";
import UpdatePasswordPage from "./pages/ChangePassWord";
import AdminDeclareResult from "./pages/Admin/DeclareResult/AdminDeclareResult";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

const PublicOnlyRoute = ({ redirectPath = "/" }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

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
          <Route path="jackpot" element={<AdminJackpot />} />
          <Route path="deposit-approvals" element={<AdminDepositApprovals />} />
          <Route
            path="declare-result/:marketId"
            element={<AdminDeclareResult />}
          />
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
            <Route path="my-bids" element={<MyBids />} />
            <Route path="how-to-play" element={<HowToPlay />} />
            <Route path="add-points" element={<AddMoney />} />
            {/* <Route path="king-jackpot" element={<RateCard />} /> */}
            <Route path="charts/:marketId" element={<Charts />} />
            <Route path="starline" element={<StarlineGame />} />

            <Route
              path="starline-bid-history"
              element={<StarlineBidHistory />}
            />
            <Route
              path="starline-win-history"
              element={<StarlineWinHistory />}
            />

            <Route path="/starline/:marketId" element={<StarlineGames />} />

            <Route
              path="/starline/:marketId/:gameId"
              element={<StarlineGamePannaBed />}
            />

            <Route path="game-rate" element={<GameRatePage />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="king-jackpot" element={<JackpotGame />} />
            <Route path="change-password" element={<UpdatePasswordPage />} />

            <Route path="jackpot-bid-history" element={<JackpotBidHistory />} />
            <Route path="jackpot-win-history" element={<JackpotWinHistory />} />
            <Route path="/jackpot/:marketId" element={<JackpotGamePanna />} />
            <Route
              path="/starline/:marketId/:gameId"
              element={<StarlineGamePannaBed />}
            />
            <Route
              path="/jackpot/:marketId/:gameId"
              element={<JackpotGamePannaBed />}
            />
            {/* <Route
              path="jackpot-win-history"
              element={<JackpotWinHistory />}
            /> */}

            <Route path="bid-history" element={<BidHistoryPage />} />
            <Route path="withdraw-history" element={<MyWithdrawals />} />
            <Route path="starline-result-box" element={<StarlineResultBox />} />

            <Route path="deposit-history" element={<MyDepositHistory />} />
            <Route
              path="wallet-history"
              element={<WalletTransactionHistory />}
            />
            <Route path="passbook" element={<Passbook />} />

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
