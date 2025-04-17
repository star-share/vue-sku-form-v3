<template>
    <div class="app-container">
        <div class="nav-links">
            <router-link v-for="(item, index) in examples" :key="index" :to="item.path">{{ item.meta?.title }}</router-link>
        </div>
        <div class="content-area">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import examples from './router/example'
</script>

<style>
html, body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.app-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.nav-links {
    display: flex;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.nav-links a {
    margin-right: 20px;
    color: #333;
    text-decoration: none;
    font-weight: bold;
}

.nav-links a.router-link-active {
    color: #409eff;
}

.content-area {
    padding: 20px;
}
</style>
