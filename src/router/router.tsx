// src/router/index.tsx
import { MainLayout } from "@/layout/MainLayout";
import { createBrowserRouter } from "react-router-dom";
import avo from "../assets/image/avo.png";
import acsa from "../assets/image/acsa.png";
import pass from "../assets/image/pass.png";
import svia from "../assets/image/svia.png";


const mainRouter = [
  {
    path: "acsa",
    element: <MainLayout brand="ACSA" image={acsa}  />,
  },
  {
    path: "avo",
    element: <MainLayout brand="AVO" image={avo} />,
  },
  {
    path: "rpass",
    element: <MainLayout brand="RPASS" image={pass} />,
  },
  {
    path: "svia",
    element: <MainLayout brand="SVIA" image={svia} />,
  }
];

export const router = createBrowserRouter([
  {
    path: "/",
    children: mainRouter,
  },
]);
