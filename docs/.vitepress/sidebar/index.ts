import type { Sidebar } from '../typing'
import Base from './base'
import Concurrency from './concurrency'
import Feature from './feature'
import Spring from './spring'
import SpringMVC from './springMVC'
import SpringBoot from './springBoot'
import ORM from './orm'
import Middleware from './middleware'
import Microservices from './microservices'
import DB from './db'
import CaseInterview from './caseInterview'

const sidebars: Sidebar = [
    Base,
    Concurrency,
    Feature,
    ORM,
    Spring,
    SpringMVC,
    SpringBoot,
    Middleware,
    Microservices,
    DB,
    CaseInterview
]
export default sidebars;