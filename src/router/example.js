// 示例路由
export default [
    {
        path: '/',
        redirect: '/basic'
    },
    {
        path: '/basic',
        component: () => import('../examples/basic.vue'),
        meta: {
            title: '基础用法'
        }
    },
    {
        path: '/customize',
        component: () => import('../examples/customize.vue'),
        meta: {
            title: '自定义表格结构'
        }
    },
    {
        path: '/theme',
        component: () => import('../examples/theme.vue'),
        meta: {
            title: '主题切换'
        }
    },
    {
        path: '/examples',
        component: () => import('../examples/SkuFormExamples.vue'),
        meta: {
            title: '综合测试用例'
        }
    },
    {
        path: '/rich-media',
        component: () => import('../examples/rich-media.vue'),
        meta: {
            title: '富媒体规格'
        }
    }
]
