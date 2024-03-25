import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mongo Blog",
  description: "A VitePress Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/note/' },
      { text: '项目', link: '/project/' },
      { text: '面试', link: '/interview/' }
    ],

    sidebar: {
      '/note/': [
        {
          text: '笔记',
          items: [
            {
              text: 'SpringCloud', items: [
                {
                  text: '注册中心', link: '/note/SpringCloud/注册中心'
                }
              ]
            },
            { text: 'Java基础', link: '/note/Java基础.md' },
            { text: 'MySQL', link: '/note/MySQL' },
            { text: 'Redis', link: '/note/Redis' },
            { text: '事务', link: '/note/事务' },
            { text: 'RabbitMQ', link: '/note/RabbitMQ' }
          ]
        }
      ],
      '/project/': [
        {
          text: '项目',
          items: [
            { text: '第一篇笔记', link: '/project/第一个项目' }
          ]
        }
      ],
      '/interview/': [
        {
          text: '面试',
          items: [
            { text: '科脉技术', link: '/interview/科脉技术' },
            {
              text: '面试题', items: [
                {
                  text: 'Redis',
                  link: '/interview/subject/Redis'
                }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
