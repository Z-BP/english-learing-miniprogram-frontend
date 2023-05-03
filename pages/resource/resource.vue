<template>
	<view class="padding  light bg-grey h-100vh">
		<u-toast ref="Toast"></u-toast>
		<!-- title -->

		<!-- 		<view class="module_title ">
			<text>Level : {{userInfo.levelTitle}}</text>
		</view> -->
		<!-- 卡片列表 -->
		<view class="grid col-2 margin-top resouce-list">
			<!-- 卡片项 -->
			<view v-for="video in videoList" :key="video.id" class="padding-right-sm">
				<view class="padding-sm bg-white margin-bottom-sm">
					<!-- cover -->

					<view class="cover" @click="goVideoDetail(video)">
						<u--image width="100%" height="180rpx" :src="video.cover ? video.cover : coverSrc"></u--image>
						<view class="playIcon">
							<u-icon name="play-circle-fill" size="32"></u-icon>
						</view>

					</view>


					<!-- title -->
					<view class="margin-top-sm text-black text-cut">
						<text>{{video.title}}</text>
					</view>

				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		getCurrentInstance
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'


	import {
		getUserInfo
	} from '/utils/auth/index.js'

	const {
		proxy
	} = getCurrentInstance()
	const Toast = ref(null);

	// const userInfo = ref(getUserInfo())
	const coverSrc = ref('/static/imgs/resource/cover.jpg')

	const videoList = ref([{
		"id": 1,
		"title": "视频1",
		"cover": "/static/imgs/resource/cover.jpg",
		"src": "https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4",
		"levelId": 1
	}, {
		"id": 2,
		"title": "视频1",
		"cover": "/static/imgs/resource/cover.jpg",
		"src": "https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4",
		"levelId": 1
	}])


	// 页面显示钩子
	onShow(() => {

		getVideoList()
	})

	const getVideoList = async () => {
		try {
			const {
				status,
				msg,
				data
			} = await proxy.$http.get('/video');
			if (!status) throw (msg);

			videoList.value = data;
		} catch (e) {
			//TODO handle the exception
			console.log(e);
			Toast.show({
				message: e.msg || e,
				type: 'error'
			})
		}
	}

	const goVideoDetail = (video) => {
		console.log('goVideoDetail');
		uni.navigateTo({
			url: '/pages/resource/video-detail/video-detail',
			passedParams: {
				video
			}
		})
	}
</script>
<style lang="scss" scoped>
	.h-100vh {
		min-height: 100vh;
	}

	.module_title {
		width: 65%;
		padding: 10rpx;
		margin: 20rpx auto;
		color: white;
		// font-weight: bold;
		font-size: 40rpx;
		text-align: center;

		border-radius: 200rpx;
		background-color: $uni-color-primary;
	}

	.resouce-list {
		margin-right: -20rpx;
	}

	.cover {
		position: relative;
	}

	.playIcon {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>