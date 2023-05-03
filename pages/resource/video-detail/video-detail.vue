<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view>
				<video id="myVideo" :src="src" @error="videoErrorCallback" controls autoplay :title="title"></video>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				src: 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4',
				title: '视频全屏标题',
			}
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif
		},
		onLoad() {
			// 获取页面参数
			const passedParams = getCurrentPages()[getCurrentPages().length - 1].$passedParams;
			this.src = passedParams.video.src;
			this.title = passedParams.video.title
			console.log('passedParams', passedParams);
		},
		methods: {
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
		}
	}
</script>


<style lang="scss">
	#myVideo {
		width: 100%;
		margin-top: 200rpx;
	}
</style>