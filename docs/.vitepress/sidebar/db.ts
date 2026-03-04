export default {
  text: '数据库(DB)',
  collapsed: true,
  items: [
    {
      text: 'Mysql',
      collapsed: true,
      items: [
        {
          text: 'MySQL架构体系与执行引擎',
          link: '/db/mysql/architecture.md',
        },
        {
          text: '类型',
          link: '/db/mysql/type.md',
        },
        {
          text: 'SQL',
          link: '/db/mysql/sql.md',
        },
        {
          text: 'InnoDB存储结构',
          link: '/db/mysql/innoDBStructure.md',
        },
        {
          text: '索引',
          link: '/db/mysql/index.md',
        },
        {
          text: '事务',
          link: '/db/mysql/transation.md',
        },
        {
          text: '锁机制',
          link: '/db/mysql/lock.md',
        },
        {
          text: 'MVCC',
          link: '/db/mysql/mvcc.md',
        },
        {
          text: 'rodo undo日志',
          link: '/db/mysql/rodoAndUndo.md',
        },
        {
          text: '高可用',
          link: '/db/mysql/highAvailability.md',
        },
        {
          text: 'MySQL优化',
          collapsed: true,
          items: [
            {
              text: 'SQL性能分析工具',
              link: '/db/mysql/analysis.md',
            },
            {
              text: 'SQL优化',
              link: '/db/mysql/sqlOptimize.md',
            },
          ],
        },
      ],
    },
    {
      text: 'MongoDB',
    },
  ],
};
