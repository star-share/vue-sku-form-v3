<template>
    <div>
        <div class="sku-form-container" :class="`sku-form-container-${theme}`" v-if="!disabled">
            <div class="sku-form-section" v-for="(attrItem, attrIndex) in myAttribute" :key="attrIndex">
                <div class="sku-form-title">{{ attrItem.name }}</div>
                <div class="sku-form-tags-box">
                    <el-checkbox-group v-model="checked[attrIndex]" :disabled="disabled" class="checkbox-group">
                        <el-checkbox 
                            v-for="(item, index) in attrItem.item" 
                            :key="index" 
                            :disabled="disabled"
                            :label="item.name" 
                            @change="checked => onCheckedChange(attrIndex, index, checked)"
                        >
                            <div class="sku-checkbox-content">
                                <img 
                                    v-if="item.image" 
                                    :src="item.image" 
                                    class="sku-option-image" 
                                    :alt="item.name"
                                />
                                <span>{{ item.name }}</span>
                            </div>
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="sku-form-add-tags" v-if="attrItem.canAddAttribute">
                    <el-input 
                        v-model="inputValues[attrIndex]"
                        placeholder="请输入规格名称" 
                        size="small"
                        @keyup.enter="onAddAttribute(attrIndex)"
                    >
                        <template #append>
                            <el-button :icon="Plus" @click="onAddAttribute(attrIndex)">添加</el-button>
                        </template>
                    </el-input>
                </div>
            </div>
        </div>

        <el-form 
            ref="formRef" 
            :model="form" 
            :rules="rules" 
            class="sku-form-table"
            :class="disabled ? 'sku-form-table-disabled' : ''"
        >
            <el-table
                :data="form.skuData"
                border
                style="width: 100%"
                :key="form.skuData.length"
            >
                <el-table-column 
                    v-for="(col, colIndex) in emitAttribute" 
                    :key="colIndex"
                    :label="col.name"
                    align="center"
                >
                    <template #default="{ row }">
                        <div class="sku-table-cell">
                            <img 
                                v-if="getAttributeImage(col.name, row[col.name])" 
                                :src="getAttributeImage(col.name, row[col.name])" 
                                class="sku-table-image" 
                            />
                            <span>{{ row[col.name] }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column 
                    v-for="(col, colIndex) in structure"
                    :key="colIndex"
                    :label="col.label"
                    align="center"
                >
                    <template #header v-if="col.batch !== false && col.type === 'input' && isBatch">
                        <div class="sku-form-batch">
                            <el-input v-model="batch[col.name]" :placeholder="`统一设置${col.label}`" size="small">
                                <template #append>
                                    <el-button @click="onBatchSet(col.name)">批量设置</el-button>
                                </template>
                            </el-input>
                        </div>
                    </template>

                    <template #default="{ row, $index }">
                        <div v-if="col.type === 'slot'">
                            <slot :name="col.name" :row="row" :index="$index" />
                        </div>
                        <el-form-item 
                            v-else 
                            :prop="`skuData.${$index}.${col.name}`" 
                            :class="`sku-form-${$index}-${col.name}`"
                        >
                            <el-tooltip
                                v-if="col.tips"
                                :content="col.tips"
                                placement="top"
                                :hide-after="0"
                            >
                                <el-icon class="sku-form-tips"><InfoFilled /></el-icon>
                            </el-tooltip>
                            <el-input 
                                v-model="row[col.name]"
                                size="small"
                                :placeholder="col.placeholder" 
                                :disabled="col.disabled"
                            />
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, toRefs, nextTick } from 'vue'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    /**
     * 原始规格数据
     * sourceAttribute: [
     *   { name: '颜色', item: ['黑', '金', '白'] },
     *   { name: '内存', item: ['16G', '32G'] },
     *   { name: '运营商', item: ['电信', '移动', '联通'] }
     * ]
     */
    sourceAttribute: {
        type: Array,
        default: () => []
    },
    /**
     * 已使用的规格数据，用于复原数据，支持v-model:attribute修饰符
     * attribute: [
     *   { name: '颜色', item: ['黑'] },
     *   { name: '运营商', item: ['电信', '移动', '联通'] }
     * ]
     */
    attribute: {
        type: Array,
        default: () => []
    },
    /**
     * 用于复原sku数据，支持v-model:sku修饰符
     * sku: [
     *   { sku: '黑;电信', price: 1, stock: 1 },
     *   { sku: '黑;移动', price: 2, stock: 2 },
     *   { sku: '黑;联通', price: 3, stock: 3 }
     * ]
     */
    sku: {
        type: Array,
        default: () => []
    },
    /**
     * 表格结构，注意name字段，用于输出sku数据
     */
    structure: {
        type: Array,
        default: () => [
            { name: 'price', type: 'input', label: '价格' },
            { name: 'stock', type: 'input', label: '库存' }
        ]
    },
    // sku 字段分隔符
    separator: {
        type: String,
        default: ';'
    },
    // 无规格的 sku
    emptySku: {
        type: String,
        default: ''
    },
    // 是否显示 sku 选择栏
    disabled: {
        type: Boolean,
        default: false
    },
    // 主题风格
    theme: {
        type: Number,
        default: 1
    },
    // 是否开启异步加载
    async: {
        type: Boolean,
        default: false
    },
    // 是否可添加属性值
    canAddAttribute: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:attribute', 'update:sku', 'validate'])

