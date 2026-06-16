# ============================================================
# XCTO Docker 镜像（本地构建模式）
# ============================================================
# 使用前请先在本地执行构建脚本：
#   Windows: build.bat
#   然后:   docker build -t xcto:latest .
# ============================================================

FROM eclipse-temurin:17-jre
WORKDIR /app

# 直接复制本地已构建好的 fat jar（内含前端静态文件）
COPY target/XCTO.jar app.jar

EXPOSE 65535

ENTRYPOINT ["java", "-jar", "app.jar"]
