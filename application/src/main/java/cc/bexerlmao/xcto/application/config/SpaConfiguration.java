package cc.bexerlmao.xcto.application.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * SPA 路由回退配置。
 * <p>
 * Vue Router 使用 createWebHistory() 模式，前端路由有 /、/courses、/question。
 * 当用户直接访问这些路径（刷新页面或手动输入 URL）时，浏览器发送 GET 请求到后端，
 * 但后端没有对应的 Controller 映射，会返回 404。
 * <p>
 * 这个配置会让 Spring Boot 在找不到匹配的静态文件时，返回 index.html，
 * 由前端 Vue Router 接管路由处理。
 * <p>
 * 注意：Controller 的优先级高于资源处理器，所以 /question/save 等 API 不受影响。
 */
@Configuration
public class SpaConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource resource = location.createRelative(resourcePath);
                        // 如果静态文件存在，直接返回（如 /assets/xxx.js、/index.html）
                        if (resource.exists() && resource.isReadable()) {
                            return resource;
                        }
                        // SPA 回退：找不到文件就返回 index.html，让前端 Vue Router 处理路由
                        Resource index = location.createRelative("index.html");
                        if (index.exists() && index.isReadable()) {
                            return index;
                        }
                        return null;
                    }
                });
    }
}
