在实际开发中,当请求参数或响应参数包含 LocalDateTime、LocalDate 等日期格式时,可能会出现日期格式不正确。为了解决日期格式问题可以在 ORM、模型转换、业务层、Web 框架层面进行日期格式处理。

## 1.ORM 转换日期

ORM 是距离数据源最近的一层,在一层 ORM 框架通过 SQL 语句根据实体与 SQL 表自动建立列映射关系和类型映射关系,可以自定义类型转换器处理日期格式。当数据库列类为 datetime,实体类属性可以使用 Localdatetime 或 String 映射,ORM 框架在查询结果后并自动将其转为 Java 实体,使用 String 类型后 ORM 以`yyyy-mm-dd HH:MM:ss`格式转为字符串。这种方式用于日期字段的展示,每次读写都需要进行解析和格式化,这比直接操作日期时间对象更消耗资源,而且字符串格式可能因格式不一致而引发解析错误。当实体类属性为日期类型时,由于类型问题,在 ORM 层面无法进行字符串和日期的转换操作,而新增扩展属性又较为繁琐,因此,并不推荐这种方式进行不同类型的转换。

## 2.MapStruct 转换日期

在实际开发中,一个领域模块至少由 Entity(实体模型,对应数据库列)、Req(请求模型,添加或修改时使用)、Resp(响应模型)、Query(查询模型)组成(可以理解为 VO、DO、DTO,但是职责命名更清晰)。得益于编译时生成映射代码、类型安全、零运行时依赖,MapStruct 通常用于模型之间的转换。在查询数据时通常使用 MapStruct 将 Entity 模型转为 Resp 模型,在添加或删除数据时通常使用 MapStruct 将 Req 模型转为 Entity 模型,模型之间的转换过程中可以实现日期的转换操作。在 MapStruct 有基于 Mapping 注解和自定义 Convert 两种方式实现日期格式化,其中注解适用于单个属性,而自定义 Convert 适用于全局(也支持指定某个属性)。

- 使用 Mapping 注解格式化日期:

```java
/**
 * 定义Role实体模型
 */
@Data
@AllArgsConstructor
public class RoleEntity {
    private String roleName;
    private String roleCode;
    private LocalDateTime createTime();
}

/**
 * 定义Role响应模型
 */
@Data
@AllArgsConstructor
public class RoleResp {
    private String roleName;
    private String roleCode;
    private String createTime();
}

/**
 * 定义Role Convert(转换器)
 * @Mapper注解用于定义一个接口作为映射器,它告诉MapStruct为该接口生成实现类以执行实际的对象映射逻辑。
 * - componentModel:该属性指定了生成的映射器实现类应遵循的组件模型。为spring时MapStruct
 * 会生成一个适合在Spring应用上下文中使用的映射器bean。这意味着RoleConvert会被注入到SpringIOC容器。
 * - unmappedTargetPolicy = ReportingPolicy.IGNORE:此属性定义了如何处理源对象中没有匹配目标对象
 * 属性的情况。ReportingPolicy.IGNORE意味着如果有源对象的属性没有在目标对象中找到对应的属性,
 * MapStruct将不会抛出错误或警告,而是简单地忽略这个不匹配的属性。
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleConvert {
    RoleConvert INSTANCE = Mappers.getMapper(RoleConvert.class);
    /**
     * RoleEntity模型转RoleResp模型
     * @Mapping注解用于指定源对象(source表示RoleEntity的createTime属性)属性到
     * 目标对象属性(target表示RoleResp的createTime属性)的映射关系。
     * dateFormat是一个附加的参数,用于指定日期格式的转换规则。
     * 当源对象的createTime属性是一个日期类型,并且需要按照特定格式转换到目标对象的相应属性时,
     * 这个参数就会起作用。
     * 当有多个属性转换时,需要配置多个@Mapping,比较繁琐,推荐使用自定义Converter
     */
    @Mapping(source = "createTime", target = "createTime", dateFormat = "yyyy-mm-dd HH:MM:SS")
    RoleResp toResp(RoleEntity entity);
}
```

- 自定义日期 Converter 格式化日期:

