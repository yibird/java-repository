Spring 是一个包含多个模块的框架集合,为了代码复用,Spring 内部提供了一系列工具类简化开发。Spring 提供的工具类位于`org.springframework.util`包下,包含了 String、Number、Object、Reflection(反射)、Stream、Assert(断言)、Collection(集合)、Resource(资源)等工具类。

## 1.StringUtils

StringUtils 是 Spring Framework 提供的字符串处理工具类,用于执行各种字符串相关的操作,StringUtils 常用方法如下:

- 判空操作:

  - hasLength(CharSequence str):检查指定的 CharSequence 不为 null 且长度大于 0,返回一个布尔值。
  - hasLength(String str):检查指定的 String 不为 null 且长度不等于 0,返回一个布尔值。
  - hasText(CharSequence str):检查指定的 CharSequence 是否不为 null 且不包含空白字符,返回一个布尔值。
  - hasText(@Nullable String str):检查指定的 String 是否不为 null 且不包含空白字符,返回一个布尔值。

- 包含操作:

  - containsWhitespace(@Nullable CharSequence str):检查指定的 CharSequence 是否包含任何空白字符,返回一个布尔值。
  - containsWhitespace(@Nullable String str):检查指定的 String 是否包含任何空白字符,返回一个布尔值。

- 去除空格:

  - trimAllWhitespace(CharSequence str):去除 CharSequence 中所有空白字符,返回一个新的 CharSequence。
  - String trimAllWhitespace(String str):去除 String 中所有空白字符,返回一个新的 String。
  - trimLeadingWhitespace(String str):从指定的字符串中修剪左侧空格,返回一个新的 String。该方法在 Spring6 被废弃,其底层调用了 String.stripLeading(),可以使用 String.stripLeading()代替该方法。
  - trimTrailingWhitespace(String str):从指定的字符串中修剪右侧空格,返回一个新的 String。该方法在 Spring6 被废弃,其底层调用了 String.stripTrailing(),可以使用 String.stripTrailing()代替该方法。
  - trimLeadingCharacter(String str, char leadingCharacter):从指定的字符串中修剪所有出现的所提供的左侧字符,返回一个新的字符串。
  - trimTrailingCharacter(String str, char trailingCharacter):从指定的字符串中修剪所有出现的所提供的右侧字符,返回一个新的字符串。

- 大小写转换:

  - capitalize(String str):将字符串的首字母大写,返回一个新的字符串。
  - uncapitalize(String str):将字符串首字母小写,返回一个新的字符串。
  - uncapitalizeAsProperty(String str):以 JavaBeans 属性格式取消字符串的大写,根据 Character.toLowerCase(char)将第一个字母改为小写,除非最初的两个字母是直接连续的大写字母。

- 单引号拼接:

  - quote(@Nullable String str):用单引号引用指定字符串,返回一个新的字符串。
  - quoteIfString(@Nullable Object obj):如果指定的 Object 是 String,则将其转换为带有单引号的 String,否则使对象保持原样,调用该对象的 toString()。

- 判断前缀和后缀:

  - startsWithIgnoreCase(@Nullable String str, @Nullable String prefix):检查字符串是否以指定的前缀开头(忽略大小写)。
  - endsWithIgnoreCase(@Nullable String str, @Nullable String suffix):检查字符串是否以指定的后缀开头(忽略大小写)。

- 替换操作:
  - replace(String inString, String oldPattern, String newPattern):使用新的字符串替换原字符串中的指定字符串,返回一个新的字符串。
- 字符串删除:

  - delete(String inString, String pattern):删除所有出现的给定子字符串(pattern),返回一个新的字符串。该方法基于 replace()实现删除操作。
  - deleteAny(String inString, @Nullable String charsToDelete):删除指定字符串(charsToDelete)中的所有字符,返回一个新的字符串。该方法底层先将字符串转为一个 char[],通过遍历的方式比较指定字符串获取最后出现位置,最终使用 String 截取操作删除字符并返回一个新的字符串。

- 分割操作:
  - tokenizeToStringArray(@Nullable String str, String delimiters):通过 StringTokenizer 将指定的分隔符(delimiters)将字符串分割成字符串数组。
  - tokenizeToStringArray(@Nullable String str, String delimiters, boolean trimTokens, boolean ignoreEmptyTokens):通过 StringTokenizer 将指定的分隔符将字符串分割成字符串数组。trimTokens 表示是否通过 String.trim()修剪标记,ignoreEmptyTokens 表示是否从结果数组中省略空标记。
  - delimitedListToStringArray(@Nullable String str, @Nullable String delimiter):使用指定的分隔符将字符串分割成字符串数组。单个分隔符可能由多个字符组成,但与 tokenizeToStringArray 不同,它仍将被视为单个分隔符字符串,而不是一堆潜在的分隔符字符。
  - delimitedListToStringArray(@Nullable String str, @Nullable String delimiter, @Nullable String charsToDelete):使用指定的分隔符将字符串分割成字符串数组。charsToDelete 表示一组要删除的字符,用于删除不需要的换行符,例如`\r\n\f`将删除字符串中的所有新行和换行符。
- 转换操作:

  - commaDelimitedListToStringArray(@Nullable String str):将逗号分隔的列表(例如,CSV 文件中的一行)转换为字符串数组。
  - commaDelimitedListToSet(@Nullable String str):将逗号分隔的列表(例如,CSV 文件中的一行)转换为一个字符串 Set。
  - collectionToDelimitedString(@Nullable Collection<?> coll, String delim, String prefix, String suffix):将集合转换为分隔字符串(例如 CSV),coll 表示被转换的集合,delim 表示分隔符,prefix 表示转换后的前缀字符,suffix 表示转换后的后缀字符。
  - collectionToDelimitedString(@Nullable Collection<?> coll, String delim):将集合转换为分隔字符串,返回一个新的字符串。prefix 和 suffix 都为空字符串。
  - collectionToCommaDelimitedString(@Nullable Collection<?> coll):将集合转换为分隔字符串,返回一个新的字符串。分隔符为逗号,无 prefix 和 suffix。
  - arrayToDelimitedString(@Nullable Object[] arr, String delim):将字符串数组转换为分隔字符串,返回一个新的字符串。

- 截断操作:
- String truncate(CharSequence charSequence, int threshold):截断提供的 CharSequence。如果 CharSequence 的长度大于阈值,则此方法返回 CharSequence(高达阈值)的子序列,并附加后缀"(截断的)…".否则,此方法返回 CharSequence.toString()。
- truncate(CharSequence charSequence):截断提供的 CharSequence,底层调用 truncate(CharSequence charSequence, int threshold),阈值为 100。

- 统计与匹配操作:
  - countOccurrencesOf(String str, String sub):计算子字符串 sub 在字符串 str 中的出现次数。
  - substringMatch(CharSequence str, int index, CharSequence substring):测试给定字符串是否与给定索引处的给定子字符串匹配,返回一个布尔值。
  - matchesCharacter(@Nullable String str, char singleCharacter):测试指定的字符串是否与指定的单个字符匹配,返回一个布尔值。

