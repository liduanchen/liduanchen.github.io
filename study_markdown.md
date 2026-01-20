# 一级文本
## 二级文本
**加粗**

_空间和广泛的_   
~~空间和广泛的~~  
`import pandas`   
<mark>高亮文本</mark>  

**列表标记**  
- 第一项
- 第二项  

**有序列表**  
1. 第一项
2. 第二项    

- [ ] 未完成的任务
- [x] 已完成的任务  

> 区块引用

语法标识符  

```python{.line-numbers}
def calculate_area(radius):
    """计算圆的面积"""
    import math
    return math.pi * radius ** 2
# 使用函数
area = calculate_area(5)
print(f"圆的面积是: {area:.2f}")
```

```sql
SELECT u.name, u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC
LIMIT 10;
```

这是一个链接 [菜鸟教程](https://www.runoob.com)

## markdown表格
|  表头   | 表头  |
|  ----  | ----  |
| 单元格  | 单元格 |
| 单元格  | 单元格 |

| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

数学公式
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

$$
    \begin{pmatrix}
    a & b \\
    c & d
    \end{pmatrix}
    $$

图表绘制(可以用ai)  

```mermaid
sequenceDiagram
    participant A as 用户
    participant B as 系统
    participant C as 数据库
    
    A->>B: 登录请求
    B->>C: 验证用户信息
    C-->>B: 返回验证结果
    B-->>A: 登录成功/失败
```

甘特图
```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析      :done,    des1, 2024-01-01,2024-01-15
    UI设计       :active,  des2, 2024-01-10, 30d
    section 开发阶段
    前端开发      :         dev1, after des2, 45d
    后端开发      :         dev2, 2024-02-01, 60d
    section 测试阶段
    单元测试      :         test1, after dev1, 15d
    集成测试      :         test2, after dev2, 10d
```
饼图
```mermaid
pie
    title 浏览器市场份额
    "Chrome" : 65
    "Safari" : 15
    "Firefox" : 10
    "其他" : 10
```

```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 登录请求
    系统-->>用户: 验证请求
    用户->>系统: 提交凭证
    系统-->>用户: 登录成功
```