// 使用toRefs优化props解构，保持响应性
const { sourceAttribute, attribute, sku, structure, separator, emptySku, async: isAsync, canAddAttribute } = toRefs(props)

// 表单引用
const formRef = ref(null)
const isInit = ref(false)

// 输入框的值独立管理，避免深层次响应式问题
const inputValues = ref([])

// 数据
const form = reactive({
    skuData: []
})

// 批量设置暂存数据
const batch = reactive({})

// 属性数据(包含选中状态)
const myAttribute = ref([])

// 用于管理checkbox组的选中状态
const checked = ref([])

// 计算规则
const rules = computed(() => {
    const result = {}
    structure.value.forEach(item => {
        if (item.required) {
            const rule = { required: true, message: `请输入${item.label}`, trigger: 'blur' }
            if (item.validator) {
                rule.validator = item.validator
            }
            result[item.name] = [rule]
        } else if (item.validator) {
            result[item.name] = [{ validator: item.validator, trigger: 'blur' }]
        }
    })
    return result
})

// 是否显示批量设置
const isBatch = computed(() => {
    return structure.value.some(item => item.type === 'input' && item.batch !== false)
})

// 仅输出勾选的属性
const emitAttribute = computed(() => {
    return myAttribute.value.map(attr => {
        // 过滤选中的项目并包含完整的属性信息
        const selectedItems = attr.item
            .filter(item => item.checked)
            .map(item => {
                // 仅移除checked状态，保留其他所有属性
                const { checked, ...itemDetail } = item;
                return itemDetail;
            });
            
        return {
            name: attr.name,
            item: selectedItems
        };
    }).filter(attr => attr.item.length > 0);
})