```java
System.out.println("================= 判空操作 =================");
System.out.println(StringUtils.hasLength("")); // false
System.out.println(StringUtils.hasText(null)); // false
System.out.println(StringUtils.hasText("")); // false
System.out.println(StringUtils.hasText("  ")); // false
System.out.println(StringUtils.hasText("123")); // true
System.out.println(StringUtils.hasText(" 123 ")); // true

System.out.println("================= 判断是否包含空字符串 =================");
System.out.println(StringUtils.containsWhitespace(" ")); // true
System.out.println(StringUtils.containsWhitespace(" 123")); // true
System.out.println(StringUtils.containsWhitespace("123 ")); // true
System.out.println(StringUtils.containsWhitespace(" 123 ")); // true
System.out.println(StringUtils.containsWhitespace("123")); // false
System.out.println(StringUtils.containsWhitespace(String.join("", "123"))); // false

System.out.println("================= 去除空格 =================");
System.out.println(StringUtils.trimAllWhitespace(" 123")); // 123
System.out.println(StringUtils.trimAllWhitespace("123 ")); // 123
System.out.println(StringUtils.trimAllWhitespace(" 123 ")); // 123
System.out.println(StringUtils.trimLeadingCharacter("##123###",'#')); // 123###
System.out.println(StringUtils.trimTrailingCharacter("##123###",'#')); // ##123

System.out.println("================= 大小写转换 =================");
System.out.println(StringUtils.capitalize("abc")); // Abc
System.out.println(StringUtils.capitalize("aBC")); // ABC
System.out.println(StringUtils.capitalize("Abc")); // Abc
System.out.println(StringUtils.uncapitalize("abc")); // abc
System.out.println(StringUtils.uncapitalize("aBC")); // aBC
System.out.println(StringUtils.uncapitalize("Abc")); // abc
System.out.println(StringUtils.uncapitalizeAsProperty("Hello World!")); // hello World!

System.out.println("================= 单引号拼接 =================");
System.out.println(StringUtils.quote("hello world!")); // 'hello world!'
System.out.println(StringUtils.quote("'hello world!'")); // ''hello world!''
System.out.println(StringUtils.quoteIfString(new String("hello world!"))); // 'hello world!'
System.out.println(StringUtils.quoteIfString(new Object())); // java.lang.Object@621be5d1


System.out.println("================= 判断前缀和后缀 =================");
System.out.println(StringUtils.startsWithIgnoreCase("hello world!","xx")); // false
System.out.println(StringUtils.startsWithIgnoreCase("hello world!","h")); // true
System.out.println(StringUtils.startsWithIgnoreCase("hello world!","he")); // true
System.out.println(StringUtils.endsWithIgnoreCase("hello world!","!!")); // false
System.out.println(StringUtils.endsWithIgnoreCase("hello world!","ld!")); // true
System.out.println(StringUtils.endsWithIgnoreCase("hello world!","!")); // true

System.out.println("================= 替换操作 =================");
System.out.println(StringUtils.replace("hello world!","world","WORLD")); // hello WORLD!

System.out.println("================= 字符串删除 =================");
System.out.println(StringUtils.delete("hello world! hello everyone!","!!")); // hello world! hello everyone!
System.out.println(StringUtils.delete("hello world! hello everyone!","hello")); //  world!  everyone!
System.out.println(StringUtils.deleteAny("hello world! hello everyone!","h")); // ello world! ello everyone!


System.out.println("================= 分割操作 =================");
System.out.println(Arrays.toString(StringUtils.tokenizeToStringArray("1,,2,3,,4, 5 ", ","))); // [1, 2, 3, 4, 5]
System.out.println(Arrays.toString(StringUtils.tokenizeToStringArray("1,2,3,4, 5 ", ",",true,true))); // // [1, 2, 3, 4, 5]
System.out.println(Arrays.toString(StringUtils.delimitedListToStringArray("1,,2,3,,4, 5 ", ","))); // [1, , 2, 3, , 4,  5 ]
System.out.println(Arrays.toString(StringUtils.delimitedListToStringArray("1,\r", ","))); // ]
System.out.println(Arrays.toString(StringUtils.delimitedListToStringArray("1,,2,3,,4, 5 \r", ",","\r")));


System.out.println("================= 转换操作 =================");
System.out.println(Arrays.toString(StringUtils.commaDelimitedListToStringArray("1,2,3,4,5"))); // [1, 2, 3, 4, 5]
System.out.println(StringUtils.commaDelimitedListToSet("1,2,3,4,5")); // [1, 2, 3, 4, 5]
System.out.println(StringUtils.collectionToDelimitedString(List.of("1","2","3"),",")); // 1,2,3
System.out.println(StringUtils.arrayToDelimitedString(List.of("1","2","3").toArray(),",")); // 1,2,3

System.out.println("================= 截断操作 =================");
System.out.println(StringUtils.truncate("hello world!",3)); // hel (truncated)...
System.out.println(StringUtils.truncate("hello world!",20)); // hello world!
System.out.println(StringUtils.truncate("hello world!")); // hello world!

System.out.println("================= 统计与匹配操作 =================");
System.out.println(StringUtils.countOccurrencesOf("hello world","l")); // 3
System.out.println(StringUtils.countOccurrencesOf("hello world","!")); // 0
System.out.println(StringUtils.substringMatch("hello world",1,"h")); // false
System.out.println(StringUtils.substringMatch("hello world",1,"e")); // true
System.out.println(StringUtils.matchesCharacter("hello world",'l')); // false
System.out.println(StringUtils.matchesCharacter("hello",'h')); // false
System.out.println(StringUtils.matchesCharacter("h",'h')); // true
```

## 2.NumberUtils

NumberUtils 是 Spring Framework 提供的一个工具类,用于执行数字(Number)相关的操作。该类包含一些方法,可以将字符串转换为数字,比较数字大小,以及其他一些数字相关的功能。NumberUtils 常见方法如下:

- `convertNumberToTargetClass(Number number, Class<T> targetClass)`:将指定的数字转换为给定目标类(NumberUtils 的泛型 T)的实例。
- `parseNumber(String text, Class<T> targetClass)`:使用相应的 decode/valueOf 方法,将指定的文本解析为给定目标类的 Number 实例。在尝试解析数字之前,修剪输入字符串中的所有空白(前导、尾随和中间字符),也支持十六进制格式的数字(以"0x"、"0x"或"#"开头)。
- `parseNumber(String text, Class<T> targetClass, @Nullable NumberFormat numberFormat)`:使用提供的 NumberFormat,将指定的文本解析为给定目标类的 Number 实例。在尝试分析数字之前修剪输入字符串。

```java
System.out.println(NumberUtils.parseNumber("123",Integer.class)); // 123
System.out.println(NumberUtils.parseNumber(" 123 ",Integer.class)); // 123
System.out.println(NumberUtils.parseNumber("0x7B",Integer.class)); // 123
System.out.println(NumberUtils.parseNumber("123",Byte.class)); // 123
System.out.println(NumberUtils.parseNumber(" 123 ",Byte.class)); // 123
System.out.println(NumberUtils.parseNumber(" 123 ",Float.class)); // 123.0
System.out.println(NumberUtils.parseNumber(" 123 ",Float.class, new DecimalFormat())); // 123.0
System.out.println(NumberUtils.parseNumber(" 123.00 ",Float.class, new DecimalFormat("#,###.##"))); // 123.0

System.out.println(NumberUtils.convertNumberToTargetClass(1,Byte.class)); // 1
System.out.println(NumberUtils.convertNumberToTargetClass(1,Short.class)); // 1
System.out.println(NumberUtils.convertNumberToTargetClass(1,Integer.class)); // 1
System.out.println(NumberUtils.convertNumberToTargetClass(1,Long.class)); // 1
System.out.println(NumberUtils.convertNumberToTargetClass(1, BigInteger.class)); // 1
System.out.println(NumberUtils.convertNumberToTargetClass(1, Float.class)); // 1.0
System.out.println(NumberUtils.convertNumberToTargetClass(1, Double.class)); // 1.0
System.out.println(NumberUtils.convertNumberToTargetClass(1, BigDecimal.class)); // 1
```

