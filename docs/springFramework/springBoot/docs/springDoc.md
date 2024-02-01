## 1.springdoc-openapi 介绍

Swagger 是一个规范(基于 OpenAPI 规范)和完整的框架,用于生成、描述、调用和可视化 RESTful 风格的 API 服务,简单来说 Swagger 可以生成 API 文档。Springfox 是一个通过扫描代码提取代码中的信息,生成 API 文档的 Java 工具库,支持丰富的 JSON API 规范标准,例如 Swagger、RAML 和 jsonapi。

springdoc-openapi 是一个使用 Spring 引导项目自动生成 API 文档的 Java 库,通过在运行时检查应用程序来根据 Spring 配置、类结构和各种注释推断 API 语义。springdoc-openapi 支持如下功能:

- OpenAPI 3。OpenAPI 3 是一种 API 描述规范，它是 Swagger 规范的最新版本。OpenAPI 3 规范定义了一种标准的方式来描述 RESTful API，包括 API 的端点、请求参数、响应信息、错误处理、安全性等各方面的细节。
- Spring-boot v3(Java 17 & Jakarta EE 9):springdoc-openapi 在 2.x 中支持 SpringBoot3.x。
- 支持 JSR-303 规范。JSR-303 是 Java 规范请求的一部分，全称为"Java Specification Request 303"，它定义了 Java 中的 Bean 校验规范，即 Bean Validation。JSR-303 于 2009 年发布，它提供了一种声明性的验证规范，用于验证 JavaBean 中的字段值是否符合预期的规则和约束。JSR-303 常用验证注解包括@NotNull、@NotBlank、@NotEmpty、@Min、@Max 等等。
- Swagger-ui 界面。
- OAuth 2。
- GraalVM native images。

添加 springdoc-openapi 依赖:

```groovy
// 在SpringMVC项目中引入springdoc-openapi与SpringBoot集成依赖
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0'

// 在SpringFlux项目中引入springdoc-openapi与SpringBoot集成依赖
implementation 'org.springdoc:springdoc-openapi-starter-webflux-ui:2.1.0'
```

### 1.1 springdoc-openapi 常见配置项说明

springdoc-openapi 重要配置如下(application.yml):

```yaml
springdoc:
  # OpenAPI文档配置
  api-docs:
    # 表示启用/v3/api-docs端点,用于暴露JSON格式的OpenAPI文档
    enabled: true
    # 配置文档端点的路径,默认为/v3/api-docs
    path: /v3/api-docs
    groups:
      # 是否对接口分组,默认false
      enabled: true
    # openapi的版本号
    version: openapi_3_0
    # 是否解析Schema对象中的属性,如果设置为true,在生成OpenAPI文档时,会解析Schema对象中的属性,并在文档中呈现出每个属性的类型、描述等信息
    # 如果设置为false,则仅呈现Schema对象的名称,不会解析其属性。默认true
    resolve-schema-properties: true

  # swagger-ui配置
  swagger-ui:
    # 表示启用/swagger-ui.html端点,提供Swagger UI界面来展示和测试API
    enabled: true
    # 用于指定Swagger UI要加载和展示的OpenAPI文档的URL,默认指向
    # https://petstore.swagger.io/v2/swagger.json来展示示例文档效果
    url: http://localhost:8080/v3/api-docs
    # 设置Swagger UI的访问路径,默认为/swagger-ui.html
    path: /swagger-ui.html
    # 用于指定一个远程的Swagger UI配置文件,Swagger UI支持通过JSON文件自定义其显示效果和行为
    config-url:
    # csrf配置
    csrf:
      # 是否启用CSRF保护,默认false
      enabled: false
    # OAuth2重定向URL
    oauth2-redirect-url:
```

### 1.2 springdoc-openapi 注解说明

- **@Tag**:用于给 API 接口添加标签(Tag),一般用于 Controller 类上。等同于 swagger2 中的@Api。@Tag 包含如下属性:
  - name:标签名称。
  - description:标签描述。
