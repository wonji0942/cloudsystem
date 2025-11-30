// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Main from "./pages/main.jsx";
import Join from "./pages/join.jsx";
import Record from "./pages/record.jsx";
import Recommend from "./pages/recommend.jsx";
import MyPage from "./pages/mypage.jsx";
import SpecificPage from "./pages/specific.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/join" element={<Join />} />
        <Route path="/record" element={<Record />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/specific" element={<SpecificPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;