## 3.ObjectUtils

ObjectUtils 是 Spring Framework 提供的一个工具类,用于执行对象相关的操作。该类包含了一些实用的静态方法,可以处理对象的比较、空值检查以及其他一些常见的对象操作。ObjectUtils 常见方法如下:

- isCheckedException(Throwable ex):返回指定的 throwable 是否为已检查异常,返回一个布尔值。已检查异常即既不是 RuntimeException 也不是 Error。
- isCompatibleWithThrowsClause(Throwable ex, @Nullable Class<?>... declaredExceptions):检查指定的异常是否与 throws 子句中声明的指定异常类型兼容,返回一个布尔值。
- isArray(@Nullable Object obj):检查指定的对象是否是数组(object 数组还是基元数组),返回一个布尔值。基元数组是指存储基本数据类型值的数组。
- isEmpty(@Nullable Object[] array):检查指定的对象数组是否为空(为 null 或者数组长度等于 0),返回一个布尔值。
- isEmpty(@Nullable Object obj):检查一个对象是否为空,返回一个布尔值。该方法根据不同对象分为以下几种场景:
  - 如果 obj 为空直接返回 true。
  - 如果 obj 属于 Optional 实例,则返回 Optional 的 isEmpty()方法表示是否为空。
  - 如果 obj 属于 CharSequence 实例,则返回 CharSequence 的 isEmpty()方法表示是否为空。
  - 如果 obj 类实例是一个数组,则判断该数组的长度是否为 0 表示是否为空。
  - 如果 obj 属于 Collection 实例,则返回 Collection 的 isEmpty()方法表示是否为空。
  - 如果 obj 属于 Map 实例,则返回 Map 的 isEmpty()方法表示是否为空。
