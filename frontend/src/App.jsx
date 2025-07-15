import React from "react";
import CreateNote from "./pages/CreateNote";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotePage from "./pages/NotePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/note/:id" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
