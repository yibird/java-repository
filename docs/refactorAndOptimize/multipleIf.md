在实际项目开发中,通常需要根据外部传入的参数执行相对应的业务逻辑,例如发送短信、OSS 文件上传、支付等场景,在这些场景下一般具有相同的功能,但是各种策略实现细节颇有不同。以发送短信为例,为了提供发送短信的稳定性和丰富性,项目支持阿里云、腾讯云、华为云、七牛云等多个厂商发送短信接口,外部只需要传入厂商名称方法内部根据其名称选择对应的厂商发送短信,通过 if 分支判断发送短信代码如下:

```java
private static final String ALI_CLOUD="aliCloud";
private static final String TENCENT_CLOUD="tencentCloud";
private static final String HUAWEI_CLOUD="huaweiCloud";


// 发送短信
public void send(String company){
    if (company == ALI_CLOUD) {
        // 调用阿里云发送短信
    }else if (company == TENCENT_CLOUD) {
         // 调用腾讯云发送短信
    }else if (company == HUAWEI_CLOUD) {
        // 调用华为云发送短信
    }
    // ...省略其它分支
}

```

随着需求不断变化,条件分支也会随着变化,当 if 分支越来越多时,会严重影响代码的可维护性、可扩展性和可读性,甚至会增加代码的耦合度。优化多重 if 分支的方案如下:

- 通过工厂模式优化多重 if。
- 通过策略模式优化多重 if。
- 通过状态机优化多重 if。

## 1.工厂模式优化多重 if

工厂模式的核心思想是将对象的创建过程封装在一个工厂类中,使用者通过工厂类来获取所需的对象,而无需关心对象的具体创建细节。
通过工厂类将对象的创建与使用代码解耦,使用者只需要关注所需的产品接口或抽象类,而无需关心具体的实现细节。这样可以提高代码的可扩展性,方便添加新的具体实现,同时也降低了代码的耦合度。

以发送短信为例,多个厂商都提供了发送短信的能力,可以将其共同行为抽象为一个发送短信接口(Sms),提供一个发送短信的抽象方法(send)以供其它厂商实现。最后创建短信工厂类根据外部传入的厂商选择对应的发送短信具体实现。

### 1.1 通过工厂模式优化多重 if

```java
// 发送短信公共接口,提供多个厂商发送短信的抽象方法
public interface Sms {
    // 发送短信
    void send(String content);
}

// 阿里云短信类
public class AliCloudSms implements Sms {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 腾讯云短信类
public class TencentCloudSms implements Sms {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 华为云短信类
public class HuaweiCloudSms implements Sms {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}


// 短信工厂类,用于根据传入的厂商选择对应的发送短信具体实现
class SmsFactory {
    private static final String ALI_CLOUD="aliCloud";
    private static final String TENCENT_CLOUD="tencentCloud";
    private static final String HUAWEI_CLOUD="huaweiCloud";

    // 根据厂商创建短信接口的具体实现
    public static Sms createSms(String company) {
        if (company.equals(ALI_CLOUD)) {
            return new AliCloudSms();
        }else if(company.equals(TENCENT_CLOUD)){
            return new TencentCloudSms();
        }else if(company.equals(HUAWEI_CLOUD)){
            return new HuaweiCloudSms();
        }
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        String content = "这是一条短信";
        Sms sms = SmsFactory.createSms(company);
        // 发送短信
        sms.send(content);
    }
}
```

### 1.2 使用 Map + 工厂模式优化多重 if

通过使用 Map 来优化工厂模式,可以将创建对象的逻辑与具体实现解耦,并通过映射表实现对象的动态创建。

```java
// 发送短信公共接口,提供多个厂商发送短信的抽象方法
public interface Sms {
    // 发送短信
    void send(String content);
}

// 阿里云短信类
public class AliCloudSms implements Sms {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 腾讯云短信类
public class TencentCloudSms implements Sms {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 华为云短信类
public class HuaweiCloudSms implements Sms {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}


// 短信工厂类,用于根据传入的厂商选择对应的发送短信具体实现
class SmsFactory {
    private static final String ALI_CLOUD="aliCloud";
    private static final String TENCENT_CLOUD="tencentCloud";
    private static final String HUAWEI_CLOUD="huaweiCloud";


    private static final Map<String, Supplier<Sms>> smsMap = new HashMap<>();

    // 注册厂商和对应的创建逻辑
    public static void register(String company, Supplier<Sms> supplier) {
        smsMap.put(company, supplier);
    }

    // 根据厂商创建短信接口的具体实现
    public static Sms createSms(String company) {
        Supplier<Product> supplier = smsMap.get(company);
        if (supplier != null) {
            return supplier.get();
        }
        return null;
    }
}


public class Main {
    public static void main(String[] args) {
        // 注册短信和对应的创建逻辑
        SmsFactory.register("aliCloud", AliCloudSms::new);
        SmsFactory.register("tencentCloud", TencentCloudSms::new);
        SmsFactory.register("huaweiCloud", HuaweiCloudSms::new);

        // 使用工厂创建产品对象
        Sms aliCloud = SmsFactory.createSms("aliCloud");
        Sms tencentCloud = SmsFactory.createSms("tencentCloud");

        // 调用短信接口的方法
        if (aliCloud != null) {
            aliCloud.send("aliCloud");
        }
        if (tencentCloud != null) {
            tencentCloud.send("tencentCloud");
        }
    }
}
```

