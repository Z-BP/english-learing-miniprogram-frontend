// 获取单词或句子 音频url
export const getAudioSrc = (text) => {
	const baseURL = 'http://dict.youdao.com/dictvoice'

	let src = `${baseURL}?audio=${text.toString().trim()}`
	return src;
}

// 播放
export const playAudio = (src, {
	autoplay = true,
	loop = false,
} = {}) => {
	if (src.toString().trim() === '') {
		console.log('请传入有意义的src');
		return;
	}
	const ctx = uni.createInnerAudioContext();
	ctx.autoplay = autoplay;
	ctx.src = src;
	ctx.loop = loop;
	ctx.onError((res) => {
		console.log(res.errMsg);
		console.log(res.errCode);
	});
}