## 开发

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui

# 更改镜像源
npm config set registry https://registry.npm.taobao.org

# 安装依赖
# npm install
# 或
npm i --legacy-peer-deps

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
# npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```



## nginx部署代理

- 在宝塔面板安装nginx，先完成由服务器ip:port访问的部署（“网站”->“HTML项目”）。本项目监听80端口

![image-20241008221913933](C:\Users\86138\AppData\Roaming\Typora\typora-user-images\image-20241008221913933.png)

- 其配置文件如下：

```nginx
upstream server {
    # ip_hash;
    server 127.0.0.1:8088;
    server 127.0.0.1:8089;
    # server 127.0.0.1:9090;
}

upstream monitor-admin {
    server 127.0.0.1:9200;
   
}

upstream xxljob-admin {
    server 127.0.0.1:9100;
}
server
{
    listen 80;
    server_name 94.154.37.20;
    # server_name lxc.spiritlhl.top;
    index index.html index.htm default.htm default.html;
    root /opt/project/freelxc/lxcweb/dist;
    #CERT-APPLY-CHECK--START
    # 用于SSL证书申请时的文件验证相关配置 -- 请勿删除并保持这段设置在优先级高的位置
    include /www/server/panel/vhost/nginx/well-known/94.154.37.20.conf;
    #CERT-APPLY-CHECK--END

    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    #SSL-END

    #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
    #error_page 404 /404.html;
    #error_page 502 /502.html;
    #ERROR-PAGE-END

    #REWRITE-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效
    include /www/server/panel/vhost/rewrite/html_94.154.37.20.conf;
    #REWRITE-END
    
    location / {
        root   /opt/project/freelxc/lxcweb/dist;
        try_files $uri $uri/ /index.html;
        index  index.html index.htm;
    }

    location /prod-api/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://server/;
    }
    
    # https 会拦截内链所有的 http 请求 造成功能无法使用
    # 解决方案1 将 admin 服务 也配置成 https
    # 解决方案2 将菜单配置为外链访问 走独立页面 http 访问
    location /monitor/admin/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://monitor-admin/admin/;
    }

    # https 会拦截内链所有的 http 请求 造成功能无法使用
    # 解决方案1 将 xxljob 服务 也配置成 https
    # 解决方案2 将菜单配置为外链访问 走独立页面 http 访问
    location /xxl-job-admin/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://xxljob-admin/xxl-job-admin/;
    }

    #禁止访问的文件或目录
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md)
    {
        return 404;
    }

    #一键申请SSL证书验证目录相关设置
    location ~ \.well-known{
        allow all;
    }

    #禁止在证书验证目录放入敏感文件
    if ( $uri ~ "^/\.well-known/.*\.(php|jsp|py|js|css|lua|ts|go|zip|tar\.gz|rar|7z|sql|bak)$" ) {
        return 403;
    }

    location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      30d;
        error_log /dev/null;
        access_log /dev/null;
    }

    location ~ .*\\.(js|css)?$
    {
        expires      12h;
        error_log /dev/null;
        access_log /dev/null;
    }
    access_log  /www/wwwlogs/94.154.37.20.log;
    error_log  /www/wwwlogs/94.154.37.20.error.log;
}
```

> /prod-api的请求转发到了127.0.0.1的8088和8089端口；monitor监控转发到9200端口，加上/admin；xxl-job定时任务转发到9100端口，加上/xxl-job-admin



## nginx反向代理绑定域名

- 将服务器的/etc/hosts文件内将解析好的域名（lxc.spiritlhl.top）和部署的本机ip地址（94.154.37.20）绑定

  ![image-20241008222543336](C:\Users\86138\AppData\Roaming\Typora\typora-user-images\image-20241008222543336.png)

- 在宝塔的“网站”->“反向代理”，添加域名和前面部署的ip:port绑定（如果有其他资源需要配置，需要在配置文件中另外添加）

  ![image-20241008222738979](C:\Users\86138\AppData\Roaming\Typora\typora-user-images\image-20241008222738979.png)

## 手动安装的nginx的配置文件绑定域名

更改nginx-1.x.x文件夹下/conf/nginx.conf文件，将配置改为

```nginx
user  root;
worker_processes  1;

error_log  /opt/software/nginx-1.12.2/logs/error.log debug;
pid        /opt/software/nginx-1.12.2/logs/nginx.pid;


#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;   

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    # 限制body大小
    # client_max_body_size 100m;

    #gzip  on;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /opt/software/nginx-1.12.2/logs/access.log  main;
    # 访问域名时转发的地址+端口，设置多个server属性可做负载均衡
    upstream server {
        # ip_hash;
        server 127.0.0.1:8088;
        # server 127.0.0.1:8081;
        # server 127.0.0.1:9090;
    }
    # 启动不同服务需要代理到不同端口
    upstream monitor-admin {
        server 127.0.0.1:9200;
        
    }

    upstream xxljob-admin {
        server 127.0.0.1:9100;
    }

    server {
        # 监听本服务器的某个端口
        listen       80;
        # 将域名替换localhost
        server_name lxc.spiritlhl.top;
        # server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;
        
        # location = /index.html {
        #     add_header Cache-Control "no-cache, no-store";
        # }

        location / {
            root   /opt/project/freelxc/lxcweb/dist;
            try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }

        location /prod-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_pass http://server/;
            # proxy_pass http://lxc.spiritysdx.top; 这个写法可能需要在服务器的/etc/hosts文件中添加本机ip与域名的对应
        }

        # https 会拦截内链所有的 http 请求 造成功能无法使用
        # 解决方案1 将 admin 服务 也配置成 https
        # 解决方案2 将菜单配置为外链访问 走独立页面 http 访问
        
        location /monitor/admin/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://monitor-admin/admin/;
        }

        # https 会拦截内链所有的 http 请求 造成功能无法使用
        # 解决方案1 将 xxljob 服务 也配置成 https
        # 解决方案2 将菜单配置为外链访问 走独立页面 http 访问
        
        location /xxl-job-admin/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://xxljob-admin/xxl-job-admin/;
        }

        # 限制外网访问内网 actuator 相关路径
        location ~ ^(/[^/]*)?/actuator(/.*)?$ {
            return 403;
        }


        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }
    
    # 其他server块配置
}
```