## 2.使用策略模式优化多重 if

策略模式的核心思想是将不同的算法或行为封装成独立的策略类,并使这些策略类可以相互替换,从而使得算法的变化独立于使用算法的客户端。策略模式通过定义一个公共的接口或抽象类来表示策略,并在具体策略类中实现具体的算法或行为。客户端根据需要选择合适的策略对象,并通过统一的接口调用策略的方法来执行特定的算法或行为。策略模式的核心包括以下几个要点:

- 抽象策略(Abstract Strategy):定义策略的公共接口或抽象类,声明策略方法。例如发送短信的行为可以抽象成一个策略,发送短信的逻辑表示一个策略方法。
- 具体策略(Concrete Strategy):实现抽象策略接口或继承抽象策略类,实现具体的算法或行为。
- 策略选择器(Strategy Selector):用于选择合适的策略,并在客户端使用策略时进行策略的切换和调用。
- 客户端(Client):根据具体需求选择合适的策略,调用策略的方法来执行相应的算法或行为。

### 2.1 通过经典策略模式优化多重 if

```java
// 发送短信抽象策略,提供多个厂商发送短信的抽象方法
public interface SmsStrategy {
    // 发送短信
    void send(String content);
}

// 阿里云短信策略类
public class AliCloudSmsStrategy implements SmsStrategy {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 腾讯云短信策略类
public class TencentCloudSmsStrategy implements SmsStrategy {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 华为云短信策略类
public class HuaweiCloudSmsStrategy implements SmsStrategy {
    @Override
    public void send(String content){
        // 省略发送短信逻辑
    }
}

// 短信策略选择器,用于根据厂商选择对应的发送短信策略
public class SmsStrategySelector{
    // 策略容器,用于存储SmsStrategy接口的具体实现
    private final Map<String, SmsStrategy> strategyMap;

    public StrategySelector(List<SmsStrategy> strategies){
        strategyMap = new HashMap<>();
        for (SmsStrategy strategy : strategies) {
            String strategyName = strategy.getClass().getSimpleName();
            strategyMap.put(strategyName, strategy);
        }
    }
    // 执行策略
    public void execute(String strategyName,String content) {
        SmsStrategy strategy = strategyMap.get(strategyName);
        if (strategy != null) {
            strategy.send(content);
        }
    }
}

// 策略使用者
public class StrategyClient{
    public static void main(String[] args) {
        List<SmsStrategy> strategies = new ArrayList<>();
        strategies.add(new AliCloudSmsStrategy());
        strategies.add(new TencentCloudSmsStrategy());
        strategies.add(new HuaweiCloudSmsStrategy());
        SmsStrategySelector selector = new SmsStrategySelector(strategies);
        // 使用阿里云发送短信
        selector.execute("AliCloudSmsStrategy");
    }
}
```

### 2.2 使用 Spring BeanFactory 工厂模式 + 策略模式优化多重 if

Spring 的 BeanFactory 是 Spring 框架的核心容器,负责管理和提供应用程序中的所有 Bean 对象。它是一个接口,定义了访问 Spring 容器中 Bean 的基本操作和方法。在 Spring 中,BeanFactory 充当了工厂类的角色,负责创建和管理 Bean 对象。它使用工厂方法模式,通过调用相应的方法或配置信息,将对象的创建逻辑封装在 BeanFactory 中。通过工厂模式,Spring 的 BeanFactory 实现了对象的创建和实例化的解耦,提供了一种灵活、可扩展和可配置的方式来管理 Bean 实例。它使得应用程序的组件(Bean)的创建和使用能够更好地解耦,并提供了依赖注入、生命周期管理和作用域管理等功能,使开发人员能够更专注于业务逻辑的实现。

