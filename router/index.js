import uniCrazyRouter from "uni-crazy-router";

import {
	setUserInfo,
	getUserInfo
} from '../utils/auth/index.js'
export function setupRouter(app) {
	// 接收vue3的实例，并注册uni-crazy-router
	app.use(uniCrazyRouter)
}

uniCrazyRouter.beforeEach(async (to, from, next) => {
	// 逻辑代码
	console.log('beforeEach');
	const user = getUserInfo();
	if (!user.token && to.url !== 'pages/account/account') {

		uniCrazyRouter.afterNotNext(() => {
			// 拦截路由
			// 关闭所有页面，跳转到登录页
			uni.reLaunch({
				url: '/pages/account/account'
			})
		})

		return // 拦截路由，不执行next
	}

	// 暂时手动设置

	next();

})

uniCrazyRouter.afterEach((to, from) => {
	// 逻辑代码
	console.log('afterEach');
	const user = getUserInfo();
	if (!user.token && to.url !== 'pages/account/account') {
		// 关闭所有页面，跳转到登录页
		uni.reLaunch({
			url: '/pages/account/account'
		})
	}

	// uni.setStorageSync('user_info', JSON.stringify({
	// 	"id": 1,
	// 	"userName": "zbp",
	// 	"levelId": 1,
	// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlck5hbWUiOiJ6YnAiLCJpYXQiOjE2ODIyMTA4ODUsImV4cCI6MTY4MjI5NzI4NX0.9iW5QLKBNvg-S-L5T7iiT987-efCDuOEPj9efEiS6To",
	// 	"levelTitle": "三年级"
	// }))
})

uniCrazyRouter['on' + 'Error']((to, from) => {
	// 逻辑代码
})