- **@Tags**:用于给控制器或接口添加多个标签(tag)。例如:`@Tags({@Tag(name = "Pets"), @Tag(name = "Animals")})`。
- **@Parameter**:用于描述接口参数,通常在@Operation 注解的 parameters 属性中或方法参数中使用,等同于 swagger2 中的@ApiImplicitParam。主要属性如下:
  - name:参数名。
  - in:参数位置,可以是 path,query,header 或 cookie。
  - description:参数描述。
  - required:参数是否必填,默认 false。
  - deprecated:参数是否过期,默认 false。
  - allowEmptyValue:参数是否允许空值,默认 false。
  - allowReserved - 是否允许传递系统保留字参数,默认 false
  - schema:参数的数据结构 Schema 对象
  - example:示例值
  - examples:示例值的 Example 对象列表
  - content:参数内容描述,主要针对 body 参数
  - hidden:是否隐藏参数,默认 false
  - style:简写样式,如 form、spaceDelimited、pipeDelimited 等
  - explode:是否将参数展开为多个参数,默认 false
  - extensions:扩展属性 Map。
- **@Parameters**:用于批量声明接口的参数列表。它可以用在 @Operation 注解中,用于替代单独的@Parameter 声明,等同于 Swagger2 中的@ApiImplicitParams。该注解包含如下属性:
  - hidden:是否隐藏。
  - extensions:扩展。

```java
@Operation(
  parameters = {
    @Parameters({
      @Parameter(
        name = "page",
        description = "页码",
        in = "query",
        schema = @Schema(type = "integer", defaultValue = "1")
      ),
      @Parameter(
      	name = "size",
        description = "页大小",
        in = "query",
        schema = @Schema(type = "integer", defaultValue = "20")
      )
    })
  }
)
```

- **@Schema**:用于定义响应结果或请求参数的模型结构,一般用于实体类或者实体类的属性,等同于 Swagger2 中的@ApiModel 或@ApiModelProperty。@Schema 包含如下属性:

  - title:模型标题,通常@Scheme 装饰模型类时使用该属性。
  - description:模型描述,通常@Schema 装饰模型类属性时使用该属性。
  - requiredMode:用于控制 required 属性的应用方式。@Schema 注解中定义了 RequiredMode.AUTO(默认值,表示由 springdoc 自动推断 required 属性的应用方式)、RequiredMode.REQUIRED(必填)、RequiredMode.NOT_REQUIRED(非必填)三种选项。
  - accessMode:accessMode 属性用于控制字段的访问级别。accessMode 接受一个 AccessMode 枚举值,可选值包括:AUTO(默认值,表示自动推断访问级别)、READ_ONLY(只读级别)、WRITE_ONLY(只写级别)、READ_WRITE(读写级别)。
  - hidden:用于控制字段或模型在文档中的隐藏状态。为 true 表示隐藏该字段,文档中不会显示该字段
  - deprecated:是否弃用。
  - defaultValue:默认值。
  - example:示例值。
  - implementation:模型实现类
  - type:模型类型。
  - format:类型格式化。
  - allowableValues:允许值,一个字符串数组。
  - pattern:正则表达式。
  - maximum/minimum:最大/最小值。
  - exclusiveMaximum/exclusiveMinimum:是否包含最大或最小边界值。
  - maxLength/minLength:最大/最小长度。

- **@Operation**:用于描述一个 API 接口的详细信息,它通常用在 controller 的方法上,等同于 Swagger2 中的@ApiOperation。@Operation 包含如下属性:

  - summary:接口简短摘要,会显示在文档标题中。
  - description:接口详细描述。
  - tags:为接口设置标签,可用于分类组织。
  - parameters:描述接口的参数列表。
  - responses:描述各种响应结果和状态码。
  - deprecated:将接口标记为弃用。
  - security:接口的安全方案列表。
  - extensions:扩展属性。

- **@ApiResponse**:用于定义接口的响应状态码和响应体,通常和@Operation 的 responses 属性一起使用,等同于 Swagger2 中的@ApiResponse 注解。该注解包含如下属性:
  - responseCode:HTTP 响应状态码,如"200"。
  - description:响应描述。
  - content:响应体内容描述,是一个 Content 对象数组,用来定义媒体类型和模式。
  - headers:响应头描述。
  - links:定义链接对象。
  - extensions:扩展属性。