```java
// 发送短信抽象策略,提供多个厂商发送短信的抽象方法
public interface SmsStrategy {
    // 发送短信
    void send(String content);
}

@Service("AliCloudSms")
public class AliCloudSms implements SmsStrategy {
    @Override
    public void send(String content) {
        // 阿里云发送短信...
        System.out.println("阿里云发送短信,内容:"+context);
    }
}

@Service("TencentCloudSms")
public class TencentCloudSms implements SmsStrategy {
    @Override
    public void send(String content) {
        // 阿里云发送短信...
        System.out.println("腾讯云发送短信,内容:"+context);
    }
}

@Service("HuaweiCloudSms")
public class HuaweiCloudSms implements SmsStrategy {
    @Override
    public void send(String content) {
        // 阿里云发送短信...
        System.out.println("华为云发送短信,内容:"+context);
    }
}
```

```java
@Service
public class SmsImpl {
    /**
     * 利用@Resource注解和@Autowired特性获取Strategy接口的所有实现类接口实例
     */
    @Resource
    private Map<String, Strategy> smsMap;

    public void send(String company,String content){
        // 判断策略是否存在
        if (!smsMap.containsKey(company)){
            throw new IllegalArgumentException("company not found");
        }
        // 获取具体策略实例
        Strategy strategy = smsMap.get(company);
        strategy.send(content);
    }
}
```

基于 Spring BeanFactory 工厂模式+策略模式优化多重 if,不仅具有易扩展、易维护灵活性好等优点,也可以利用 Spring 依赖注入、自动装配实现松耦合。

## 3.枚举类优化多重 if

在 Java 中,可以使用枚举类来优化多重 if 判断,特别适用于具有有限的选项或状态的场景。通过定义枚举常量,并使用 switch 语句或方法来处理不同的枚举常量,可以避免冗长的多重 if 判断。使用枚举类可以简化多重 if 判断,提高代码的可读性、可维护性和扩展性。枚举类提供了一种更优雅和类型安全的方式来处理有限的选项或状态。

### 3.1 通过枚举类优化多重 if

```java
/**
 * 短信枚举类
 */
public enum SmsEnum {
    ALI_CLOUD("aliCloud"),
    TENCENT_CLOUD("tencentCloud"),
    HUAWEI_CLOUD("huaweiCloud");
    private String name;
    SmsEnum(String name) {
        this.name = name;
    }
}


/**
 * 短信客户端类
 */
public class SmsClient {
    public void send(SmsEnum smsEnum){
        switch (smsEnum){
            case ALI_CLOUD:
                // 调用阿里云发送短信...
                break;
            case TENCENT_CLOUD:
                // 调用腾讯云发送短信...
                break;
            case HUAWEI_CLOUD:
                // 调用华为云发送短信...
                break;
            default:
                break;
        }
    }
}
```

虽然枚举类提供了一种更优雅和类型安全的方式来处理有限的选项或状态,但是条件分支中并未将对象共同行为进行抽象,对于代码仍然是紧耦合的,可以通过枚举策略模式或枚举工厂模式进行优化。

### 3.2 通过枚举策略模式优化多重 if

```java
package optioal;

/**
 * 短信枚举类,通过枚举+策略模式提取抽象行为,不同枚举实现对应抽象行为
 */
public enum SmsEnum {
    ALI_CLOUD{
        @Override
        public void send(String context) {
            // 阿里云发送短信...
            System.out.println("阿里云发送短信,内容:"+context);
        }
    },
    TENCENT_CLOUD{
        @Override
        public void send(String context) {
            // 腾讯云发送短信...
            System.out.println("腾讯云发送短信,内容:"+context);
        }
    },
    HUAWEI_CLOUD{
        @Override
        public void send(String context) {
            // 华为云发送短信...
            System.out.println("华为云发送短信,内容:"+context);
        }
    };

    // 定义发短信的抽象方法
    public abstract void send(String context);
}

package optioal;

/**
 * 短信客户端类
 */
public class SmsClient {
    public static void send(String company){
        // 获取策略,枚举类未匹配成功会抛出 IllegalArgumentException 异常
        SmsEnum smsEnum = SmsEnum.valueOf(company);
        smsEnum.send("这是一条短信...");
    }

    public static void main(String[] args) {
        send(SmsEnum.ALI_CLOUD.name());
        send(SmsEnum.TENCENT_CLOUD.name());
        send(SmsEnum.HUAWEI_CLOUD.name());
    }
}
```

基于枚举策略模式相较于策略模式或工厂模式现实更加简单,但是存在着如下局限性:

- 由于枚举策略类是公用且静态的,这意味着策略无法引入非静态部分,因此扩展性受限。
- 策略模式的目标之一,是提供优秀的扩展性和可维护性,当新增或修改某一策略类时,无需改动其他类。而枚举策略模式如果过多或者过程复杂,可维护性将变得很差。

因此对于简单策略推荐使用枚举策略模式,对于策略过多或策略复杂的场景推荐使用工厂策略模式。
