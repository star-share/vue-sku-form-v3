<template>
  <div class="examples-container">
    <h2>SKU 表单组件测试用例</h2>
    
    <!-- 基础用例 -->
    <section class="example-section">
      <h3>基础用例</h3>
      <SkuForm
        v-model:attribute="basicAttribute"
        v-model:sku="basicSku"
        :sourceAttribute="basicSourceAttribute"
        :structure="basicStructure"
      />
      <div class="result-display">
        <h4>输出数据:</h4>
        <pre>{{ JSON.stringify(basicSku, null, 2) }}</pre>
      </div>
    </section>
    
    <!-- 预设数据用例 -->
    <section class="example-section">
      <h3>预设数据用例</h3>
      <SkuForm
        v-model:attribute="presetAttribute"
        v-model:sku="presetSku"
        :sourceAttribute="presetSourceAttribute"
        :structure="presetStructure"
      />
      <div class="result-display">
        <h4>输出数据:</h4>
        <pre>{{ JSON.stringify(presetSku, null, 2) }}</pre>
      </div>
    </section>
    
    <!-- 自定义验证规则 -->
    <section class="example-section">
      <h3>自定义验证规则用例</h3>
      <SkuForm
        ref="validationFormRef"
        v-model:attribute="validationAttribute"
        v-model:sku="validationSku"
        :sourceAttribute="validationSourceAttribute"
        :structure="validationStructure"
      />
      <el-button type="primary" @click="validateForm">验证表单</el-button>
      <div class="validation-result" v-if="validationResult !== null">
        验证结果: {{ validationResult ? '通过' : '未通过' }}
      </div>
      <div class="result-display">
        <h4>输出数据:</h4>
        <pre>{{ JSON.stringify(validationSku, null, 2) }}</pre>
      </div>
    </section>
    
    <!-- 禁用状态 -->
    <section class="example-section">
      <h3>禁用状态用例</h3>
      <SkuForm
        v-model:attribute="disabledAttribute"
        v-model:sku="disabledSku"
        :sourceAttribute="disabledSourceAttribute"
        :structure="disabledStructure"
        :disabled="true"
      />
    </section>
    
    <!-- 使用插槽自定义内容 -->
    <section class="example-section">
      <h3>自定义插槽用例</h3>
      <SkuForm
        v-model:attribute="slotAttribute"
        v-model:sku="slotSku"
        :sourceAttribute="slotSourceAttribute"
        :structure="slotStructure"
      >
        <template #image="{ row, index }">
          <div class="custom-slot">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-success="(res) => handleImageSuccess(res, row)"
              :before-upload="beforeImageUpload"
            >
              <img v-if="row.image" :src="row.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </template>
        <template #status="{ row, index }">
          <el-switch v-model="row.status" />
        </template>
      </SkuForm>
      <div class="result-display">
        <h4>输出数据:</h4>
        <pre>{{ JSON.stringify(slotSku, null, 2) }}</pre>
      </div>
    </section>
    
    <!-- 主题2样式 -->
    <section class="example-section">
      <h3>主题2样式用例</h3>
      <SkuForm
        v-model:attribute="theme2Attribute"
        v-model:sku="theme2Sku"
        :sourceAttribute="theme2SourceAttribute"
        :structure="theme2Structure"
        :theme="2"
      />
      <div class="result-display">
        <h4>输出数据:</h4>
        <pre>{{ JSON.stringify(theme2Sku, null, 2) }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SkuForm from '../components/SkuForm.vue'

// 基础用例数据
const basicSourceAttribute = ref([
  { name: '颜色', item: ['红色', '蓝色', '黑色'] },
  { name: '尺寸', item: ['S', 'M', 'L', 'XL'] }
])
const basicAttribute = ref([])
const basicSku = ref([])
const basicStructure = ref([
  { name: 'price', type: 'input', label: '价格', required: true },
  { name: 'stock', type: 'input', label: '库存', required: true }
])

// 预设数据用例
const presetSourceAttribute = ref([
  { name: '颜色', item: ['红色', '蓝色', '黑色', '白色'] },
  { name: '内存', item: ['64GB', '128GB', '256GB'] },
  { name: '运营商', item: ['电信', '移动', '联通'] }
])
const presetAttribute = ref([
  { name: '颜色', item: ['红色', '蓝色'] },
  { name: '内存', item: ['128GB'] }
])
const presetSku = ref([
  { sku: '红色;128GB', price: '3299', stock: '100', discount: '0.95' },
  { sku: '蓝色;128GB', price: '3399', stock: '50', discount: '0.9' }
])
const presetStructure = ref([
  { name: 'price', type: 'input', label: '价格', required: true, tips: '单位：元' },
  { name: 'stock', type: 'input', label: '库存', required: true },
  { name: 'discount', type: 'input', label: '折扣', tips: '0-1之间的小数' }
])

// 验证规则用例
const validationFormRef = ref(null)
const validationResult = ref(null)
const validationSourceAttribute = ref([
  { name: '材质', item: ['真皮', '人造革', '织物'] },
  { name: '款式', item: ['休闲', '正装', '运动'] }
])
const validationAttribute = ref([])
const validationSku = ref([])
const validationStructure = ref([
  { 
    name: 'price', 
    type: 'input', 
    label: '价格', 
    required: true,
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('价格不能为空'))
      } else if (isNaN(Number(value))) {
        callback(new Error('价格必须为数字'))
      } else if (Number(value) <= 0) {
        callback(new Error('价格必须大于0'))
      } else {
        callback()
      }
    }
  },
  { 
    name: 'stock', 
    type: 'input', 
    label: '库存', 
    required: true,
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('库存不能为空'))
      } else if (!Number.isInteger(Number(value))) {
        callback(new Error('库存必须为整数'))
      } else if (Number(value) < 0) {
        callback(new Error('库存不能小于0'))
      } else {
        callback()
      }
    }
  }
])

