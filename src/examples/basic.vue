<template>
    <div>
        <SkuForm
            :source-attribute="sourceAttribute"
            v-model:attribute="attribute"
            v-model:sku="sku"
        />
        <el-row :gutter="20">
            <el-col :span="12">
                <el-divider content-position="left">attribute 数据</el-divider>
                <pre><code>{{ attribute }}</code></pre>
            </el-col>
            <el-col :span="12">
                <el-divider content-position="left">sku 数据</el-divider>
                <pre><code>{{ sku }}</code></pre>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SkuForm from '../components/SkuForm.vue'

const sourceAttribute = ref([
    {
        name: '颜色',
        item: ['黑', '金', '白']
    },
    {
        name: '内存',
        item: ['16G', '32G']
    }
])
const attribute = ref([])
const sku = ref([])
</script>
