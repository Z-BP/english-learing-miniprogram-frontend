// 缓存用户信息
const userKey = 'user_info'
export function setUserInfo(data) {
	return uni.setStorageSync(
		userKey,
		JSON.stringify(data)
	)
}
// 获取缓存的用户信息
export function getUserInfo() {
	const value = uni.getStorageSync(userKey);
	return value.toString() === '' ? '' : JSON.parse(value);
}

// 清楚用户信息
export function clearUserInfo() {
	return uni.clearStorageSync(userKey);
}