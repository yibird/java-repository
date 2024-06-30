## 1.基础篇

在 Redis 中,Set 是一种无序、不重复的数据结构,它类似于集合(mathematical sets)。Redis 的 Set 结构提供了一组操作,允许添加、删除和检查元素的存在。Set 集合常用于以下场景:

- 数据去重:利用 Set 的唯一性,实现对数据的去重操作。
- 标签系统:使用 Set 存储对象的标签,例如文章标签、商品标签。通过 Set 的唯一性,确保每个标签只出现一次。
- 实时统计:统计在线用户、活跃用户等。每个用户的登录状态可以用一个 Set 表示。
- 排行榜:存储分数与成员的关系,可以通过 ZADD、ZRANK 等命令实现排行榜功能。
- 实现共同好友:通过求两个用户关注的人的交集,实现找共同好友的功能。
- 用户关注关系:使用两个 Set,一个存储粉丝,一个存储关注的人。通过交集、并集等操作,轻松实现关注关系的查询。

set 常用于命令如下:
|命令|描述|时间复杂度|
|-|-|-|
|SADD key member [member ...]|向 set 集合中添加一个或多个成员|O(n),n 表示元素数量|
|SCARD key|返回指定集合成员数量|O(1)|
|SDIFF key [key ...]|返回一个或多个 set 的差集|O(n),其中 n 是所有给定集合中的元素总数|
|SDIFFSTORE destination key [key ...]|此命令与 SDIFF 命令类似,但不会返回差集,而是将差集存储到 destination 集合中|O(n),其中 n 是所有给定集合中的元素总数|
|SINTER key [key ...]|返回一个或多个 set 的交集|最坏情况为 O(N\*M),其中 N 是最小集合的基数,M 是集合的数量。|
|SINTERCARD numkeys key [key ...] [LIMIT limit]|此命令类似于 SINTER,但它不返回结果集,而只返回结果的基数。返回集合的基数,该基数将由所有给定集合的交集产生。|O（N\*M） 最坏情况,其中 N 是最小集合的基数,M 是集合数。|
|SINTERSTORE destination key [key ...]|此命令与 SINTER 命令类似,但不会返回交集,而是将交集存储到 destination 集合中|O(n),其中 n 是所有给定集合中的元素总数|
|SISMEMBER key member|判断 member 是否是 set 集合中(key)的成员,是则返回 1,否则返回 0|O(1)|
|SMEMBERS key|返回指定 set 集合中所有成员|O(n),n 表示 set 集合中所有成员的数量|
|SMISMEMBER key member [member ...]|与 SISMEMBER 命令类似,但是 SMISMEMBER 用于判断多个成员|O(n),其中 n 表示检查成员资格的元素数|
|SMOVE source destination member|将源 set 的指定成员(member)移动到目标 set 中(destination)|O(1)|
|SPOP key [count]|从指定 set 删除中删除 count 数量成员|O(n),n 表示要删除的成员数量|
|SRANDMEMBER key [count]|随机返回 set 集合中 count 数量的成员列表|O(n),n 表示要返回的成员数量|
|SREM key member [member ...]|批量从 set 集合中删除一个或多个成员|O(n),n 表示要删除的成员个数|
|SSCAN key cursor [MATCH pattern] [COUNT count]|使用游标的方式迭代 set 集合,与 SCAN 命令类似|O(n),n 表示访问的数量(count)|
|SUNION key [key ...]|返回一个或多个 set 集合的并集(相同的成员元素会被移除)|O(N),其中 N 是所有给定集合中的元素总数|
|SUNIONSTORE destination key [key ...]|与 SUNION 命令类似,将返回一个或多个 set 集合的并集存储到目标集合(destination)中|O(N),其中 N 是所有给定集合中的元素总数|

```shell
# 向set添加成员
localhost:6379> SADD set1 member01
(integer) 1
localhost:6379> SADD set1 member02 member03
(integer) 2

# 返回set成员数
localhost:6379> SCARD set1
(integer) 3

# 返回两个set的差集
localhost:6379> SADD set2 member02
(integer) 1
localhost:6379> SDIFF set1 set2
1) "member01"
2) "member03"

# 返回两个set的差集,并将该差集存储另一个set中
localhost:6379> SDIFFSTORE set3 set1 set2
(integer) 2
localhost:6379> SCARD set3
(integer) 2

# 返回两个集合的交集
localhost:6379> SINTER set1 set2
1) "member02"


# 返回两个集合的交集,并将交集存储到另一个set中
localhost:6379> SINTERSTORE set4 set1 set2
(integer) 1
localhost:6379> SCARD set4
(integer) 1

# 判断集合是否存在指定成员,若存在则返回1,否则返回0
localhost:6379> SISMEMBER set1 member01
(integer) 1
localhost:6379> SISMEMBER set1 member03
(integer) 1
localhost:6379> SISMEMBER set1 member04
(integer) 0

# 返回集合中所有成员
localhost:6379> SMEMBERS set1
1) "member01"
2) "member02"
3) "member03"

# 判断多个成员是否在集合中
localhost:6379> SMISMEMBER set1 member01 member03 member04
1) (integer) 1
2) (integer) 1
3) (integer) 0
```

## 2.应用篇

## 3.原理篇
