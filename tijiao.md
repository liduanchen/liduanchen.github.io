# 1. 先拉取远程最新代码（避免冲突）
git pull origin main

# 2. 修改你的文件
# （用编辑器修改文件）

# 3. 查看修改了哪些文件
git status

# 4. 添加修改到暂存区
git add .                         # 添加所有修改
# 或
git add 文件名                     # 添加特定文件

# 5. 提交到本地仓库
git commit -m "描述你的修改内容"

# 6. 推送到远程仓库
git push origin main
# 强制推送
git push -f origin main