```java
/**
 * LocalDateTime Mapstruct 转换器,用于实现LocalDateTime与String之间的互转,
 * 使用@Component将当前Converter注入到IOC容器
 */
@Component
public class LocalDateTimeConverter {

    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    /**
     * LocalDateTime转LocalDateTime字符串。@Named注解用于标识映射方法名称
     *
     * @param dateTime LocalDateTime值
     * @return 转换后的LocalDateTime字符串
     */
    @Named("asString")
    public String asString(LocalDateTime dateTime) {
        System.out.println("localDateTimeToString" + dateTime);
        return dateTime != null ? dateTime.format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)) : null;
    }

    /**
     * LocalDateTime字符串转LocalDateTime
     *
     * @param dateTime LocalDateTime字符串
     * @return LocalDateTime值
     */
    public LocalDateTime asLocalDateTime(String dateTime) {
        return dateTime != null ? LocalDateTime.parse(dateTime, DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)) : null;
    }
}

/**
 * 定义Role Convert(转换器)
 * @Mapper注解用于定义一个接口作为映射器,它告诉MapStruct为该接口生成实现类以执行实际的对象映射逻辑。
 * - componentModel:该属性指定了生成的映射器实现类应遵循的组件模型。为spring时MapStruct
 * 会生成一个适合在Spring应用上下文中使用的映射器bean。这意味着RoleConvert会被注入到SpringIOC容器。
 * - unmappedTargetPolicy = ReportingPolicy.IGNORE:此属性定义了如何处理源对象中没有匹配目标对象
 * 属性的情况。ReportingPolicy.IGNORE意味着如果有源对象的属性没有在目标对象中找到对应的属性,
 * MapStruct将不会抛出错误或警告,而是简单地忽略这个不匹配的属性。
 * - uses:该属性表示MapStruct在执行类型转换时使用指定的转换器类,允许指定多个转换器类。
 */
@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    // 使用LocalDateTimeConverter
    uses = LocalDateTimeConverter.class
)
public interface RoleConvert {
    RoleConvert INSTANCE = Mappers.getMapper(RoleConvert.class);
    /**
     * 当进行模型转换时,如果源属性是LocalDateTime类型,转换时会调用LocalDateTimeConverter
     * 中的asString方法将LocalDateTime转为String,当源属性是String,转换时会调用
     * LocalDateTimeConverter的asLocalDateTime方法将String转为LocalDateTime。
     *
     * 也可以通过@Mapping注解的qualifiedByName属性指定转换时使用的方法,这个属性允许
     * 在映射过程中使用特定命名的方法来处理源属性到目标属性的转换,而不是使用默认的映射逻辑。
     * 例如:
     * @Mapping(source = "createTime", target = "createTime",qualifiedByName = "asString")
     *
     * 注意:使用qualifiedByName属性时,MapStruct会查找该方法作为映射过程的一部分。这个方法通常需要
     * 通过@Named注解来标记,以便MapStruct能够识别它是一个被资格化的映射方法。
     *
     */
    RoleResp toResp(RoleEntity entity);
}
```

使用 MapStruct 日期格式化的优缺点:

- 集中管理与复用:在 MapStruct 中集中定义日期格式化逻辑,可以让格式化规则统一管理,易于维护和调整。一旦格式化规则发生变化,只需在一个地方修改,所有使用该规则的映射都会自动更新,提高了代码的复用性和一致性。
- 类型安全:MapStruct 在编译时生成映射代码,这意味着任何日期格式不匹配或转换逻辑错误都会在编译阶段被发现,而不是运行时,这有助于提前发现问题并减少线上故障。
- 性能优化:通过编译时生成直接的代码调用(如 getter 和 setter),MapStruct 避免了运行时反射带来的性能开销。自定义的日期转换器也可以针对性地优化,减少不必要的计算或资源使用。
- 强依赖于 Mapstruct:一旦项目中不使用 Mapstruct,这种配置毫无意义。
- 配置复杂:随着映射逻辑的复杂化,尤其是涉及到多种日期格式和特殊情况处理时,配置 MapStruct 的映射规则和自定义转换器可能会变得复杂,增加了维护难度。

## 3.业务层转换日期

业务层转换日期跟 MapStruct 转换类似,只不过 MapStruct 转换是根据映射关系自动转换,而业务层需要手动转换,这种方式比较繁琐冗余,不适合集中化管理,一旦转换策略发生变化,那么所有地方都需要修改。因此实际开发中并不推荐这种方式。

## 4.Web 框架层转换日期

Web 框架层作为客户端最近的一层,不仅支持路由、请求参数等特性,也支持将响应数据(Java 对象或者流数据)转为 JSON 字符串等格式。在 SpringBoot 中,Spring MVC 中默认使用 Jackson 作为 JSON 处理器,可以轻松实现对象与 JSON 字符串的相互转换。SpringBoot 支持注解和全局配置两种方式格式化日期,注解方式适用于字段级别,全局配置适用于所有日期。在 Web 框架层转换日期虽然实现简单,支持集中式管理,存在运行时开销,而且强依赖于 JSON 库,一旦切换不同 JSON 库,就需要对其进行适配。

### 4.1 使用日期格式化

@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")

