import type { Sidebar } from '../typing';
import base from './base';
import concurrency from './concurrency';
import feature from './feature';
import springFramework from './springFramework';
import orm from './orm';
import middleware from './middleware';
import microservices from './microservices';
import database from './db';
import DesignPatterns from './designPatterns';
import businessFunctions from './businessFunctions';
import systemsDesign from './systemsDesign';
import containerization from './containerization';
import refactorAndOptimize from './refactorAndOptimize';
import caseInterview from './caseInterview';

const sidebars: Sidebar = [
  base,
  concurrency,
  feature,
  orm,
  springFramework,
  middleware,
  microservices,
  database,
  DesignPatterns,
  businessFunctions,
  systemsDesign,
  containerization,
  refactorAndOptimize,
  caseInterview,
];
export default sidebars;