- **@ApiResponses**:用于声明一组@ApiResponse。
- **@RequestBody**:用于描述一个请求体参数,该注解包含如下属性:
  - description:参数的描述。
  - required:参数是否必需,设置为 true 表示这个请求体参数是必须的。默认为 false。
  - content:内容描述。用于定义请求体参数的媒体类型(MediaType)、编码(Encoding)、示例(ExampleObject)等信息。
  - extensions:扩展属性。用于添加自定义属性。
  - hidden:是否隐藏。设置为 true 会隐藏此请求体参数。
- **@Hidden**:用于隐藏元素不在 API 文档中显示,该注解包含如下属性:
  - value:布尔类型,设置为 true 时表示隐藏该元素,默认为 false。
  - reason:隐藏的原因,文档中会显示这个原因字符串。
  - at:隐藏的粒度,可选值有:METHOD(隐藏方法)、FIELD(隐藏字段)、PARAMETER(隐藏参数)、MODEL(隐藏模型类)。
  - appliesTo:适用的场景,可选值有:SCHEMA(隐藏在模式中)、REQUEST_BODIES(隐藏在请求体中)、RESPONSES(隐藏在响应中)、HEADERS(隐藏在头部中)、PARAMETERS(隐藏在参数中)、EXTENSIONS(隐藏在扩展中)。
- **@SecurityScheme**:用于声明 API 的安全方案,比如 OAuth2, API Key 等。它通常用于@OpenAPIDefinition 注解中。该注解包含如下属性:
  - type:安全方案类型,可选的值包括 apiKey, http, oauth2, openIdConnect 等。
  - description - 对安全方案的文字描述。
  - name:安全方案的名称。
  - in:安全令牌的位置,可选 header, query, cookie。
  - scheme:安全方案模式,如"bearer"。
  - bearerFormat:提供访问令牌的格式。
  - flows:OAuth 流程设置。
  - openIdConnectUrl:OpenID 连接的配置 URL。
- **@Servers**:用于配置文档中的服务器列表信息,它通常用于@OpenAPIDefinition 中。该注解包含如下属性:

  - url:服务器 URL。
  - description:服务器描述。
  - variables:服务器变量列表,名称和默认值。

- **@Extension**:用于添加扩展属性到文档元素中。@Extension 可以用在其他注解中,为其添加额外信息,例如:`@Operation(extensions = { @Extension(name = "x-foo", value = "bar") })`。该注解包含如下属性:
  - name:扩展属性名。
  - value:扩展属性值,可以是对象或字符串。
  - parseValue:是否解析值,默认为 true 。
- **@Extensions**:用于批量声明扩展属性,等同于@Extension 的数组形式。
- **@Callback**:用于定义 Callback 对象,Callback 表示一个 API 接口完成后的回调地址,通常用于异步请求。该注解包含如下属性:
  - name:回调的名称。
  - callbackUrlExpression:回调 URL 地址表达式。
  - alias: 回调别名。
  - operation:回调操作方法。
  - extensions:扩展属性。
- **@Callbacks**:用于定义一组@Callback。

- **@Link**:用于在响应中添加链接信息。该注解包含如下属性:

  - name:链接名称。
  - operationId:链接的操作 id。
  - parameters:链接参数。
  - requestBody:链接请求体。
  - description:描述。
  - server:链接服务器。

- **@Links**:用于定义一组@Link。
- **@Header**:用于描述接口请求或响应中的 header 信息。该注解包含如下属性:

  - name:header 名称。
  - description:描述。
  - required:是否必须。
  - deprecated:是否弃用。
  - allowEmptyValue:是否允许为空值。
  - schema:header 数据结构。
  - style:样式简写,如 simple、matrix 等。
  - explode:是否展开为多个 header。
  - allowReserved:是否允许标准头信息。
  - content:内容描述。

- **@Headers**:用于定义一组@Header。

