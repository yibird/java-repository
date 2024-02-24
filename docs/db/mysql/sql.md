SQL(Structured Query Language,结构化查询语言)是用于管理和操作关系数据库系统通用的标准化语言。SQL 是一种声明性语言,用于执行查询、更新和管理数据库。
除了 MySQL 支持 SQL 语言外,例如 Oracle、Microsoft SQL Server、PostgreSQL 等常用关系型数据库都使用 SQL 作为数据库查询语言。SQL 可以分为以下几个主要的子集和分类:

- 数据查询语言(Data Query Language,DQL):DQL 是 SQL 的一个子集,用于执行查询操作。常用的 DQL 命令包括 SELECT,用于从数据库中检索数据。
- 数据定义语言(Data Definition Language,DDL):DDL 用于定义和管理数据库对象的结构,如表、索引、视图等。常用的 DDL 命令包括 CREATE、ALTER 和 DROP。
- 数据操作语言(Data Manipulation Language,DML):DML 用于操作和管理数据库中的数据。常用的 DML 命令包括 INSERT、UPDATE 和 DELETE。
- 数据控制语言(Data Control Language,DCL):DCL 用于控制数据库中的访问权限和安全性。常用的 DCL 命令包括 GRANT 和 REVOKE。
- 事务控制语言(Transaction Control Language,TCL):TCL 用于管理数据库事务。常用的 TCL 命令包括 COMMIT 和 ROLLBACK。

## DDL 语句

### 创建、删除数据库

```sql
# 创建数据库语法1,CHARACTER SET utf8mb4表示设置utf8mb4字符集,COLLATE utf8mb4_general_ci 表示使用 case-insensitive(不区分大小写)的排序规则
create DATABASE [IF NOT EXISTS] 数据库名 CHARACTER SET utf8 COLLATE utf8mb4_general_ci;
# 例子1:创建名为db1的数据库
CREATE DATABASE db1 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
# 例子2:当名为db1的数据库不存在时创建
CREATE DATABASE db1 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# 删除数据库
DROP DATABASE [IF EXISTS] 数据库名;
# 例子1:删除名为db1的数据库
DROP DATABASE db1;
# 例子2:当名为db1的数据库存在时删除
DROP DATABASE IF EXISTS db1;
```

### 创建数据表

```sql
# 创建表语法,ENGINE = INNODB表示指定表使用INNODB作为存储引擎(默认引擎为INNODB),
# CHARACTER SET utf8mb4表示设置utf8mb4字符集,COLLATE utf8mb4_general_ci 表示使用
# case-insensitive(不区分大小写)的排序规则,row_format = dynamic表示设置表的行格式,
# dynamic支持大字段和变长字段，允许行的长度变化,COMMENT用于设置表注释
CREATE TABLE [IF NOT EXISTS] table_name (
    column1 datatype [optional_constraints],
    column2 datatype [optional_constraints],
) ENGINE = INNODB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci row_format = dynamic COMMENT '租户表';

# 例子
CREATE TABLE sys_user (
    # PRIMARY KEY用于设置当前列为主键字段,AUTO_INCREMENT表示字段值自增
    id BIGINT ( 20 ) PRIMARY KEY AUTO_INCREMENT COMMENT '用户id',
    # NOT NULL 表示当前不允许为null
    account VARCHAR ( 30 ) NOT NULL COMMENT '账号',
    `password` VARCHAR ( 200 ) NOT NULL COMMENT '密码',
    nickname VARCHAR ( 50 ) NOT NULL COMMENT '昵称',
    # DEFAULT 0表示设置当前字段默认值为0,当INSERT数据时不传递字段值则使用默认值
    sex TINYINT ( 1 ) UNSIGNED NOT NULL DEFAULT 0 COMMENT '性别(0:男,1:女,2:未知)',
    # UNSIGNED用于指示整数数据类型为无符号(unsigned)的关键字,范围从 0 到最大正整数值
    age TINYINT ( 1 ) UNSIGNED COMMENT '年龄',
    phone CHAR ( 11 ) DEFAULT '' COMMENT '电话',
    id_card CHAR ( 18 ) DEFAULT '' COMMENT '身份证',
    email VARCHAR ( 50 ) DEFAULT '' COMMENT '邮箱',
    weChat VARCHAR ( 50 ) DEFAULT '' COMMENT '微信号',
    address VARCHAR ( 100 ) DEFAULT '' COMMENT '地址',
    avatar VARCHAR ( 100 ) DEFAULT '' COMMENT '头像',
    birthday DATETIME COMMENT '生日',
    `status` BIT ( 1 ) NOT NULL DEFAULT 1 COMMENT '数据状态(0禁用,1启用)',
    remark VARCHAR ( 500 ) DEFAULT NULL COMMENT '备注',
    version INT COMMENT '版本号',
    sort INT ( 4 ) DEFAULT 0 COMMENT '排序序号',
    deleted BIT ( 1 ) NOT NULL DEFAULT 0 COMMENT '删除标志(0未删除,1已删除)',
    creator VARCHAR ( 64 ) DEFAULT '' COMMENT '创建者',
    create_time DATETIME DEFAULT NOW() COMMENT '创建时间',
    updater VARCHAR ( 50 ) DEFAULT '' COMMENT '修改者',
    update_time DATETIME COMMENT '修改时间',
    tenant_id BIGINT NOT NULL COMMENT '租户id',
    role_id BIGINT NOT NULL COMMENT '角色id',
    org_id BIGINT COMMENT '机构id',
    post_id BIGINT COMMENT '岗位id',
    # UNIQUE INDEX用于创建唯一索引,`account` ASC表示根据字段升序排序,USING BTREE表示使用BTREE结构作为索引底层数据结构
    UNIQUE INDEX `uq_account` ( `account` ASC ) USING BTREE,
    UNIQUE INDEX `uq_phone` ( `phone` ASC ) USING BTREE,
    UNIQUE INDEX `uq_id_card` ( `id_card` ASC ) USING BTREE,
    # FOREIGN KEY用于添加外键约束,tenant_id关联sys_tenant表的id字段
    FOREIGN KEY (tenant_id) REFERENCES sys_tenant(id)
) ENGINE = INNODB CHARACTER
    SET = utf8mb4 COLLATE = utf8mb4_general_ci row_format = dynamic COMMENT '用户表';
```

### 创建视图

### 创建索引

### 创建存储过程

### 创建触发器

## DQL 语句

### SELECT(查询)

### DISTINCT(去重)

### WHERE(条件查询)

### ORDER BY(排序)

### GROUP BY(分组)

### HAVING(分组过滤)

### LIMIT(分页)

### UNION(联合)

### 多表连接

### 子查询

## DML 语句

### INSERT

### UPDATE

### DELETE
