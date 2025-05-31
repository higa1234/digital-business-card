import { memo, type FC } from "react";
import { Route, Routes } from "react-router-dom";

import { Card } from "../components/pages/Card";
import { Register } from "../components/pages/Register";
import { Home } from "../components/pages/Home";

export const Router: FC = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/card" element={<Card />}>
        <Route path=":postId" element={<Card />}></Route>
      </Route>
      <Route path="/card/register" element={<Register />}></Route>
    </Routes>
  );
});