- `@JsonFormat`:该注解是 Jackson 库提供的一个注解,主要用于控制 Java 对象中日期和时间字段的序列化和反序列化格式。JsonFormat 注解属性说明如下:
  - pattern: 指定日期和时间的格式字符串。格式遵循 Java 的 SimpleDateFormat 规则。例如,yyyy-MM-dd'T'HH:mm:ss.SSSZ 表示完整的日期时间格式,包括时区信息。
  - timezone:设置时区,以影响日期时间的解析和格式化。例如,使用 UTC 或其他特定时区。
  - shape:控制序列化输出的形状,可以是 ANY(默认,根据类型决定)、STRING(总是输出字符串)、NUMBER(对于 java.util.Date,输出 Unix 时间戳)。
  - locale:指定用于格式化和解析的区域设置。这影响日期时间的本地化表示,如月份和星期的名称。
  - lenient:是否允许宽松解析。如果为 true,Jackson 在解析时会对输入格式更加宽容,允许一些小的偏差；如果为 false,则严格遵守格式。
  - withZone:在序列化时是否附带时区信息。默认为 false,但对某些类型(如 ZonedDateTime)会自动调整。
- @DateTimeFormat:该注解是 SpringMVC 提供的一个注解,用于在处理 web 请求和响应时,对日期和时间类型的字段进行格式化和解析。这个注解主要用于数据绑定,确保 HTTP 请求参数、请求头、路径变量或响应中的日期和时间数据能够正确地转换为 Java 对象中的日期类型,或者从 Java 对象转换为字符串进行响应。它广泛应用于 Spring MVC 控制器中的方法参数或返回值,以及作为模型属性的字段上。

```java
public class Event {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="Asia/Shanghai")
    private LocalDateTime createTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime eventDateTime;
}
```

### 4.2 全局日期格式化

```yaml
spring:
  # jackson配置
  jackson:
    # 日期格式
    date-format: yyyy-MM-dd HH:mm:ss
    # 时区
    time-zone: Asia/Shanghai
    # 序列化配置
    serialization:
      # 此配置项控制Jackson在遇到没有公共getter方法或标注了@JsonProperty的属性的Java Bean时的行为。
      # 默认情况下,Jackson在尝试序列化一个没有任何可序列化属性的Bean时会抛出异常。将其设置为false,
      # 指示Jackson即使Bean没有可序列化的属性也不应抛出异常,而是尽可能地序列化Bean。
      fail-on-empty-beans: false
      # 此配置项决定了Jackson在序列化日期和时间类型字段时的格式。默认情况下(即true),Jackson会将日期和
      # 时间对象(如java.util.Date)序列化为Unix时间戳(即从1970年1月1日00:00:00 UTC到现在的毫秒数)。
      # 将其设置为false,则Jackson会使用日期格式器(根据全局或字段级别的配置,如@JsonFormat指定的格式)
      # 将日期时间对象序列化为字符串形式,而不是时间戳。
      write-dates-as-timestamps: false
```

如果想根据不同日期格式,自定义不同序列化策略,可以通过自定义 Jackson ObjectMapper,根据对应日期类型选择指定序列化策略。

```java
package com.fly.core.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * @Description Jackson配置类
 * @Author zchengfeng
 * @DateTime 2024/7/13 19:45
 */
@Configuration
public class JacksonConfig {

    private static final String DEFAULT_DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    private static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd";
    private static final String DEFAULT_TIME_PATTERN = "HH:mm:ss";

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_PATTERN)));
        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_PATTERN)));
        javaTimeModule.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_PATTERN)));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_PATTERN)));
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_PATTERN)));
        javaTimeModule.addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_PATTERN)));
        objectMapper.registerModule(javaTimeModule);
        return objectMapper;
    }
}
```

在 webMVC 配置类中实现 WebMvcConfigurer 接口并重写 configureMessageConverters 方法,然后向消息转换器列表中的头部添加一个 MappingJackson2HttpMessageConverter 实例,注入 ObjectMapper 并将其作为 MappingJackson2HttpMessageConverter 的构造参数。

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    private final ObjectMapper objectMapper;

    public WebConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * WebMvcConfigurer接口中的一个方法,允许定制HTTP消息转换器(HttpMessageConverter)的集合。
     * 消息转换器负责将HTTP请求和响应的数据转换为Java对象及反向操作,确保数据能在客户端和服务器之间正确传输。
     * @param converters HTTP消息转换器列表s
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        /**
         * 将objectMapper作为构造参数传入MappingJackson2HttpMessageConverter创建一个新的实例,
         * 然后将该实例添加到HTTP消息转换器列表的头部,这意味着自定义的JSON转换器将优先于
         * Spring MVC默认提供的任何其他转换器执行。
         *
         * MappingJackson2HttpMessageConverter是Spring提供的一个消息转换器,专门用于处理JSON数据。
         * 它基于Jackson库,能够将Java对象转换为JSON字符串,以及将JSON字符串转换回Java对象
         */
        converters.addFirst(new MappingJackson2HttpMessageConverter(objectMapper));
    }
}
```
