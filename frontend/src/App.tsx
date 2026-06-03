import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminMatchesPage from "./pages/admin/AdminMatchesPage";
import AdminRankingPage from "./pages/admin/AdminRankingPage";
import AdminTablesPage from "./pages/admin/AdminTablesPage";
import BetPage from "./pages/BetPage";
import EnterTablePage from "./pages/EnterTablePage";
import MatchesPage from "./pages/MatchesPage";
import MyBetsPage from "./pages/MyBetsPage";
import ScoreboardPage from "./pages/ScoreboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/bar/bar-do-teco/mesa/MESA01" replace />} />
      <Route path="/bar/:barSlug/mesa/:mesaCodigo" element={<ClientLayout />}>
        <Route index element={<EnterTablePage />} />
        <Route path="entrada" element={<EnterTablePage />} />
        <Route path="jogos" element={<MatchesPage />} />
        <Route path="jogos/:matchId/apostar" element={<BetPage />} />
        <Route path="meus-palpites" element={<MyBetsPage />} />
        <Route path="apostas" element={<MyBetsPage />} />
        <Route path="placar" element={<ScoreboardPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="jogos" element={<AdminMatchesPage />} />
        <Route path="mesas" element={<AdminTablesPage />} />
        <Route path="ranking" element={<AdminRankingPage />} />
      </Route>
    </Routes>
  );
}
