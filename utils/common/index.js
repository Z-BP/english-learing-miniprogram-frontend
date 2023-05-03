/**
 * @description 生成26个小写字母
 * @return {Array}
 */
export function generateSmall() {
	let arr = [];
	// a 的unicode值 97
	for (let i = 97; i < 123; i++) {
		arr.push(String.fromCharCode(i));
	}
	return arr;
}

/**
 * @description 生成26个大写字母
 * @return {Array}
 */
export function generateBig() {
	let arr = [];
	// A的 unicode值 65
	for (let i = 65; i < 91; i++) {
		arr.push(String.fromCharCode(i));
	}
	return arr;
}