- **@ExampleObject**:用于定义示例对象,通常在@Parameter/@RequestBody 中使用,表示参数或请求体的示例值,例如:`@ExampleObject(name = "user", value = "{\"name\":\"John\"}")`。该注解包含如下属性:
  - name:示例对象名称。
  - summary:示例摘要。
  - externalValue:外部示例文件路径。
  - value:直接声明示例值。
  - mediaType:内容媒体类型。
  - fileName:文件名。
- **@ExternalDocumentation**:用于添加外部文档链接,例如:`@ExternalDocumentation(description = "Find more info here",url = "https://example.com/docs/api")`。它包含如下属性:
  - description:外部文档的描述。
  - url:外部文档的 URL 地址。
  - extensions:扩展属性。
- **@ArraySchema**:用于定义一个数组类型的 Schema。它可以表示请求参数、响应结果或对象属性是一个数组。该注解包含如下属性:

  - schema - 定义数组元素的 Schema 对象。
  - minItems:最小元素个数。
  - maxItems:最大元素个数
  - uniqueItems:元素是否唯一。

- **@ComposedSchema**:用于定义一个组合模式(Composed Schema),以实现复杂的模型组合和继承关系。该注解包含如下属性:
- allOf:指定该 schema 匹配所有给定 schema (AND 逻辑)。
- anyOf:指定该 schema 匹配任一给定 schema (OR 逻辑)。
- oneOf:指定该 schema 匹配给定 schema 中的一个 (XOR 逻辑)。
- readOnly:是否只读 schema。
- discriminatorProperty:鉴别器属性名。
- discriminatorMapping:鉴别器映射配置。
- title:schema 标题。
- multipleOf:倍数约束。
- maximum/minimum:最大值/最小值。
- exclusiveMaximum/exclusiveMinimum:是否包含边界值。
- maxLength/minLength:字符串最大/最小长度。
- pattern:正则表达式。
- maxItems/minItems:数组最大/最小项数。
- uniqueItems:数组元素是否唯一。
- maxProperties/minProperties:对象最大/最小属性数。
- required:必需属性列表。
- nullable:是否可为空。
- deprecated:是否已弃用。
- allowableValues:允许值
- schemaAttributeExtensions:schema 扩展。

## 2.自定义文档详情信息

springdoc-openapi 支持三种方式定义文档标题、描述、联系人等详细信息:

- 通过 JavaConfig 方式。向 SpringIOC 容器注入 OpenAPI 实例定义文档详细信息,向 IOC 容器注入 GroupedOpenApi 实例定义文档分组信息。
- 通过注解方式定义文档信息。在 Springdoc 中,提供了@OpenAPIDefinition 用于定义全局文档信息。
- 实现 OpenApiCustomizer 接口重写 customise 方法配置文档信息。customise 是 OpenApiCustomizer 接口提供用于自定义 OpenAPI 的方法,接收一个 OpenAPI 实例,通过 OpenAPI 实例可以配置文档详细信息。

配置完成后,由于在 application.yaml 中配置了`springdoc.api-docs.path=/v3/api-docs`和`springdoc.swagger-ui.path=/swagger-ui.html`,访问`localhost:端口/v3/api-docs`即可以 JSON 形式返回 OpenAPI 文档信息,访问`localhost:端口/swagger-ui.html`即可打开 swagger 文档界面。

### 2.1 通过 JavaConfig 方式

在 Springdoc 中,OpenAPI 类是用于构建 OpenAPI 规范（即 Swagger 规范）的核心类之一。它可以通过配置和编程方式来定义 API 的元数据,包括 API 信息、端点路径、参数、响应等,最终生成 OpenAPI 文档。
在 Springdoc 中,GroupedOpenApi 类是用于将 API 按照分组的方式进行管理的类。通过 GroupedOpenApi 类,可以将一组相关的 API 端点进行分组，并分别为每个组定义独立的 OpenAPI 规范。在大型项目中,特别是拥有多个模块或微服务的项目中非常有用,可以更好地组织和管理 API 文档。

