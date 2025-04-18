<template>
    <div>
        <h2>复杂套餐配置示例</h2>
        
        <!-- 套餐选择区域 -->
        <div class="package-selection">
            <h3>选择套餐</h3>
            <el-form label-width="100px">
                <el-form-item label="套餐类型">
                    <el-checkbox-group v-model="selectedPackages">
                        <el-checkbox 
                            v-for="pkg in packages" 
                            :key="pkg.value" 
                            :label="pkg.value"
                            @change="() => handlePackageChange(pkg.value)"
                        >
                            {{ pkg.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                
                <!-- 租期选择 -->
                <el-form-item label="租期">
                    <el-checkbox-group v-model="rentPeriods" @change="updateAllStructures">
                        <el-checkbox label="1天" />
                        <el-checkbox label="3天" />
                        <el-checkbox label="7天" />
                        <el-checkbox label="15天" />
                        <el-checkbox label="30天" />
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </div>
        
        <!-- 为每个选中的套餐创建独立的SKU表单 -->
        <div v-for="pkg in selectedPackages" :key="pkg" class="sku-configuration">
            <h3>{{ getPackageLabel(pkg) }}配置</h3>
            
            <!-- 套餐特定配置 -->
            <el-form label-width="100px" class="package-config-form">
                <el-form-item label="续租">
                    <el-select v-model="packageConfigs[pkg].renewal" placeholder="请选择是否支持续租" @change="updateStructure(pkg)">
                        <el-option label="支持" value="支持" />
                        <el-option label="不支持" value="不支持" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="买断">
                    <el-select v-model="packageConfigs[pkg].buyout" placeholder="请选择买断方式" @change="updateStructure(pkg)">
                        <el-option label="到期买断" value="到期买断" />
                        <el-option label="提前买断" value="提前买断" />
                        <el-option label="不支持" value="不支持" />
                    </el-select>
                </el-form-item>
                
                <el-form-item v-if="packageConfigs[pkg].renewal === '支持'" label="续租系数">
                    <el-input v-model="packageConfigs[pkg].renewalCoefficient" placeholder="请输入续租系数" />
                </el-form-item>
            </el-form>
            
            <!-- 每个套餐的SKU表单 -->
            <SkuForm
                :source-attribute="sourceAttribute"
                v-model:attribute="packageAttributes[pkg]"
                v-model:sku="packageSkus[pkg]"
                :structure="packageStructures[pkg]"
            />
            
            <!-- 套餐数据预览 -->
            <el-divider content-position="left">{{getPackageLabel(pkg)}} SKU数据</el-divider>
            <pre><code>{{ packageSkus[pkg] }}</code></pre>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import SkuForm from '../components/SkuForm.vue'

// 可选套餐列表
const packages = [
    { label: '经济套餐', value: 'economy' },
    { label: '标准套餐', value: 'standard' },
    { label: '豪华套餐', value: 'premium' }
]

// 当前选择的套餐（多选）
const selectedPackages = ref([])

// 公共租期选择
const rentPeriods = ref([])

// 共用的规格配置
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

// 每个套餐的配置参数
const packageConfigs = reactive({})

// 每个套餐的attribute
const packageAttributes = reactive({})

// 每个套餐的sku
const packageSkus = reactive({})

// 每个套餐的结构配置
const packageStructures = reactive({})

// 获取套餐标签
const getPackageLabel = (value) => {
    const pkg = packages.find(p => p.value === value)
    return pkg ? pkg.label : value
}

// 处理套餐选择变更
const handlePackageChange = (value) => {
    // 如果是第一次选中，初始化配置
    if (selectedPackages.value.includes(value) && !packageConfigs[value]) {
        // 初始化套餐配置
        packageConfigs[value] = {
            renewal: '',
            buyout: '',
            renewalCoefficient: ''
        }
        
        // 初始化套餐默认配置
        if (value === 'economy') {
            packageConfigs[value].renewal = '不支持'
            packageConfigs[value].buyout = '到期买断'
        } else if (value === 'standard') {
            packageConfigs[value].renewal = '支持'
            packageConfigs[value].buyout = '到期买断'
        } else if (value === 'premium') {
            packageConfigs[value].renewal = '支持'
            packageConfigs[value].buyout = '提前买断'
        }
        
        // 初始化attribute和sku
        packageAttributes[value] = []
        packageSkus[value] = []
        
        // 初始化structure
        updateStructure(value)
    } else if (!selectedPackages.value.includes(value)) {
        // 如果取消选中，清除数据
        delete packageConfigs[value]
        delete packageAttributes[value]
        delete packageSkus[value]
        delete packageStructures[value]
    }
}

// 更新单个套餐的结构
const updateStructure = (packageType) => {
    // 基础结构：价格和库存
    packageStructures[packageType] = [
        { name: 'price', type: 'input', label: '价格', required: true },
        { name: 'stock', type: 'input', label: '库存', required: true }
    ]
    
    // 根据选择的租期天数，为每种租期添加对应的总租金售价字段
    rentPeriods.value.forEach(period => {
        const days = period.replace(/\D/g, '')
        packageStructures[packageType].push({
            name: `total_price_${days}`,
            type: 'input',
            label: `${period}总租金售价`,
            placeholder: `请输入${period}的总租金售价`,
            required: true
        })
    })
}

// 更新所有套餐的结构
const updateAllStructures = () => {
    selectedPackages.value.forEach(pkg => {
        updateStructure(pkg)
    })
}

// 监听租期变化，更新所有套餐的结构
watch(rentPeriods, () => {
    updateAllStructures()
}, { deep: true })

// 监听套餐选择变化
watch(selectedPackages, (newVal, oldVal) => {
    // 处理新增的套餐
    newVal.forEach(pkg => {
        if (!oldVal.includes(pkg)) {
            handlePackageChange(pkg)
        }
    })
    
    // 处理移除的套餐
    oldVal.forEach(pkg => {
        if (!newVal.includes(pkg)) {
            delete packageConfigs[pkg]
            delete packageAttributes[pkg]
            delete packageSkus[pkg]
            delete packageStructures[pkg]
        }
    })
})
</script>

<style scoped>
.package-selection, .sku-configuration {
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.package-config-form {
    margin-bottom: 20px;
    border-top: 1px solid #ebeef5;
    padding-top: 20px;
}

h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
}

.el-divider {
    margin: 16px 0;
}
</style> 