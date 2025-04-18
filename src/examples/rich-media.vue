<template>
    <div>
        <h3>富媒体SKU规格示例</h3>
        <p>本示例展示了如何使用图片+文字组合的SKU规格，特别适用于需要视觉展示的规格（如颜色、材质等）</p>
        
        <div class="demo-actions">
            <el-button type="primary" @click="addColorWithImage">添加带图片的颜色规格</el-button>
        </div>
        
        <SkuForm
            ref="skuFormRef"
            :source-attribute="sourceAttribute"
            v-model:attribute="attribute"
            v-model:sku="sku"
            :structure="structure"
        >
            <template #image="{ row, index }">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-success="() => {}"
                    :before-upload="file => beforeUpload(file, row)"
                >
                    <img v-if="row.image" :src="row.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </template>
        </SkuForm>
        
        <el-drawer
            v-model="drawer.visible"
            title="添加颜色规格"
            size="380px"
        >
            <div class="add-color-form">
                <el-form>
                    <el-form-item label="颜色名称">
                        <el-input v-model="drawer.colorName" placeholder="如：深空灰"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="颜色图片">
                        <el-upload
                            class="color-uploader"
                            action="#"
                            :show-file-list="false"
                            :on-success="() => {}"
                            :before-upload="uploadColorImage"
                        >
                            <img v-if="drawer.colorImage" :src="drawer.colorImage" class="avatar" />
                            <div v-else class="upload-placeholder">
                                <el-icon><Plus /></el-icon>
                                <span>点击上传</span>
                            </div>
                        </el-upload>
                    </el-form-item>
                    
                    <el-form-item label="快速选择">
                        <div class="predefined-colors">
                            <div 
                                v-for="(color, index) in predefinedColors" 
                                :key="index"
                                class="color-preset"
                                @click="usePredefinedColor(color)"
                            >
                                <div 
                                    class="color-preset-dot" 
                                    :style="{ backgroundColor: color.color }"
                                ></div>
                                <span>{{ color.name }}</span>
                            </div>
                        </div>
                    </el-form-item>
                    
                    <el-form-item label="预览效果">
                        <div class="color-preview-box">
                            <div class="color-preview" v-if="drawer.colorName || drawer.colorImage">
                                <img v-if="drawer.colorImage" :src="drawer.colorImage" class="color-preview-image" />
                                <span class="color-preview-name">{{ drawer.colorName || '请输入颜色名称' }}</span>
                            </div>
                            <div class="color-preview-empty" v-else>
                                <span>请填写颜色名称并上传图片</span>
                            </div>
                        </div>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="confirmAddColor">添加颜色</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
        
        <div class="result-section">
            <h3>输出数据</h3>
            <el-tabs>
                <el-tab-pane label="属性数据">
                    <pre>{{ JSON.stringify(attribute, null, 2) }}</pre>
                </el-tab-pane>
                <el-tab-pane label="SKU数据">
                    <pre>{{ JSON.stringify(sku, null, 2) }}</pre>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SkuForm from '../components/SkuForm.vue'

// SKU表单数据
const skuFormRef = ref(null)

const sourceAttribute = ref([
    {
        name: '颜色',
        item: [
            { name: '黑色', image: 'https://via.placeholder.com/100/000000/FFFFFF' },
            { name: '金色', image: 'https://via.placeholder.com/100/FFD700/000000' },
            { name: '白色', image: 'https://via.placeholder.com/100/FFFFFF/000000' }
        ]
    },
    {
        name: '内存',
        item: ['16G', '32G', '64G'] // 单一文本仍然支持
    }
])

const attribute = ref([])
const sku = ref([])

const structure = ref([
    { name: 'price', type: 'input', label: '价格', required: true },
    { name: 'stock', type: 'input', label: '库存', required: true },
    { name: 'image', type: 'slot', label: '商品图片' }
])

// 抽屉状态
const drawer = ref({
    visible: false,
    colorName: '',
    colorImage: ''
})

// 预定义的颜色选项
const predefinedColors = [
    { name: '深空灰', color: '#333333' },
    { name: '玫瑰金', color: '#E0BFB8' },
    { name: '星光银', color: '#E1E2E3' },
    { name: '午夜色', color: '#1E2429' },
    { name: '蓝色', color: '#0071E3' }
]

// 打开添加颜色的抽屉
const addColorWithImage = () => {
    drawer.value.visible = true
    drawer.value.colorName = ''
    drawer.value.colorImage = ''
}

// 使用预定义颜色
const usePredefinedColor = (color) => {
    drawer.value.colorName = color.name
    // 生成颜色预览图像（实际项目中可能是从服务器获取）
    drawer.value.colorImage = `https://via.placeholder.com/100/${color.color.substring(1)}/FFFFFF&text=${color.name}`
}

// 上传颜色图片
const uploadColorImage = (file) => {
    // 实际应用中，这里应该上传到服务器
    // 这里仅作为示例，使用本地URL
    drawer.value.colorImage = URL.createObjectURL(file)
    return false // 阻止自动上传
}

// 确认添加颜色
const confirmAddColor = () => {
    if (!drawer.value.colorName || !drawer.value.colorImage) {
        ElMessage.warning('请填写完整的颜色信息')
        return
    }
    
    // 调用SKU组件的方法添加带图片的规格
    const success = skuFormRef.value.onAddAttributeWithImage(
        0, // 颜色属性的索引
        drawer.value.colorName,
        drawer.value.colorImage
    )
    
    if (success) {
        drawer.value.visible = false
        ElMessage.success('添加成功')
    }
}

// 上传SKU图片
const beforeUpload = (file, row) => {
    row.image = URL.createObjectURL(file)
    return false // 阻止自动上传
}
</script>

<style scoped>
.demo-actions {
    margin-bottom: 20px;
}

.result-section {
    margin-top: 30px;
}

.avatar-uploader, .color-uploader {
    display: flex;
    justify-content: center;
}

.avatar-uploader :deep(.el-upload),
.color-uploader :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover),
.color-uploader :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    text-align: center;
}

.avatar {
    width: 60px;
    height: 60px;
    display: block;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    color: #8c939d;
}

.add-color-form {
    padding: 20px;
}

.el-tabs :deep(.el-tabs__content) {
    overflow: auto;
    max-height: 400px;
}

pre {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    overflow: auto;
}

/* 新增样式 */
.color-preview-box {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.color-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    background-color: #fafafa;
}

.color-preview-image {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 3px;
}

.color-preview-name {
    font-size: 14px;
}

.color-preview-empty {
    padding: 10px;
    color: #999;
    font-style: italic;
}

.predefined-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.color-preset {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid #eee;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
}

.color-preset:hover {
    border-color: #ccc;
    background-color: #f5f5f5;
}

.color-preset-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
}
</style> 