// 初始化方法
const init = () => {
    nextTick(() => {
        isInit.value = true
        // 初始化 myAttribute
        const newMyAttribute = []
        // 根据 sourceAttribute 复原 myAttribute 的结构
        sourceAttribute.value.forEach(v => {
            const temp = {
                name: v.name,
                canAddAttribute: typeof v.canAddAttribute !== 'undefined' ? v.canAddAttribute : canAddAttribute.value,
                addAttribute: '',
                item: []
            }
            
            // 处理规格项，支持字符串或对象格式
            v.item.forEach(itemValue => {
                if (typeof itemValue === 'string') {
                    // 处理字符串类型的规格项（向后兼容）
                    temp.item.push({
                        name: itemValue,
                        checked: false
                    })
                } else {
                    // 处理对象类型的规格项（新格式）
                    temp.item.push({
                        ...itemValue,
                        checked: false
                    })
                }
            })
            
            newMyAttribute.push(temp)
        })
        
        // 初始化输入值数组
        inputValues.value = Array(sourceAttribute.value.length).fill('');
        
        // 根据 attribute 更新 myAttribute，处理已选中的属性
        attribute.value.forEach(attrVal => {
            newMyAttribute.forEach(myAttrVal => {
                if (attrVal.name === myAttrVal.name) {
                    attrVal.item.forEach(attrItem => {
                        const attrName = typeof attrItem === 'string' ? attrItem : attrItem.name;
                        
                        // 查找匹配的属性项
                        const existingItem = myAttrVal.item.find(myAttrItem => myAttrItem.name === attrName);
                        
                        if (existingItem) {
                            // 如果找到匹配项，标记为选中
                            existingItem.checked = true;
                        } else {
                            // 如果没找到，添加新项
                            myAttrVal.item.push({
                                ...(typeof attrItem === 'string' ? { name: attrItem } : attrItem),
                                checked: true
                            });
                        }
                    });
                }
            });
        });
        
        myAttribute.value = newMyAttribute
        
        // 因为 skuData 是实时监听 myAttribute 变化并自动生成，使用微任务确保已生成
        nextTick(() => {
            sku.value.forEach(skuItem => {
                form.skuData.forEach(skuDataItem => {
                    if (skuItem.sku === skuDataItem.sku) {
                        structure.value.forEach(structureItem => {
                            skuDataItem[structureItem.name] = skuItem[structureItem.name]
                        })
                    }
                })
            })
            isInit.value = false
        })
    })
}

// 获取属性的图片路径
const getAttributeImage = (attrName, attrValue) => {
    if (!attrName || !attrValue) return null;
    
    const attrGroup = myAttribute.value.find(attr => attr.name === attrName);
    if (!attrGroup) return null;
    
    const attrItem = attrGroup.item.find(item => item.name === attrValue);
    return attrItem?.image || null;
}

// 初始化属性
watch(
    attribute,
    () => {
        if (!isAsync.value) {
            init()
        }
    },
    { immediate: true, deep: true }
)

// 监听选中属性的变化
watch(myAttribute, () => {
    if (!isInit.value) {
        // 更新父组件
        emit('update:attribute', emitAttribute.value)
    }
    // 解决通过 $emit 更新后无法拿到 attribute 最新数据的问题
    nextTick(() => {
        if (emitAttribute.value.length !== 0) {
            combinationAttribute()
        } else {
            form.skuData = []
            const obj = {
                sku: emptySku.value
            }
            structure.value.forEach(v => {
                if (!(v.type === 'slot' && v.skuProperty === false)) {
                    obj[v.name] = typeof v.defaultValue !== 'undefined' ? v.defaultValue : ''
                }
            })
            form.skuData.push(obj)
        }
        clearValidate()
    })
}, { deep: true })

// 监听skuData变化
watch(() => form.skuData, (newValue, oldValue) => {
    if (!isInit.value || (newValue.length === 1 && newValue[0].sku === emptySku.value)) {
        // 如果有老数据，或者 sku 数据为空，则更新父级 sku 数据
        if (oldValue.length || !sku.value.length) {
            // 更新父组件
            const arr = [];
            newValue.forEach(v1 => {
                const obj = {
                    sku: v1.sku,
                    skuData: v1.skuData || {} // 完整的SKU数据
                };
                
                structure.value.forEach(v2 => {
                    if (!(v2.type === 'slot' && v2.skuProperty === false)) {
                        obj[v2.name] = v1[v2.name] || (typeof v2.defaultValue !== 'undefined' ? v2.defaultValue : '');
                    }
                });
                
                arr.push(obj);
            });
            
            emit('update:sku', arr);
        }
    }
}, { deep: true })

