InnoDB 存储引擎是 MySQL 中最常用的存储引擎之一,以其对事务处理的支持、行级锁定和恢复能力而著称。InnoDB 的存储结构设计精巧,旨在优化性能和数据完整性。

## 1.InnoDB 存储引擎逻辑结构

从 InnoDB 存储引擎逻辑存储结构来看,所有数据都被逻辑地存放在一个空间中,这个空间被称为表空间。表空间又由段、区、页组成:

- **表空间(Tablespace)**:表空间是 InnoDB 存储结构的最高层级,它包含了数据库中的所有数据和索引。InnoDB 可以配置为使用共享表空间或独立表空间。
  - 共享表空间: 默认情况下,所有 InnoDB 表的数据和索引存储在一个或多个名为 ibdata 的文件中,这些文件共同构成了共享表空间。共享表空间还存储了 undo 信息、系统事务信息、二次写缓冲和插入缓冲等。
  - 独立表空间: 每个 InnoDB 表可以有自己的表空间,这意味着数据和索引可以单独存储在与表同名的.ibd 文件中,便于管理和空间回收。
- **段(Segment)**:段是表空间内的逻辑划分,通常与索引相关联。每个表至少有一个段用于存放数据(聚集索引段),如果表上有额外的索引,则每个索引也会有对应的段。
- **区(Extent)**:区是由连续的页组成的空间单元,是 InnoDB 管理存储空间的基本单位。默认情况下,一个区包含 64 个连续的页。
- **页(Page/Block)**:页是 InnoDB 存储的最小单位,也是磁盘和内存交互的基本单位。默认页大小为 16KB,但可以配置,推荐为 16 的倍数(这是因为大多数文件系统的块大小是 4KB 或 8KB,而数据库页大小通常会设置为文件系统块大小的倍数,以便更高效地进行磁盘 I/O 操作。16KB 页大小在大多数情况下能更好地与文件系统的块大小对齐,减少 I/O 操作的次数,提高 I/O 性能)。数据和索引都被存储在页中,页之间通过双向链表连接。每个页都有头部信息,用于存储页的元数据。

![InnoDB存储引擎逻辑结构](/assets/img/db/mysql/innodb-structure.png 'InnoDB存储引擎逻辑结构')

### 1.1 表空间

InnoDB 表空间(Tablespace)是 InnoDB 存储引擎管理数据存储的基本单位。表空间可以包含一个或多个数据文件,这些文件用于存储表的数据和索引。InnoDB 表空间包含以下几种类型:

- 系统表空间(System Tablespace):默认情况下,InnoDB 会使用一个共享的系统表空间 ibdata1,它包含了所有表的数据、索引、内部系统信息、回滚段等。可以通过配置参数 innodb_data_file_path 来设置系统表空间的文件和大小。配置系统表空间:

```ini
[mysqld]
innodb_data_file_path=ibdata1:12M:autoextend
```

- 独立表空间(File-Per-Table Tablespace):启用 innodb_file_per_table 参数后,InnoDB 会为每个表创建一个单独的表空间文件,默认扩展名为 .ibd。独立表空间提供了更灵活的表管理、更高效的空间回收以及更简单的备份和恢复操作。启用独立表空间:

```ini
[mysqld]
innodb_file_per_table=1
```

- 通用表空间(General Tablespace):通用表空间允许在一个表空间中存储多个表的数据,用户可以自定义表空间的名称和位置。通用表空间提供了更高的管理灵活性,适用于需要共享存储配置的多个表。创建并使用通用表空间:

```sql
# 创建通用表空间
CREATE TABLESPACE ts1 ADD DATAFILE 'ts1.ibd' FILE_BLOCK_SIZE = 16384;
# 使用通用表空间
CREATE TABLE my_table (
    id INT PRIMARY KEY,
    data VARCHAR(255)
) TABLESPACE ts1;

# 查看表空间信息
SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES;
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES;
# 优化表空间,可以使用 OPTIMIZE TABLE 命令对独立表空间进行碎片整理,从而回收未使用的空间。
OPTIMIZE TABLE 表名;
```

- 临时表空间(Temporary Tablespace):临时表空间用于存储临时表和临时数据,例如在排序操作或临时表查询过程中。临时表空间文件通常不会持久存储,并在数据库重启时重新创建。

### 1.2 段

段是 InnoDB 内部用于管理和分配存储空间的基本单位,用于管理表或索引的数据,一个表或索引可以有多个段。每个段由若干个区(extent)组成,而每个区由连续的页(page)组成。当创建一个表或索引时,InnoDB 会为其分配一个或多个段。InnoDB 中主要有以下几种类型的段:

- 数据段(Data Segment):存储表的数据行。
- 索引段(Index Segment):存储二级索引的数据。
- 回滚段(Rollback Segment):存储事务的回滚信息。
- 临时段(Temporary Segment):用于存储临时数据,比如在排序或查询操作中。

```sql
# 在employees 表中,表的主键索引和数据将分别存储在数据段和索引段中。
# 数据段用于存储实际的行数据,即 id、name、position 和 salary 的值。
# 索引段用于存储主键索引的数据,即 id 值的索引。
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    position VARCHAR(50),
    salary DECIMAL(10, 2)
) ENGINE=InnoDB;


# 查看段信息
SHOW ENGINE INNODB STATUS;

# 查看表相关的段信息
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='your_database/your_table';
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID=your_table_id;
```

