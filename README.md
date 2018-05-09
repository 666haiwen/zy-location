# 1. 前端

## 1.1 安装

1. 安装 node.js

2. (For Windows User) 设置环境变量，请确认环境变量中的 `PATH` 中有以下两行

    C:\Program Files\nodejs\  // 你 node 的安装路径
    C:\Users\{用户名}\AppData\Roaming\npm  // 一些全局安装的命令行模块的执行文件放在此处

3. 安装 `cnpm` ，打开 cmd 并输入：（如果失败，请以管理员权限打开cmd）

    npm install -g cnpm --registry=https://registry.npm.taobao.org

4. 在 `site\frontend` 中打开 cmd，并输入以下命令：

    cnpm install  // 安装第三方库
    npm start  // 运行前端,默认地址为:localhost:9080

# 2. 后端

1. 安装 python (包括设置环境变量)

2. 安装 django

    打开cmd后，输入 pip install django  即可

3. 在`site\backend` 中打开cmd， 并且输入以下命令:
    manage.py runserver 9000

# 3. 运行

0. 先安装完成

1. 然后运行后端, manage.py runserver 9000

2. 再运行前端 npm start

# 4. tips

0. 后端数据获取的时间间隔

    位于`site\backend\backend\settings.py` 中的 TIME_INTERVAL (第139行) (0.05 == 50ms)

1. 前端数据获取的时间间隔(即轮询时间的时间间隔)

    位于`site\frontend\src\components\TracePanel.js` 中的第16行, 50 --> 即50ms