```java
package com.fly.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.servers.ServerVariable;
import io.swagger.v3.oas.models.servers.ServerVariables;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * @Description:基于JavaConfig的方式配置Springdoc
 * @Author: zchengfeng
 * @Date: 2023/8/1 16:05
 */
@Configuration
public class SpringdocConfig {

    /**
     * 用于定义服务器实例信息list
     */
    private List<Server> servers() {
        // 服务器变量实例
        ServerVariable serverVariable = new ServerVariable()
                // 变量描述
                .description("基础请求路径")
                // 变量默认值
                ._default("xxx");

        // 用于定义服务器实例信息list
        return List.of(new Server()
                // 服务器URL地址
                .url("http://localhost:8080")
                // 服务器描述信息
                .description("localhost server")
                // 服务器变量列表
                .variables(new ServerVariables().addServerVariable("basePath", serverVariable))
        );
    }

    /**
     * 配置文档详情信息,例如标题、版本号、联系人配置等信息
     */
    private Info info() {
        // 配置文档联系人配置
        Contact contact = new Contact()
                .name("zchengfeng")
                .url("https://zchengfeng.com")
                .email("zchengfeng@example.com");

        // 配置文档详情信息,例如标题、版本号、联系人配置等信息
        Info info = new Info()
                // 文档标题
                .title("Springdoc API")
                // 文档版本号
                .version("0.0.1")
                // 文档联系人
                .contact(contact)
                // 文档描述
                .description("SpringBoot集成Springdoc文档")
                // 文档协议
                .license(new License().name("Apache 2.0").url("http://springdoc.org"));
        return info;
    }

    /**
     * 向IOC容器注入OpenAPI实例,OpenAPI用于定义 API 的元数据,包括 API 信息、端点路径、参数、响应等
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().servers(servers()).info(info());
    }

    /**
     * 分组配置,文档分组常用于业务繁杂场景下,根据不同模块或业务进行分组。在Swagger2.x中通过
     * 配置Docket实例设置分组,在Swagger3.x中则通过GroupedOpenApi配置文档分组
     */

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                // 分组名,使用@Tag注解的属性可指定分组名称,分组名称相同的@Tag将被分在一组
                .group("user")
                // 在swagger-ui中显示的分组名,也就是swagger-ui中右上角下拉框的选项
                .displayName("用户模块")
                // 匹配路径
                .pathsToMatch("/user/**")
                .build();
    }

    /**
     * 定义订单文档分组
     */
    @Bean
    public GroupedOpenApi orderApi() {
        return GroupedOpenApi.builder()
                .group("order")
                .displayName("订单模块")
                .pathsToMatch("/order/**")
                .build();
    }
}
```

### 2.2 通过注解方式定义文档信息

在 Springdoc 中,提供了@OpenAPIDefinition 用于定义全局文档信息,其效果与注入 OpenAPI 实例一致。用于 springdoc 在 2.x 版本中移除了 @GroupedOpenApi 注解,建议使用 JavaConfig 的方式配置接口分组。

```java
package com.fly.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.servers.ServerVariable;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Description:基于注解的方式配置Springdoc
 * @Author: zchengfeng
 * @Date: 2023/8/2 16:49
 */
@Configuration
@OpenAPIDefinition(
        // 用于定义服务器实例信息,接收一个Server数组
        servers = {
                @Server(
                        // 服务器URL地址
                        url = "http://localhost:8080",
                        // 服务器描述信息
                        description = "localhost server",
                        // 服务器变量列表
                        variables = {
                                @ServerVariable(name = "basePath", defaultValue = "xxx", description = "基础请求路径")
                        }
                )
        },
        // 配置文档详情信息
        info = @Info(
                // 文档标题
                title = "Springdoc API",
                // 文档版本号
                version = "0.0.1",
                // 文档联系人信息
                contact = @Contact(name = "zchengfeng", url = "https://zchengfeng.com", email = "zchengfeng@example.com"),
                // 文档描述
                description = "SpringBoot集成Springdoc文档",
                // 文档协议
                license = @License(name = "Apache 2.0", url = "http://springdoc.org")
        )
)
public class SpringdocConfigByAnnotation {

    /**
     * 分组配置,文档分组常用于业务繁杂场景下,根据不同模块或业务进行分组。在Swagger2.x中通过
     * 配置Docket实例设置分组,在Swagger3.x中则通过GroupedOpenApi配置文档分组
     */

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                // 分组名,使用@Tag注解的属性可指定分组名称,分组名称相同的@Tag将被分在一组
                .group("user")
                // 在swagger-ui中显示的分组名,也就是swagger-ui中右上角下拉框的选项
                .displayName("用户模块")
                // 匹配路径
                .pathsToMatch("/user/**")
                .build();
    }

    /**
     * 定义订单文档分组
     */
    @Bean
    public GroupedOpenApi orderApi() {
        return GroupedOpenApi.builder()
                .group("order")
                .displayName("订单模块")
                .pathsToMatch("/order/**")
                .build();
    }
}
```

