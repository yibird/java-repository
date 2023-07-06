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

## 1.通过工厂模式优化多重 if

工厂模式的核心思想是将对象的创建过程封装在一个工厂类中,使用者通过工厂类来获取所需的对象,而无需关心对象的具体创建细节。
通过工厂类将对象的创建与使用代码解耦,使用者只需要关注所需的产品接口或抽象类,而无需关心具体的实现细节。这样可以提高代码的可扩展性,方便添加新的具体实现,同时也降低了代码的耦合度。

以发送短信为例,多个厂商都提供了发送短信的能力,可以将其共同行为抽象为一个发送短信接口(Sms),提供一个发送短信的抽象方法(send)以供其它厂商实现。最后创建短信工厂类根据外部传入的厂商选择对应的发送短信具体实现。

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

### 1.1 使用 Map 优化工厂模式

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

### 1.2 使用 SpringBoot serviceFacot 优化工厂模式

## 2.使用策略模式优化多重 if

策略模式的核心思想是将不同的算法或行为封装成独立的策略类,并使这些策略类可以相互替换,从而使得算法的变化独立于使用算法的客户端。策略模式通过定义一个公共的接口或抽象类来表示策略,并在具体策略类中实现具体的算法或行为。客户端根据需要选择合适的策略对象,并通过统一的接口调用策略的方法来执行特定的算法或行为。策略模式的核心包括以下几个要点:

- 抽象策略(Abstract Strategy):定义策略的公共接口或抽象类,声明策略方法。例如发送短信的行为可以抽象成一个策略,发送短信的逻辑表示一个策略方法。
- 具体策略(Concrete Strategy):实现抽象策略接口或继承抽象策略类,实现具体的算法或行为。
- 策略选择器(Strategy Selector):用于选择合适的策略,并在客户端使用策略时进行策略的切换和调用。
- 客户端(Client):根据具体需求选择合适的策略,调用策略的方法来执行相应的算法或行为。

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