// 组合属性，生成SKU表格数据
const combinationAttribute = (index = 0, dataTemp = []) => {
    if (index === 0) {
        for (let i = 0; i < emitAttribute.value[0].item.length; i++) {
            const attrItem = emitAttribute.value[0].item[i];
            const attrName = attrItem.name;
            
            const obj = {
                sku: attrName,
                [emitAttribute.value[0].name]: attrName,
                skuData: {  // 存储完整的SKU对象数据
                    [emitAttribute.value[0].name]: attrItem
                }
            };
            
            structure.value.forEach(v => {
                if (!(v.type === 'slot' && v.skuProperty === false)) {
                    obj[v.name] = typeof v.defaultValue !== 'undefined' ? v.defaultValue : '';
                }
            });
            
            dataTemp.push(obj);
        }
    } else {
        const temp = [];
        for (let i = 0; i < dataTemp.length; i++) {
            for (let j = 0; j < emitAttribute.value[index].item.length; j++) {
                const attrItem = emitAttribute.value[index].item[j];
                const attrName = attrItem.name;
                const newItem = JSON.parse(JSON.stringify(dataTemp[i]));
                
                // 添加新的属性名称
                newItem[emitAttribute.value[index].name] = attrName;
                
                // 更新SKU编码
                newItem['sku'] = [newItem['sku'], attrName].join(separator.value);
                
                // 更新完整的SKU对象数据
                newItem.skuData = {
                    ...newItem.skuData,
                    [emitAttribute.value[index].name]: attrItem
                };
                
                temp.push(newItem);
            }
        }
        dataTemp = temp;
    }
    
    if (index !== emitAttribute.value.length - 1) {
        combinationAttribute(index + 1, dataTemp);
    } else {
        if (!isInit.value || isAsync.value) {
            // 将原有的 sku 数据和新的 sku 数据比较，相同的 sku 则把原有的 sku 数据覆盖到新的 sku 数据里
            for (let i = 0; i < form.skuData.length; i++) {
                for (let j = 0; j < dataTemp.length; j++) {
                    if (form.skuData[i].sku === dataTemp[j].sku) {
                        // 保留原SKU数据中的属性值
                        structure.value.forEach(structureItem => {
                            dataTemp[j][structureItem.name] = form.skuData[i][structureItem.name];
                        });
                        
                        // 保留原SKU数据中的完整对象信息
                        dataTemp[j].skuData = {
                            ...dataTemp[j].skuData,
                            ...form.skuData[i].skuData
                        };
                    }
                }
            }
        }
        form.skuData = dataTemp;
    }
}

// 查找属性的详细信息
const findAttributeDetail = (attrName, itemName) => {
    const attrGroup = myAttribute.value.find(attr => attr.name === attrName);
    if (!attrGroup) return { name: itemName };
    
    const item = attrGroup.item.find(item => item.name === itemName);
    if (!item) return { name: itemName };
    
    // 返回完整的属性对象，仅过滤掉checked状态
    const { checked, ...itemDetail } = item;
    return itemDetail;
}

// 添加新属性值
const onAddAttribute = (index) => {
    const newValue = inputValues.value[index]?.trim();
    
    if (!newValue) {
        ElMessage.warning('请输入规格名称');
        return;
    }
    
    // 检查分隔符
    if (newValue.includes(separator.value)) {
        ElMessage.warning(`规格里不允许出现「 ${separator.value} 」字符，请检查后重新添加`);
        return;
    }
    
    // 检查重复
    if (myAttribute.value[index].item.some(item => item.name === newValue)) {
        ElMessage.warning('请勿添加相同规格');
        return;
    }
    
    // 添加新属性，并默认选中
    myAttribute.value[index].item.push({
        name: newValue,
        checked: true
    });
    
    // 清空输入框
    inputValues.value[index] = '';
}

// 批量设置
const onBatchSet = (field) => {
    if (batch[field] !== '') {
        form.skuData.forEach(row => {
            row[field] = batch[field]
        })
        
        batch[field] = ''
    }
}

// 表单验证
const validate = (callback) => {
    if (formRef.value) {
        formRef.value.validate(valid => {
            callback && callback(valid)
        })
    } else {
        callback && callback(false)
    }
}