### 2.2 通过接口重写方法的方式定义文档信息

在 Springdoc 中,OpenApiCustomizer 是一个功能接口,可以用于自定义修改 OpenAPI 文档的定义。OpenApiCustomizer 接口提供了 customise 方法用于自定义文档信息,该方法接收一个 OpenAPI 实例,通过 OpenAPI 实例可以配置文档详细信息。

```java
package com.fly.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.servers.ServerVariable;
import io.swagger.v3.oas.models.servers.ServerVariables;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * @Description:基于实现接口重写方法的方式配置Springdoc
 * @Author: zchengfeng
 * @Date: 2023/8/2 17:14
 */
@Configuration
public class SpringdocConfigByInterface implements OpenApiCustomizer {

    /**
     * 用于定义服务器实例信息list
     */
    private List<Server> servers() {
        // 服务器变量实例
        ServerVariable serverVariable = new ServerVariable()
                // 变量描述
                .description("基础请求路径")
                // 变量默认值
                ._default("xxx");

        // 用于定义服务器实例信息list
        return List.of(new Server()
                // 服务器URL地址
                .url("http://localhost:8080")
                // 服务器描述信息
                .description("localhost server")
                // 服务器变量列表
                .variables(new ServerVariables().addServerVariable("basePath", serverVariable))
        );
    }

    /**
     * 配置文档详情信息,例如标题、版本号、联系人配置等信息
     */
    private Info info() {
        // 配置文档联系人配置
        Contact contact = new Contact()
                .name("zchengfeng")
                .url("https://zchengfeng.com")
                .email("zchengfeng@example.com");

        // 配置文档详情信息,例如标题、版本号、联系人配置等信息
        Info info = new Info()
                // 文档标题
                .title("Springdoc API")
                // 文档版本号
                .version("0.0.1")
                // 文档联系人
                .contact(contact)
                // 文档描述
                .description("SpringBoot集成Springdoc文档")
                // 文档协议
                .license(new License().name("Apache 2.0").url("http://springdoc.org"));
        return info;
    }

    /**
     * customise是OpenApiCustomizer接口提供用于自定义OpenAPI的方法,
     * 接收一个OpenAPI参数
     */
    @Override
    public void customise(OpenAPI openApi) {
        openApi.servers(servers()).info(info());
    }

    /**
     * 分组配置,文档分组常用于业务繁杂场景下,根据不同模块或业务进行分组。在Swagger2.x中通过
     * 配置Docket实例设置分组,在Swagger3.x中则通过GroupedOpenApi配置文档分组
     */

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                // 分组名,使用@Tag注解的属性可指定分组名称,分组名称相同的@Tag将被分在一组
                .group("user")
                // 在swagger-ui中显示的分组名,也就是swagger-ui中右上角下拉框的选项
                .displayName("用户模块")
                // 匹配路径
                .pathsToMatch("/user/**")
                .build();
    }

    /**
     * 定义订单文档分组
     */
    @Bean
    public GroupedOpenApi orderApi() {
        return GroupedOpenApi.builder()
                .group("order")
                .displayName("订单模块")
                .pathsToMatch("/order/**")
                .build();
    }
}
```

## 3.将 OpenAPI 配置导入第三方文档工具

