# Spring Boot 项目架构说明

## 项目架构层次

```
                    用户
                     ↕
                    页面
                     ↕
                Controller层
                     ↕
                  Service层
                     ↕
                  Mapper层
                     ↕
                   数据库
```

## 各层详细说明

### Controller层
- **注解**：`@RestController`
- **作用**：控制器类，处理HTTP请求
- **特点**：返回的对象会自动转成JSON格式

### Service层
- **注解**：`@Service`
- **作用**：表示这是一个业务组件
- **功能**：封装业务逻辑
- **调用关系**：通常为Controller调用Service，Service调用Mapper

### Mapper层 (MyBatis数据访问层)
- **注解**：`@Mapper`
- **作用**：代表MyBatis可把它作为Mapper接口处理
- **功能**：负责与数据库进行交互，执行SQL操作

### 实体类Entity
- **作用**：用于承载数据库中查出来的每一行数据
- **特点**：字段与类的属性对应

### 配置文件
- **文件**：`application.yml`
- **作用**：Spring Boot的配置文件
- **配置内容**：端口、数据源、MyBatis路径等

## 架构特点

1. **分层清晰**：各层职责明确，边界清晰
2. **解耦设计**：通过依赖注入实现层与层之间的解耦
3. **易于维护**：模块化设计，便于代码维护和扩展
4. **标准化**：使用Spring Boot和MyBatis等标准框架，遵循最佳实践