const validateForm = async () => {
  try {
    validationFormRef.value.validate((valid) => {
      validationResult.value = valid
      if (valid) {
        ElMessage.success('验证通过')
      } else {
        ElMessage.error('验证失败')
      }
    })
  } catch (error) {
    validationResult.value = false
    ElMessage.error('验证失败')
  }
}

// 禁用状态用例
const disabledSourceAttribute = ref([
  { name: '类型', item: ['A型', 'B型', 'C型'] }
])
const disabledAttribute = ref([
  { name: '类型', item: ['A型', 'B型'] }
])
const disabledSku = ref([
  { sku: 'A型', price: '100', stock: '20' },
  { sku: 'B型', price: '120', stock: '15' }
])
const disabledStructure = ref([
  { name: 'price', type: 'input', label: '价格' },
  { name: 'stock', type: 'input', label: '库存' }
])

// 插槽用例
const slotSourceAttribute = ref([
  { name: '颜色', item: ['红色', '蓝色'] },
  { name: '尺寸', item: ['S', 'M', 'L'] }
])
const slotAttribute = ref([])
const slotSku = ref([])
const slotStructure = ref([
  { name: 'price', type: 'input', label: '价格', required: true },
  { name: 'stock', type: 'input', label: '库存', required: true },
  { name: 'image', type: 'slot', label: '图片' },
  { name: 'status', type: 'slot', label: '状态' }
])

const handleImageSuccess = (res, row) => {
  // 模拟上传成功
  row.image = URL.createObjectURL(res.raw)
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 主题2样式用例
const theme2SourceAttribute = ref([
  { name: '产地', item: ['国产', '进口'] },
  { name: '口味', item: ['原味', '香辣', '芥末', '烧烤'] }
])
const theme2Attribute = ref([])
const theme2Sku = ref([])
const theme2Structure = ref([
  { name: 'price', type: 'input', label: '价格', required: true },
  { name: 'weight', type: 'input', label: '重量(g)', required: true },
  { name: 'expiry', type: 'input', label: '保质期(天)' }
])
</script>

<style scoped>
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.result-display {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.result-display pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.validation-result {
  margin: 10px 0;
  font-weight: bold;
}

.custom-slot {
  display: flex;
  justify-content: center;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
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
</style> 