- unwrapOptional(@Nullable Object obj):展开可能是 Optional 对象的给定对象。如果 obj 是一个 Optional 对象且不为空,则通过 get()获取该值并返回一个新对象。
- containsElement(@Nullable Object[] array, Object element):检查指定的数组是否包含指定的元素,返回一个布尔值。
- containsConstant(Enum<?>[] enumValues, String constant, boolean caseSensitive):检查指定的枚举常量数组是否包含具有给定名称的常量,返回一个布尔值。caseSensitive 表示是否区分大小写。
- containsConstant(Enum<?>[] enumValues, String constant):检查指定的枚举常量数组是否包含具有给定名称的常量,返回一个布尔值。该方法在确定匹配时忽略大小写。
- `caseInsensitiveValueOf(E[] enumValues, String constant)`:Enum.valueOf(Class,String)的不区分大小写的替代项。Enum.valueOf(Class, String) 是一个 Java 枚举类的静态方法,用于通过枚举类和枚举常量的名称(字符串形式)获取对应的枚举常量。这个方法的作用是根据指定的枚举类和枚举常量的名称返回对应的枚举实例。
- addObjectToArray(@Nullable A[] array, @Nullable O obj, int position):将给定对象附加到给定数组,返回一个新数组,该数组由输入数组内容加上给定对象组成。position 表示添加对象的位置。
- addObjectToArray(@Nullable A[] array, @Nullable O obj):将给定对象附加到给定数组,返回一个新数组,该数组由输入数组内容加上给定对象组成。
- toObjectArray(@Nullable Object source):将指定的数组(可能是基元数组)转换为对象数组(如果需要基元包装对象)。空的源值将转换为空的 Object 数组。
- nullSafeEquals(@Nullable Object o1, @Nullable Object o2):用于比较两个对象是否相等,返回一个布尔值,同时考虑了 null 的情况。如果 o1 == o2 直接返回 true,如果 o1 或 o2 其中之一为 null 则返回 false,如果 o1.equals(o2)则返回 true,如果 o1 和 o2 的类实例都是数组则调用 arrayEquals()进行比较。
- nullSafeHash(@Nullable Object... elements):返回给定元素的哈希代码(int),该方法进行空检查。该方法会将每个元素委派给 nullSafeHashCode(Object)。与 Objects.hash(Object…)相反,此方法可以处理数组元素。
- nullSafeHashCode(@Nullable Object obj):返回给定对象的哈希代码;通常是 Object.hashCode()的值。如果对象是数组,则此方法将委托给任何 Arrays.hashCode 方法;如果对象为 null,则此方法返回 0。
- nullSafeClassName(@Nullable Object obj):确定给定对象的类名。如果 obj 为 null,则返回一个"null"字符串。
- nullSafeToString(@Nullable Object obj):返回指定对象的字符串表示形式。如果是数组,则构建内容的字符串表示形式。如果 obj 为 null,则返回一个"null"字符串。
- nullSafeToString(@Nullable Object[] array):返回指定数组内容的字符串表示形式。String 表示由数组元素的列表组成,这些元素用大括号("{}")括起来。相邻的元素由字符","(逗号后面跟着空格)分隔。如果数组为 null,则返回一个"null"字符串。
- nullSafeToString(@Nullable boolean[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable byte[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable char[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable double[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable float[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable int[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable long[] array):与 nullSafeToString(@Nullable Object[] array)类似。
- nullSafeToString(@Nullable short[] array):与 nullSafeToString(@Nullable Object[] array)类似。

```java
System.out.println(ObjectUtils.isCheckedException(new Throwable())); // true
System.out.println(ObjectUtils.isCheckedException(new RuntimeException())); // false
System.out.println(ObjectUtils.isCheckedException(new Error())); // false

System.out.println(ObjectUtils.isCompatibleWithThrowsClause(new InterruptedException(),NoSuchFieldException.class)); // false
System.out.println(ObjectUtils.isCompatibleWithThrowsClause(new RuntimeException(),NoSuchFieldException.class)); // true

int[] intArray = new int[0];
System.out.println(ObjectUtils.isArray(intArray)); // true
System.out.println(ObjectUtils.isArray(new Object[1])); // true

System.out.println(ObjectUtils.isEmpty(null)); // true
System.out.println(ObjectUtils.isEmpty(new String[0])); // true
System.out.println(ObjectUtils.isEmpty(List.of(1))); // false
System.out.println(ObjectUtils.isEmpty(Optional.empty())); // true
System.out.println(ObjectUtils.isEmpty(Optional.of(1))); // false
System.out.println(ObjectUtils.isEmpty(Set.of())); // true
System.out.println(ObjectUtils.isEmpty(Set.of(1))); // false
System.out.println(ObjectUtils.isEmpty(Map.of())); // true
System.out.println(ObjectUtils.isEmpty(Map.of("k","v"))); // false

System.out.println(ObjectUtils.unwrapOptional(new Object())); // java.lang.Object@7ab2bfe1
System.out.println(ObjectUtils.unwrapOptional(Optional.of(1))); // 1

System.out.println(ObjectUtils.containsElement(new Object[]{1,2,3,3,5},0)); // false
System.out.println(ObjectUtils.containsElement(new Object[]{1,2,3,3,5},1)); // true

enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY;
}
System.out.println(ObjectUtils.containsConstant(Day.values(),"SUNDAY")); // false
System.out.println(ObjectUtils.containsConstant(Day.values(),Day.MONDAY.name())); // true

System.out.println(Arrays.toString(ObjectUtils.addObjectToArray(new Integer[]{1, 2, 3}, 4))); // [1, 2, 3, 4]
System.out.println(Arrays.toString(ObjectUtils.addObjectToArray(new Integer[]{1, 2, 3}, 4,0))); // [4, 1, 2, 3]

System.out.println(Arrays.toString(ObjectUtils.toObjectArray(null))); // []
System.out.println(Arrays.toString(ObjectUtils.toObjectArray(new Object[1]))); // [null]

System.out.println(ObjectUtils.nullSafeEquals(1,null)); // false
System.out.println(ObjectUtils.nullSafeEquals(null,1)); // false
System.out.println(ObjectUtils.nullSafeEquals(1,"1")); // false
System.out.println(ObjectUtils.nullSafeEquals(null,null)); // true
System.out.println(ObjectUtils.nullSafeEquals(1,1)); // true
System.out.println(ObjectUtils.nullSafeEquals(List.of(1,2,3),List.of(1,2,3))); // true

System.out.println(ObjectUtils.nullSafeHash(null)); // 0
System.out.println(ObjectUtils.nullSafeHash("hello")); // 99162353
System.out.println(ObjectUtils.nullSafeHash("hello","world!")); // -2003018754
System.out.println(ObjectUtils.nullSafeHash(List.of("one","two","three").toArray())); // 219827735

Object object = null;
System.out.println(ObjectUtils.nullSafeHashCode(object)); // 0
System.out.println(ObjectUtils.nullSafeHashCode("hello")); // 99162322
System.out.println(ObjectUtils.nullSafeHashCode(1)); // 1
System.out.println(ObjectUtils.nullSafeHashCode(1.0)); // 1072693248
System.out.println(ObjectUtils.nullSafeHashCode(1L)); // 1
System.out.println(ObjectUtils.nullSafeHashCode('1')); // 49

System.out.println(ObjectUtils.nullSafeClassName(new Object())); // java.lang.Object
System.out.println(ObjectUtils.nullSafeClassName(new String())); // java.lang.String


System.out.println(ObjectUtils.nullSafeToString("hello")); // hel
System.out.println(ObjectUtils.nullSafeToString(List.of(1,2,3).toArray())); // {1, 2, 3}
```

## 4.ReflectionUtils

ReflectionUtils 是 Spring Framework 提供的一个工具类,用于简化 Java 反射的操作。该类包含了一系列静态方法,可以在运行时进行反射操作,例如获取类的字段、方法、构造器,调用方法,以及处理异常等。ReflectionUtils 包含如下方法:

- handleReflectionException(Exception ex):处理指定的反射异常。只有当目标方法预期不会引发已检查异常,或者在访问方法或字段时发生错误时,才应调用。
- handleInvocationTargetException(InvocationTargetException ex):处理指定的调用目标异常。仅当目标方法预期不会引发已检查异常时才应调用。在出现这种根本原因的情况下抛出基础 RuntimeException 或 Error。否则抛出 UndeclaredThrowableException。
- rethrowRuntimeException(Throwable ex):重新处理指定的异常,该异常可能是 InvocationTargetException 的目标异常。仅当目标方法预期不会引发已检查异常时才应调用。如果适当,将基础异常强制转换为 RuntimeException 或 Error；否则,抛出一个 UndeclaredThrowableException。
- rethrowException(Throwable throwable):重新处理指定的异常,该异常可能是 InvocationTargetException 的目标异常。仅当目标方法预期不会引发已检查异常时才应调用。
- `accessibleConstructor(Class<T> clazz, Class<?>... parameterTypes)`:获取给定类和参数的可访问构造函数,返回一个`Constructor<T>`对象。
- `makeAccessible(Constructor<?> ctor)`:使指定的构造函数可访问,必要时显式设置为可访问。只有在实际需要时才调用 setAccessible(true)方法,以避免不必要的冲突。
- `findMethod(Class<?> clazz, String name)`:尝试在提供的类上查找具有提供的名称但没有参数的方法,返回一个 Method 对象。该方法会搜索对象之前的所有超类,如果找不到任何方法,则返回 null。
- `findMethod(Class<?> clazz, String name, @Nullable Class<?>... paramTypes)`:尝试在提供的类上查找具有提供的名称和参数类型的方法,返回一个 Method 对象。该方法会搜索对象之前的所有超类,如果找不到任何方法,则返回 null。
- `invokeMethod(Method method, @Nullable Object target)`:对不带参数的提供的目标对象调用指定的方法,返回一个 Object 表示方法调用的返回值。调用静态方法时,目标对象可以为 null。抛出的异常可以通过对 handleReflectionException 的调用进行处理。
- `invokeMethod(Method method, @Nullable Object target, @Nullable Object... args)`:使用提供的参数对提供的目标对象调用指定的方法,返回一个 Object 表示方法调用的返回值。调用静态方法时,目标对象可以为 null。
- `declaresException(Method method, Class<?> exceptionType)`:
- `doWithLocalMethods(Class<?> clazz, MethodCallback mc)`:
- `doWithMethods(Class<?> clazz, MethodCallback mc)`:
- `doWithMethods(Class<?> clazz, MethodCallback mc, @Nullable MethodFilter mf)`:
- `getAllDeclaredMethods(Class<?> leafClass)`:返回一个 Method 数组。
- `getUniqueDeclaredMethods(Class<?> leafClass)`:返回一个 Method 数组。
- `getUniqueDeclaredMethods(Class<?> leafClass, @Nullable MethodFilter mf)`:返回一个 Method 数组。
- `getDeclaredMethods(Class<?> clazz)`:返回一个 Method 数组。
- `isEqualsMethod(@Nullable Method method)`:判断传入的 Method 是否是 equals 方法,返回一个布尔值。
- `isHashCodeMethod(@Nullable Method method)`:判断传入的 Method 是否是 hashCode 方法,返回一个布尔值。
- `isToStringMethod(@Nullable Method method)`:判断传入的 Method 是否是 toString 方法,返回一个布尔值。
- `isObjectMethod(@Nullable Method method)`:判断给定方法最初是否由 Object 声明,返回一个布尔值。
- `isCglibRenamedMethod(Method renamedMethod)`:按照模式"CGLIB$methodName$0",判断指定方法是否是 CGLIB"renamed"的方法。
- `makeAccessible(Method method)`:使指定的方法可访问,必要时显式设置为可访问。只有在实际需要时才调用 setAccessible(true)方法,以避免不必要的冲突。
- `findField(Class<?> clazz, String name)`:尝试在提供的类上使用提供的名称查找字段。该方法搜索对象之前的所有超类,如果找到则返回对应的 Field 对象,否则则为 null。
- `findField(Class<?> clazz, @Nullable String name, @Nullable Class<?> type)`:尝试在提供的类上查找具有提供的名称 and/or 类型的字段,返回值与 findField 一致。
- `findFieldIgnoreCase(Class<?> clazz, String name)`:尝试在提供的类上使用提供的名称查找字段,查找时会忽略字段名大小写。该方法搜索对象之前的所有超类,如果找到则返回对应的 Field 对象,否则则为 null。
- setField(Field field, @Nullable Object target, @Nullable Object value):将指定目标对象上由提供的字段对象表示的字段设置为指定值。根据 Field.set(Object,Object)语义,如果基础字段具有基础类型,则会自动展开新值。此方法不支持设置静态最终字段。
- getField(Field field, @Nullable Object target):在指定的目标对象上获取由提供的字段对象表示的字段。根据 Field.get(Object)语义,如果基础字段具有基础类型,则会自动包装返回的值。
- `doWithLocalFields(Class<?> clazz, FieldCallback fc)`:
- `doWithFields(Class<?> clazz, FieldCallback fc)`:
- `doWithFields(Class<?> clazz, FieldCallback fc, @Nullable FieldFilter ff)`:
- `shallowCopyFieldState(final Object src, final Object dest)`:xxx。
- `isPublicStaticFinal(Field field)`:判断指定字段是否为`public static final`常量,返回一个布尔值。

## 5.StreamUtils

StreamUtils 是 Spring 提供用于处理流的抽象工具类。该类的 copy 方法与 FileCopyUtils 中定义的方法类似,只是完成后所有受影响的流都保持打开状态。所有复制方法都使用 8192 字节的块大小。主要用于 Spring 框架内部使用,但也适用于应用程序代码。

- copy(byte[] in, OutputStream out):将指定的 byte[]的内容复制到指定的 OutputStream 中,复制完成后保持 Stream 打开。
- copy(String in, Charset charset, OutputStream out):将给定字符串的内容复制到指定的 OutputStream,复制完成后保持 Stream 打开。
- copy(InputStream in, OutputStream out):将给定 InputStream 的内容复制到给定 OutputStream,返回复制的字节数(int 类型)。该方法在复制完成后保持 Stream 打开。
- copyRange(InputStream in, OutputStream out, long start, long end):将给定 InputStream 的范围(start 和 end)内容复制到给定 OutputStream。如果指定的范围超过 InputStream 的长度,则会复制到流的末尾,并返回实际复制的字节数,该方法在复制完成后保持 Stream 打开。
- copyToString(@Nullable InputStream in, Charset charset):将给定 InputStream 的内容复制到字符串中,复制完成后保持 Stream 打开。
- copyToString(ByteArrayOutputStream baos, Charset charset):将给定 ByteArrayOutputStream 的内容复制到字符串中。这是一个 new String(baos.toByteArray(), charset)的等价物。
- copyToByteArray(@Nullable InputStream in):将指定的 InputStream 内容复制到新的 byte 数组中。该方法本质上调用了 InputStream.readAllBytes()复制内容到新的 byte 数组上。
- drain(InputStream in):排出指定 InputStream 的剩余内容。
- nonClosing(InputStream in):返回给定 InputStream 的一个实例(NonClosingInputStream 间接继承自 InputStream,重写了其 close 方法,但 close 不包含任何逻辑),调用 close()不会关闭流。
- OutputStream nonClosing(OutputStream out):返回给定 OutputStream 的一个实例(NonClosingOutputStream 间接继承自 OutputStream,重写了其 close 方法,但 close 不包含任何逻辑),调用 close()不会关闭流。

```java
byte[] bytes = "hello world!".getBytes(StandardCharsets.UTF_8);
// 创建一个byte数组输出流,用于将数据写入到byte数组中
OutputStream outputStream01 = new ByteArrayOutputStream();
// 将bytes[]的内容复制到OutputStream中
StreamUtils.copy(bytes, outputStream01);
// ByteArrayOutputStream转String输出
System.out.println(((ByteArrayOutputStream) outputStream01).toString(StandardCharsets.UTF_8)); // hello world!

OutputStream outputStream02 = new ByteArrayOutputStream();
// 将字符串的内容复制到OutputStream中
StreamUtils.copy("hello world!", StandardCharsets.UTF_8, outputStream02);
System.out.println(((ByteArrayOutputStream) outputStream02).toString(StandardCharsets.UTF_8)); // hello world!

// 创建一个byte数组输入流,用于从byte数组中读取数据
InputStream inputStream01 = new ByteArrayInputStream(bytes);
OutputStream outputStream03 = new ByteArrayOutputStream();
StreamUtils.copy(inputStream01, outputStream03);
System.out.println(((ByteArrayOutputStream) outputStream03).toString(StandardCharsets.UTF_8)); // hello world!

InputStream inputStream02 = new ByteArrayInputStream(bytes);
OutputStream outputStream04 = new ByteArrayOutputStream();
// 复制InputStream从的0至最后一位(不包含最后一位)的内容到OutputStream
StreamUtils.copyRange(inputStream02, outputStream04, 0, bytes.length - 2);
System.out.println(((ByteArrayOutputStream) outputStream04).toString(StandardCharsets.UTF_8)); // hello world

InputStream inputStream03 = new ByteArrayInputStream(bytes);
// 将指定的 InputStream 内容复制到字符串中
System.out.println(StreamUtils.copyToString(inputStream03, StandardCharsets.UTF_8)); // hello world!

ByteArrayInputStream inputStream04 = new ByteArrayInputStream(bytes);
// 将指定的 ByteArrayInputStream 内容复制到字符串中
System.out.println(StreamUtils.copyToString(inputStream04, StandardCharsets.UTF_8)); // hello world!

InputStream inputStream05 = new ByteArrayInputStream(bytes);
// 将指定的 InputStream内容复制到bytes[]中
byte[] newBytes = StreamUtils.copyToByteArray(inputStream05);
System.out.println(new String(newBytes, StandardCharsets.UTF_8)); // hello world!

InputStream inputStream06 = new ByteArrayInputStream(bytes);
byte[] readBytes01 = new byte[5];
// 读取InputStream从0到5范围的内容到bytes数组中
inputStream06.read(readBytes01,0,5);
System.out.println(new String(readBytes01, StandardCharsets.UTF_8)); // hello
// 排出指定 InputStream 的剩余内容,返回剩余内容长度
int drain = StreamUtils.drain(inputStream06);
System.out.println(drain); // 7
System.out.println(StreamUtils.copyToString(inputStream06, StandardCharsets.UTF_8)); // 空字符串
```

## 6.Assert

在 Spring 框架中,Assert 类是一个用于执行断言检查的实用工具类。它提供了一系列的静态方法,用于检查指定的条件是否为真,如果条件不满足,将抛出 IllegalArgumentException 异常。Assert 常用方法如下:

- state(boolean expression, String message):断言一个布尔表达式,如果该表达式的计算结果为 false,则抛出 IllegalStateException,message 表示异常信息。
- `state(boolean expression, Supplier<String> messageSupplier)`:断言一个布尔表达式,如果该表达式的计算结果为 false,则抛出 IllegalStateException。messageSupplier 表示一个异常信息提供者函数。
- isTrue(boolean expression, String message):断言一个布尔表达式是否为 true,为 false 将抛出 IllegalStateException,message 表示异常信息。
- `isTrue(boolean expression, Supplier<String> messageSupplier)`:断言一个布尔表达式是否为 true,为 false 将抛出 IllegalStateException,messageSupplier 表示一个异常信息提供者函数。
- isNull(@Nullable Object object, String message):断言一个对象是否为空,不为空将 IllegalStateException,message 表示异常信息。
- `isNull(@Nullable Object object, Supplier<String> messageSupplier)`:断言一个对象是否为空,不为空将抛出 IllegalStateException,messageSupplier 表示一个异常信息提供者函数。
- notNull(@Nullable Object object, String message):断言一个对象不为空,为空时将抛出 IllegalStateException,message 表示异常信息。
- `notNull(@Nullable Object object, Supplier<String> messageSupplier)`:断言一个对象不为空,为空时将抛出 IllegalStateException,messageSupplier 表示一个异常信息提供者函数。
- hasLength(@Nullable String text, String message):断言给定的字符串不为空(不能为 null 也不能为空字符串),为空时将抛出 IllegalStateException,message 表示异常信息。
- `hasLength(@Nullable String text, Supplier<String> messageSupplier)`:断言给定的字符串不为空(不能为 null 也不能为空字符串),为空时将抛出 IllegalStateException。
- hasText(@Nullable String text, String message):断言给定的字符串包含有效的文本内容(字符串不能为 null,并且必须至少包含一个非空白字符)。
- `hasText(@Nullable String text, Supplier<String> messageSupplier)`:断言给定的字符串包含有效的文本内容(字符串不能为 null,并且必须至少包含一个非空白字符)。
- doesNotContain(@Nullable String textToSearch, String substring, String message):断言给定的文本不包含给定的子字符串,若包含则抛出 IllegalArgumentException。
- `doesNotContain(@Nullable String textToSearch, String substring, Supplier<String> messageSupplier)`:断言给定的文本不包含给定的子字符串,若包含则抛出 IllegalArgumentException。
- notEmpty(@Nullable Object[] array, String message):断言数组不为空(不为 null,并且至少包含一个元素),若为空则抛出 IllegalArgumentException。
- `notEmpty(@Nullable Object[] array, Supplier<String> messageSupplier)`:断言数组不为空(不为 null,并且至少包含一个元素),若为空则抛出 IllegalArgumentException。
- noNullElements(@Nullable Object[] array, String message):断言数组不包含 null 元素,如果数组包含 null 元素则抛出 IllegalArgumentException。
- `noNullElements(@Nullable Object[] array, Supplier<String> messageSupplier)`:断言数组不包含 null 元素,如果数组包含 null 元素则抛出 IllegalArgumentException。
- notEmpty(@Nullable Collection<?> collection, String message):断言集合不为空,为空则抛出 IllegalArgumentException。
- `notEmpty(@Nullable Collection<?> collection, Supplier<String> messageSupplier)`:断言集合不为空,为空则抛出 IllegalArgumentException。
- `noNullElements(@Nullable Collection<?> collection, String message)`:断言集合不包含 null 元素,若包含则抛出 IllegalArgumentException。
- `noNullElements(@Nullable Collection<?> collection, Supplier<String> messageSupplier)`:断言集合不包含 null 元素,若包含则抛出 IllegalArgumentException。
- `notEmpty(@Nullable Map<?, ?> map, String message)`:断言 Map 不为空,为空则抛出 IllegalArgumentException。
- `notEmpty(@Nullable Map<?, ?> map, Supplier<String> messageSupplier)`:断言 Map 不为空,为空则抛出 IllegalArgumentException。
- `isInstanceOf(Class<?> type, @Nullable Object obj)`:断言所提供的对象(obj)是所提供类的实例。
- `isInstanceOf(Class<?> type, @Nullable Object obj, String message)`:断言所提供的对象(obj)是所提供类的实例。
- `isInstanceOf(Class<?> type, @Nullable Object obj, Supplier<String> messageSupplier)`:断言所提供的对象(obj)是所提供类的实例。
- `isAssignable(Class<?> superType, Class<?> subType)`:断言 superType.isAssignableFrom(subType)为 true。
- `isAssignable(Class<?> superType, @Nullable Class<?> subType, String message)`:断言 superType.isAssignableFrom(subType)为 true,即一个类是否可以赋值给另一个类。
- `isAssignable(Class<?> superType, @Nullable Class<?> subType, Supplier<String> messageSupplier)`:断言 superType.isAssignableFrom(subType)为 true。

```java
Assert.state(true, "success");
Assert.state(false, "error"); // 终止,抛出java.lang.IllegalStateException

Assert.isTrue(true, "success");
Assert.isTrue(false, () -> "error"); // 终止,抛出java.lang.IllegalStateException

Assert.isNull(null, "success");
Assert.isNull(111, () -> "error"); // 终止,抛出java.lang.IllegalStateException

Assert.notNull(111, "success");
Assert.notNull(null, "error"); // 终止,抛出java.lang.IllegalStateException

Assert.hasLength("hello", "success");
Assert.hasLength("", "error"); // 终止,抛出java.lang.IllegalStateException
Assert.hasLength(null, "error"); // 终止,抛出java.lang.IllegalStateException

Assert.hasText("hello", "success");
Assert.hasText(" ", "error"); // 终止,抛出java.lang.IllegalStateException
Assert.hasText("", "error"); // 终止,抛出java.lang.IllegalStateException

Assert.doesNotContain("hello world!", "x", "success");
Assert.doesNotContain("hello world!", "hello", "error"); // 终止,抛出java.lang.IllegalStateException


Assert.notEmpty(List.of(1, 2).toArray(), "success");
Assert.notEmpty(List.of().toArray(), "error"); // 终止,抛出java.lang.IllegalStateException

Assert.noNullElements(List.of(1, 2).toArray(), "success");
List<Object> objects = new ArrayList<>();
objects.add(null);
objects.add(1);
objects.add(2);
Assert.noNullElements(objects.toArray(), "error"); // 终止,抛出java.lang.IllegalStateException

Assert.notEmpty(List.of(1, 2), "success");
Assert.notEmpty(List.of(), "error"); // 终止,抛出java.lang.IllegalStateException

Assert.noNullElements(List.of(1, 2, 3), "success");
List<Object> collection = new ArrayList<>();
collection.add(null);
collection.add(1);
collection.add(2);
Assert.noNullElements(collection, "error"); // 终止,抛出java.lang.IllegalStateException

Assert.notEmpty(Map.of("k", "v"), "success");
Assert.notEmpty(Map.of(), "error"); // 终止,抛出java.lang.IllegalStateException

Assert.isInstanceOf(String.class, "hello!", "success");
Assert.isInstanceOf(Integer.class, "hello!", "error"); // 终止,抛出java.lang.IllegalStateException

// Integer是Number的子类
Assert.isAssignable(Number.class, Integer.class, "success");
Assert.isAssignable(String.class, Integer.class, "error"); // 终止,抛出java.lang.IllegalStateException
```

## 7.CollectionUtils

CollectionUtils 是 Spring 内部的一个抽象工具类,提供了一些便利的静态方法,用于操作集合类(Collection)和 Map 类。CollectionUtils 常用方法如下:

- `isEmpty(@Nullable Collection<?> collection)`:判断 Collection(集合)是否为 null 或为空,返回一个布尔值。
- `isEmpty(@Nullable Map<?, ?> map)`:判断 Map 是否为 null 或为空,返回一个布尔值。
- `newHashMap(int expectedSize)`:创建一个指定容量(expectedSize)的 HashMap。
- `newLinkedHashMap(int expectedSize)`:创建一个指定容量(expectedSize)的 LinkedHashMap。
- arrayToList(@Nullable Object source):将提供的数组转换为 List,基础类型的数组将转换为适当包装类型的 List。该方法底层调用 Arrays.asList()将数组转换为 List,相较于 Arrays.asList()该方法支持 Object 类型,source 可能是运行时的 Object[]或基础类型数组。如果 source 为 null 则创建一个空的 List。
- `mergeArrayIntoCollection(@Nullable Object array, Collection<E> collection)`:将指定的数组合并到指定的 Collection 中。
- `mergePropertiesIntoMap(@Nullable Properties props, Map<K, V> map)`:将指定的 Properties 对象合并到指定的 Map 中。
- `contains(@Nullable Iterator<?> iterator, Object element)`:检查指定的迭代器是否包含指定的元素,返回一个布尔值。
- `contains(@Nullable Enumeration<?> enumeration, Object element)`:检查指定的枚举是否包含指定的元素。
- `containsInstance(@Nullable Collection<?> collection, Object element)`:检查指定的集合是否包含指定的元素实例,返回一个布尔值。强制指定的实例存在,而不是对相等的元素也返回 true。
- `containsAny(Collection<?> source, Collection<?> candidates)`:检查两个集合是否有交集,如果 candidates 中的任何元素包含在 source 中,则返回 true,否则返回 false。
- `findFirstMatch(Collection<?> source, Collection<E> candidates)`:返回包含在 source 中的 candidate 中的第一个元素。如果 source 中不存在 candidates 中的任何元素,则返回 null。
- `findValueOfType(Collection<?> collection, @Nullable Class<T> type)`:在指定集合中查找指定类型的单个值。
- `findValueOfType(Collection<?> collection, Class<?>[] types)`:在给定集合中查找给定类型之一的单个值,在集合中搜索第一种类型的值,然后搜索第二种类型的数值。
- `hasUniqueObject(Collection<?> collection)`:确定给定集合是否仅包含单个唯一对象,返回一个布尔值。
- `findCommonElementType(Collection<?> collection)`:查找给定集合的公共元素类型(如果存在),返回一个 Class 对象。
- `firstElement(@Nullable Set<T> set)`:使用 SortedSet.first()或使用迭代器检索给定 Set 的第一个元素。
- `firstElement(@Nullable List<T> list)`:检索给定列表的第一个元素,访问零索引。
- `lastElement(@Nullable Set<T> set)`:使用 SortedSet.last()或以其他方式迭代所有元素(假设是 LinkedSet),检索给定集合的最后一个元素。
- `lastElement(@Nullable List<T> list)`:检索给定列表的最后一个元素。
- `toArray(Enumeration<E> enumeration, A[] array)`:将给定枚举中的元素添加到给定类型的数组中,枚举元素必须可分配给给定数组的类型。返回的数组将是与给定数组不同的实例。
- `toIterator(@Nullable Enumeration<E> enumeration)`:将枚举转为 Iterator。
- `toMultiValueMap(Map<K, List<V>> targetMap)`:将 Map 转为 MultiValueMap(具有多个值的 Map 结构)。
- `unmodifiableMultiValueMap(MultiValueMap<? extends K, ? extends V> targetMap)`:将 Map 转为不可修改的 MultiValueMap(具有多个值的 Map 结构)。

```java
System.out.println(CollectionUtils.isEmpty(List.of())); // true
System.out.println(CollectionUtils.isEmpty(List.of(1))); // false
System.out.println(CollectionUtils.isEmpty(Map.of())); // true
System.out.println(CollectionUtils.isEmpty(Map.of("key", "value"))); // false

System.out.println(CollectionUtils.newHashMap(8)); // {}
System.out.println(CollectionUtils.newLinkedHashMap(8)); // {}

int[] intArray = {3, 4};
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
CollectionUtils.mergeArrayIntoCollection(intArray, list);
System.out.println(list); // [1, 2, 3, 4]


Properties properties = new Properties();
properties.setProperty("prop", "prop-value");
Map<String, String> map = new HashMap<>();
map.put("key", "key-value");
CollectionUtils.mergePropertiesIntoMap(properties, map);
System.out.println(map); // {prop=prop-value, key=key-value}

System.out.println(CollectionUtils.contains(List.of(1, 2, 3).iterator(), 0)); // false
System.out.println(CollectionUtils.contains(List.of(1, 2, 3).iterator(), 1)); // true


Vector<String> vector = new Vector<>();
vector.add("A");
vector.add("B");
vector.add("C");
System.out.println(CollectionUtils.contains(vector.elements(), "A")); // true
System.out.println(CollectionUtils.contains(vector.elements(), "Z")); // false

Object o1 = (Object) new String("hello world!");
Collection<Object> collection01 = List.of(o1, (Object) new ArrayList<>(), new HashMap<>());
System.out.println(CollectionUtils.containsInstance(collection01, new String())); // false
System.out.println(CollectionUtils.containsInstance(collection01, o1)); // true

System.out.println(CollectionUtils.containsAny(List.of(1, 2, 3), List.of(4, 5))); // false
System.out.println(CollectionUtils.containsAny(List.of(1, 2, 3), List.of(4, 5, 3))); // true
System.out.println(CollectionUtils.containsAny(List.of(1, 2, 3), List.of(4, 5, 3, 2, 1))); // true

System.out.println(CollectionUtils.findFirstMatch(List.of(1, 2, 3), List.of(4, 5))); // null
System.out.println(CollectionUtils.findFirstMatch(List.of(1, 2, 3), List.of(4, 5, 3))); // 3
System.out.println(CollectionUtils.findFirstMatch(List.of(1, 2, 3), List.of(4, 5, 6, 2, 1))); // 2

Collection<Object> collection02 = List.of(o1, (Object) List.of(1, 2, 3), Map.of("k1", "v1"));
System.out.println(CollectionUtils.findValueOfType(collection02, String.class)); // hello world!
System.out.println(CollectionUtils.findValueOfType(collection02, List.class)); // [1, 2, 3]
System.out.println(CollectionUtils.findValueOfType(collection02, Map.class)); // {k1=v1}

Class[] types = {String.class, List.class};
System.out.println(CollectionUtils.findValueOfType(collection02, types)); // hello world!

System.out.println(CollectionUtils.hasUniqueObject(List.of(1, 2, 3))); // false
System.out.println(CollectionUtils.hasUniqueObject(List.of(1))); // true

System.out.println(CollectionUtils.findCommonElementType(List.of((Object) new String(), new ArrayList()))); // null
System.out.println(CollectionUtils.findCommonElementType(List.of((Object) new String(), new String()))); // class java.lang.String

System.out.println(CollectionUtils.firstElement(Set.of(1, 2, 3))); // 1
System.out.println(CollectionUtils.firstElement(List.of(1, 2, 3))); // 1

System.out.println(CollectionUtils.lastElement(Set.of(1, 2, 3))); // 3
System.out.println(CollectionUtils.lastElement(List.of(1, 2, 3))); // 3

Vector<Integer> integerVector = new Vector<>();
integerVector.add(1);
integerVector.add(2);
System.out.println(Arrays.toString(CollectionUtils.toArray(integerVector.elements(), new Integer[0]))); // [1, 2]

List<String> iteratorList = new ArrayList<>();
CollectionUtils.toIterator(vector.elements()).forEachRemaining(iteratorList::add);
System.out.println(iteratorList); // [A, B, C]

// 将Map转为一个具有多个值的Map结构
MultiValueMap<String, Integer> multiValueMap = CollectionUtils.toMultiValueMap(Map.of("k1", List.of(1, 2, 3)));
System.out.println(multiValueMap); // {k1=[1, 2, 3]}
// 将MultiValueMap设置为不可变,返回一个不可变的MultiValueMap,无法进行添加、删除操作
System.out.println(CollectionUtils.unmodifiableMultiValueMap(multiValueMap)); // {k1=[1, 2, 3]}
```

## 8.ResourceUtils

ResourceUtils 是一个工具类,用于处理资源(Resource)的相关操作。资源可以是类路径下的文件、URL、文件系统中的文件等。ResourceUtils 常用方法如下:

- getFile(String resourceLocation):将给定的资源位置解析为 java.io.File,即解析为文件系统中的文件。不检查文件是否实际存在；只需返回给定位置对应的文件。
- getFile(URL resourceUrl):将给定的资源 URL 解析为 java.io.File,即解析为文件系统中的文件。
- getFile(URL resourceUrl, String description):将给定的资源 URL 解析为 java.io.File,即解析为文件系统中的文件。description 表示创建 URL 的原始资源的描述(例如,类路径位置)。
- getFile(URI resourceUri):将给定的资源 URI 解析为 java.io.File,即解析为文件系统中的文件。
- File getFile(URI resourceUri, String description):将给定的资源 URI 解析为 java.io.File,即解析为文件系统中的文件。description 表示创建 URL 的原始资源的描述(例如,类路径位置)。
- getURL(String resourceLocation):将给定的资源位置解析为 java.net.URL。不检查 URL 是否实际存在；简单地返回给定位置将对应的 URL。
- isUrl(@Nullable String resourceLocation):返回给定的资源位置是 URL：特殊的类路径伪 URL 还是标准 URL。
- isFileURL(URL url):确定给定的 URL 是否指向文件系统中的资源,即具有协议 file、vfsfile 或 vfs,返回一个布尔值。
- isJarURL(URL url):确定给定的 URL 是否指向 jar 文件中的资源——例如,URL 是否具有协议 jar、war、zip、vfszip 或 wsjar,返回一个布尔值。
- isJarFileURL(URL url):确定给定的 URL 是否指向 jar 文件本身,即具有协议 file 并以.jar 扩展名结尾,返回一个布尔值。
- extractJarFileURL(URL jarUrl):从给定的 URL 中提取实际 jar 文件的 URL(可能指向 jar 文件中的资源或 jar 文件本身)。
- extractArchiveURL(URL jarUrl):从给定的 jar/war URL(可能指向 jar 文件中的资源或 jar 文件本身)中提取最外层存档的 URL。
- toURI(URL url):为给定的 URL 创建一个 URI 实例,首先用%20URI 编码替换空格。
- toURI(String location):为给定位置 String 创建一个 URI 实例,首先将空格替换为%20URI 编码。
- toRelativeURL(URL root, String relativePath):为给定的根 URL 和相对路径创建一个 URL 实例,通过 URI 构造,然后进行 URL 转换。

```java

```

## 9.IdGenerator

IdGenerator 是 Spring 提供用于生成通用唯一标识符(UUID)的函数式接口,该接口仅提供了 generateId()用于生成 UUID。IdGenerator 提供了三种实现:

- JdkIdGenerator:JDK 内置的 IdGenerator,其内部调用了 UUID.randomUUID()生成 UUID。
- SimpleIdGenerator:一个简单的 IdGenerator,从 1 开始递增到 Long.MAX_VALUE,然后翻转。SimpleIdGenerator 内部通过 UUID 实例生成 UUID,使用 AtomicLong 来维护 UUID 中最不显著的位,在每次生成新的 UUID 时,leastSigBits 会自增。
- AlternativeJdkIdGenerator:一个 IdGenerator,它使用 SecureRandom 作为初始种子,然后使用 Random,而不是像 JdkIdGenerator 那样每次调用 UUID.randomUUID(),这在安全的随机 id 和性能之间提供了更好的平衡。

```java
IdGenerator jdkIdGenerator = new JdkIdGenerator();
IdGenerator simpleIdGenerator = new SimpleIdGenerator();
IdGenerator alternativeJdkIdGenerator = new AlternativeJdkIdGenerator();
// jdkIdGenerator:d11a76b7-ef70-4550-b66d-9be5f1cc1b0f
System.out.println("jdkIdGenerator:" + jdkIdGenerator.generateId());
// simpleIdGenerator:00000000-0000-0000-0000-000000000001
System.out.println("simpleIdGenerator:" + simpleIdGenerator.generateId());
// alternativeJdkIdGenerator:97f40bf4-d3d6-af24-f80b-941b68529691
System.out.println("alternativeJdkIdGenerator:" + alternativeJdkIdGenerator.generateId());
```

## 10.StopWatch

org.springframework.util.StopWatch 是 Spring Framework 提供的一个用于测量时间的工具类。StopWatch(秒表)允许测量代码块的执行时间,提供了一种简便的方式来收集和输出性能统计信息。StopWatch 提供如下方法:

- StopWatch(String id):StopWatch 构造方法,接收一个 StopWatch 标识符作为参数,StopWatch 也提供了无参构造,标识符为空字符串。
- start():启动一个未命名的任务。如果在未调用此方法的情况下调用 stop()或 timing 方法,则结果是未定义的。
- start(String taskName):启动一个指定任务名称的任务。
- stop():停止当前任务。如果在不调用至少一对 start()/stop()方法的情况下调用计时方法,则结果是未定义的。
- isRunning():确定此 StopWatch 当前是否正在运行,返回一个布尔值。
- currentTaskName():获取当前执行的任务名。
- lastTaskInfo():获取最后一个任务作为 StopWatch,返回一个 TaskInfo 对象。TaskInfo 是 StopWatch 类中的内部类,包含了 taskName(任务名称)、timeNanos(任务耗时)。
- getLastTaskInfo():获取最后一个任务作为 StopWatch,返回一个 TaskInfo 对象,与 lastTaskInfo()一致。
- getLastTaskName():获取最后一个任务的名称。
- getLastTaskTimeNanos():获取最后一个任务所花费的时间(以纳秒为单位)。
- getLastTaskTimeMillis():获取最后一个任务所花费的时间(以毫秒为单位)。
- getTaskCount():获取已计时的任务数。
- getTotalTimeNanos():以纳秒为单位获取所有任务的总时间。
- getTotalTimeMillis():以毫秒为单位获取所有任务的总时间。
- getTotalTimeSeconds():以秒为单位获取所有任务的总时间。
- getTotalTime():以请求的时间单位获取所有任务的总时间(以纳秒精度为小数点)。
- prettyPrint():生成一个表,描述以秒为单位执行的所有任务(小数点精度为纳秒)。
- prettyPrint(TimeUnit timeUnit):生成一个表,描述在请求的时间单位内执行的所有任务(以纳秒精度为小数点)。
- shortSummary():获取以秒为单位的总运行时间的简短描述。

```java
StopWatch stopWatch = new StopWatch();
// 启动任务,开启计时
stopWatch.start();
// 当前线程休眠2s,模拟任务耗时
Thread.sleep(2000L);
System.out.println("isRunning:" + stopWatch.isRunning());
stopWatch.stop();
System.out.println("任务数:" + stopWatch.getTaskCount());
System.out.println("总耗时(毫秒):" + stopWatch.getTotalTimeMillis());
System.out.println(stopWatch.prettyPrint());
```

执行结果如下:

```txt
isRunning:true
任务数:1
总耗时(毫秒):2009
StopWatch '': 2.0099627 seconds
----------------------------------------
Seconds       %       Task name
----------------------------------------
2.0099627     100%
```
