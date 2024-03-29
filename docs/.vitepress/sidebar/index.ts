import type { Sidebar } from "../typing";
import Base from "./base";
import Concurrency from "./concurrency";
import Feature from "./feature";
import SpringFramework from "./springFramework";
import ORM from "./orm";
import Middleware from "./middleware";
import Microservices from "./microservices";
import DB from "./db";
import DesignPatterns from "./designPatterns";
import SystemsDesign from "./systemsDesign";
import Containerization from "./containerization";
import RefactorAndOptimize from "./refactorAndOptimize";
import CaseInterview from "./caseInterview";

const sidebars: Sidebar = [
  Base,
  Concurrency,
  Feature,
  ORM,
  SpringFramework,
  Middleware,
  Microservices,
  DB,
  DesignPatterns,
  SystemsDesign,
  Containerization,
  RefactorAndOptimize,
  CaseInterview,
];
export default sidebars;