### 1.3 区

在 InnoDB 的存储结构中,区(extent)是管理存储空间的关键单元之一。每个区由若干个连续的页(page)组成(通常由 64 个连续的页组成),以减少磁盘 I/O 操作,提高数据读取和写入的性能。当创建一个表或索引时,InnoDB 会为其分配一个或多个区。InnoDB 中的区有以下几种类型:

- 系统区(System Extents):存储系统表和数据字典信息。
- 文件区(File Extents):存储文件系统相关的信息。
- 段区(Segment Extents):用于存储表的数据段和索引段。

```sql
# 查看区信息
SHOW ENGINE INNODB STATUS;

# 查看表相关区信息
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='your_database/your_table';
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID=your_table_id;
```

### 1.4 页

页是 InnoDB 存储的最小单位,也是磁盘和内存交互的基本单位。默认页大小为 16KB,但可以配置,推荐为 16 的倍数(这是因为大多数文件系统的块大小是 4KB 或 8KB,而数据库页大小通常会设置为文件系统块大小的倍数,以便更高效地进行磁盘 I/O 操作。16KB 页大小在大多数情况下能更好地与文件系统的块大小对齐,减少 I/O 操作的次数,提高 I/O 性能)。数据和索引都被存储在页中,页之间通过双向链表连接。每个页都有头部信息,用于存储页的元数据。InnoDB 中常见的页类型包括:

- 数据页(Data Page):存储表的数据行。每个数据页包含多个数据行的数据。
- 索引页(Index Page):存储 B+树索引的节点信息。每个索引页包含索引键值和指向其他页的指针。
- undo 页(Undo Page):存储事务的 undo 日志信息,用于事务回滚和 MVCC(多版本并发控制)。
- 系统页(System Page):存储系统元数据和其他系统信息。

## 2.InnoDB 页数据结构

InnoDB 存储引擎中,页(Page)是管理存储空间的基本单位,其大小默认为 16KB,用于存放数据记录和索引信息。一个 InnoDB 数据页的结构大致可以分为以下几个部分:

- **File Header(文件头)**:占 38 字节,包含页的基本元数据,如页的类型、页的唯一标识符、页的上一页和下一页的地址等。
- **Page Header(页面头)**:占 56 字节,存储页面专有的信息,比如页的状态、页的 LSN(Log Sequence Number,用于恢复)、已使用的空间、空闲空间等。
- **Page Directory(页目录)**:页目录是一个目录项数组,用于加速记录的查找。每个目录项指向一个槽(Slot),槽里存放着指向记录的指针,形成了一个稀疏索引,有助于快速定位到数据行。
- **Infimun 和 Supremum Records**:Infimum 和 Supremum 是 InnoDB 存储引擎页结构中的两个特殊记录,它们分别代表了最小值(Infimum)和最大值(Supremum)。这两个概念主要用于 B+树索引的处理。
  - **Infimum**:Infimum 记录通常用于表示一个页的开始位置,它的存在是为了方便在 B+树中进行查找。当需要从一个页中查找数据时,可以首先检查是否已经到达 Infimum 记录的位置,如果是,则说明已经找到了目标数据。
  - **Supremum**:Supremum 记录则通常用于表示一个页的结束位置。与 Infimum 类似,它也是为了方便在 B+树中进行查找。当需要从一个页中查找数据时,可以首先检查是否已经到达 Supremum 记录的位置,如果是,则说明已经找不到更多的数据。
- **User Records(用户记录)**:实际存储数据行记录的地方。记录按照指定的行格式存储,行格式可以是 Compact、Redundant、Dynamic 或 Compressed 之一。
- **Free Space(空闲空间)**:未使用的空间,用作插入新记录或更新现有记录时的空间分配。空闲空间管理通过 Free List(空闲列表)实现,它是一个链表结构,跟踪可用的小块空间。
- **File Trailer(文件尾部)**:占 8 字节,用于维护数据页的完整性和一致性。

![InnoDB 页数据结构](/assets/img/db/mysql/innodb-page.png 'InnoDB 页数据结构')

### 2.1 File Header

### 2.2 Page Header

### 2.3 Page Directory

### 2.4 Infimun 和 Supremum Records

### 2.5 User Records 用户记录

### 2.6 Free Space

### File Trailer

## 3.InnoDB 行记录格式

InnoDB 存储引擎与大多数关系型数据库一样,采用行格式存储,这意味着一个页中保存着表中一行行的数据。在 InnoDB 存储引擎中支持 Compact(默认)、Redundant、Dynamic、Compressed 四种行格式。InnoDB 行记录格式的设计和选择对于数据库的性能、存储效率和兼容性有着直接的影响,因此,选择合适的行记录格式至关重要。

### 3.1 Compact 行格式

Compact 是 MySQL 5.0 引入的行格式,目的是提高存储效率,使得每个数据页能够存储更多的行记录。它通过更紧凑的方式存储记录头信息和变长字段长度列表,减少了记录的开销。此外,对于可空列,它采用位图标记哪些列值为空,进一步节省空间。简单来说,一个页中存放的行数据越多,其性能就越高。

### 3.2 Redundant 行格式

### 3.3 Dynamic 行格式

### 3.4 Compressed 行格式