// 自定义验证
const validateFieldByColumns = (columns, callback) => {
    if (!formRef.value) {
        callback && callback(false)
        return
    }

    const propPaths = []
    form.skuData.forEach((_, i) => {
        columns.forEach(col => {
            propPaths.push(`skuData.${i}.${col}`)
        })
    })
    
    formRef.value.validateField(propPaths, valid => {
        callback && callback(valid)
    })
}

// 按行验证
const validateFieldByRows = (index, prop, callback) => {
    if (formRef.value) {
        formRef.value.validateField([`skuData.${index}.${prop}`], valid => {
            callback && callback(valid)
        })
    } else {
        callback && callback(false)
    }
}

// 清除验证
const clearValidate = () => {
    if (formRef.value) {
        formRef.value.clearValidate()
    }
}

// 添加新属性（带图片）
const onAddAttributeWithImage = (index, name, imagePath) => {
    if (!name || typeof name !== 'string') {
        ElMessage.warning('请提供有效的规格名称');
        return;
    }
    
    const newValue = name.trim();
    
    if (!newValue) {
        ElMessage.warning('规格名称不能为空');
        return;
    }
    
    // 检查分隔符
    if (newValue.includes(separator.value)) {
        ElMessage.warning(`规格里不允许出现「 ${separator.value} 」字符，请检查后重新添加`);
        return;
    }
    
    // 检查重复
    if (myAttribute.value[index].item.some(item => item.name === newValue)) {
        ElMessage.warning('请勿添加相同规格');
        return;
    }
    
    // 添加新属性（带图片），并默认选中
    myAttribute.value[index].item.push({
        name: newValue,
        image: imagePath || '',
        checked: true
    });
    
    return true;
}

// 监听属性变化，初始化checked数组
watch(() => myAttribute.value, () => {
    // 初始化checked数组
    checked.value = myAttribute.value.map(attr => 
        attr.item.filter(item => item.checked).map(item => item.name)
    )
}, { deep: true, immediate: true })

// 处理checkbox变化
const onCheckedChange = (attrIndex, itemIndex, isChecked) => {
    // 更新原始item的checked状态
    myAttribute.value[attrIndex].item[itemIndex].checked = isChecked
}

// 暴露方法
defineExpose({
    init,
    validate,
    validateFieldByColumns,
    validateFieldByRows,
    clearValidate,
    onAddAttributeWithImage
})
</script>

<style lang="scss" scoped>
.sku-form {
    &-container {
        margin-bottom: 10px;

        &-1 {
            .sku-form-section {
                margin-bottom: 10px;
            }

            .sku-form-title {
                margin-bottom: 10px;
                font-weight: bold;
            }

            .sku-form-tags-box {
                margin-bottom: 10px;

                .checkbox-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
            }
        }

        &-2 {
            padding: 10px;
            border: 1px solid #ebeef5;
            border-radius: 4px;

            .sku-form-section {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 10px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            .sku-form-title {
                min-width: 70px;
                margin-right: 10px;
                font-weight: bold;
            }

            .sku-form-tags-box {
                flex: 1;
                margin-right: 10px;

                .checkbox-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
            }

            .sku-form-add-tags {
                width: 230px;
            }
        }
    }

    &-table {
        :deep(.el-table .cell) {
            padding: 0 5px;
        }

        :deep(.el-form-item) {
            margin-bottom: 0;
        }

        :deep(.el-form-item__content) {
            min-height: 32px;
            display: flex;
            align-items: center;
        }

        &-disabled {
            .el-table {
                pointer-events: none;
            }
        }
    }

    &-batch {
        margin-bottom: 5px;
    }

    &-tips {
        margin-right: 5px;
        color: #409eff;
        cursor: pointer;
    }
}

// 新增样式 - 规格选项相关
.sku-checkbox-content {
    display: flex;
    align-items: center;
    gap: 4px;
}

.sku-option-image {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 2px;
}

.sku-table-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.sku-table-image {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 2px;
}
</style>