springdoc 使用 swagger 提供了文档管理、接口调试等功能,但由于 swagger 界面丑陋、不支持团队协作、无法控制接口权限等缺点,因此在实际开发中会使用更强大的 api 文档管理工具,例如 apifox、yapi 等等。集成这些工具也很简单,只需在第三方文档工具配置 OpenAPI 的文档端点路径或者上传 OpenAPI 文档文件,第三方文档工具根据 OpenAPI 的文档端点路径采用不同策略(例如定时拉取,例如每隔 5 分钟拉取一次文档信息,或者手动拉取)拉取最新的文档信息。

### 3.1 将 OpenAPI 导入到 Apifox

Apifox 是一个 API 文档、API 调试、API Mock、API 自动化测试工具,等同于 Postman + Swagger + Mock + JMeter。Swagger 导入文档到 Apifox 步骤如下:

- 主界面-->新建团队-->完成后-->新建项目(已有项目可忽略)。
- 主界面-->项目设置--> 导入数据(手动导入) 或者 导入数据(自动同步) --> 数据格式选择 OpenAPI/Swagger --> 选择 URL 导入。填写 Swagger 数据 URL(例如:http://localhost:8080/v2/api-docs)然后提交即可。注意:导入数据(自动同步) 通过手动或定时方式重新获取 Swagger 数据。

![yapi](/assets/img/spring/swagger01.png)

### 3.2 将 OpenAPI 导入 Yapi

YApi 是高效、易用、功能强大的 api 管理平台,旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API,YApi 还为用户提供了优秀的交互体验,开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理。
docker 安装 Yapi:

```shell
#################### mongo安装操作
# 安装网络插件
docker network create yapi
# 创建mongoDB数据卷挂载目录,yapi使用mongoDB存储数据
mkdir /usr/local/mongo
# 目录授权
chown -R 777 /usr/local/mongo
# 拉取mongo
docker pull mongo
# docker 启动mongo
docker run -d --name mongodb --restart always --net=yapi -p 2717:27017 -v /usr/local/mongo:/data/db -e MONGO_INITDB_DATABASE=yapi -e MONGO_INITDB_ROOT_USERNAME=yapipro -e MONGO_INITDB_ROOT_PASSWORD=yapipro1024 mongo

# 进入mongodb容器
docker exec -it mongodb /bin/bash
# 连接mongo cli
mongo localhost:27017
# 初始化数据
use admin;
# 数据库授权
db.auth("yapipro","yapipro1024");
# 创建yapi数据库
use yapi;
# 创建yapi账号密码及权限
db.createUser({user:'yapi',pwd:'yapi123456',roles:[{role:'dbAdmin',db:'yapi'},{role:'readWrite',db:'yapi'}]});
# 退出 mongo cli
exit
# 退出mongo容器
exit

#################### yapi安装操作
# 创建yapi config配置文件
mkdir /usr/local/yapi/ && cd /usr/local/yapi/
# 目录授权
chown -R 777 /usr/local/yapi/
# 创建yapi config.json
touch config.json
# 编辑config.json
vim config.json
# 内容如下:
{
   "port": "3000",
   "adminAccount": "xxx@163.com",
   "timeout":120000,
   "db": {
     "servername": "mongo",
     "DATABASE": "yapi",
     "port": 27017,
     "user": "yapi",
     "pass": "yapi123456",
     "authSource": ""
   },
   "mail": {
     "enable": true,
     "host": "smtp.163.com",
     "port": 465,
     "from": "*",
     "auth": {
       "user": "xxx@163.com",
       "pass": "xxx"
     }
   }
}

# 拉取yapi镜像
docker pull yapipro/yapi
# 初始化数据表
docker run -d --rm --name yapi-init --link mongodb:mongo --net=yapi -v /usr/local/yapi/config.json:/yapi/config.json yapipro/yapi server/install.js
# 启动yapi
docker run -d --name yapi --link mongodb:mongo --restart always --net=yapi -p 3000:3000 -v /usr/local/yapi/config.json:/yapi/config.json yapipro/yapi server/app.js
```

- 启动成功后访问 ip:3000 进入 yapi 页面,注册账号后并新建项目。
- 选择数据管理--> 数据导入 选择 Swagger --> 开启 url 导入 --> 添加 Swagger 数据 URL --> 点击上传。

![yapi](/assets/img/spring/swagger02.png)
