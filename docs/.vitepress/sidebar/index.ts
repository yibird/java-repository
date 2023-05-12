import type { Sidebar } from '../typing'
import Base from './base'
import Concurrency from './concurrency'
import Feature from './feature'
import SpringFramework from './springFramework'
import ORM from './orm'
import Middleware from './middleware'
import Microservices from './microservices'
import DB from './db'
import BusinessFunctions from './businessFunctions'
import CaseInterview from './caseInterview'

const sidebars: Sidebar = [
    Base,
    Concurrency,
    Feature,
    ORM,
    SpringFramework,
    Middleware,
    Microservices,
    DB,
    BusinessFunctions,
    CaseInterview
]
export default sidebars;