<template>
	<view class="wrapper">
		<!-- 轮播图 -->
		<view class="swiper-wrap">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000">
				<swiper-item v-for="(url, index) in bannerList" :key="index" class="swiper-item">
					<image mode="aspectFit" :src="url" @error="imageError"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 学习音标 -->
		<view class="module-box">
			<!-- title -->
			<view class="module-title">
				<text>语音学习</text>
			</view>
			<!-- mudules -->
			<view class="module-contents">
				<view v-for="item in soundmarkList" :key="item.url" class="item" @click="handleModuleTab(item.pageUrl)">
					<image :src="item.url"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
		<!-- 单词学习 -->
		<view class="module-box">
			<!-- title -->
			<view class="module-title">
				<text>单词学习</text>
			</view>
			<!-- mudules -->
			<view class="module-contents">
				<view v-for="item in wordStudyList" :key="item.url" class="item" @click="handleModuleTab(item.pageUrl)">
					<image :src="item.url"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList: [
					'/static/imgs/home/banner_1.png',
					'/static/imgs/home/banner_2.jpg',
					'/static/imgs/home/banner_3.png'
				],
				soundmarkList: [{
					url: "/static/imgs/home/pingdu.png",
					text: "字母点读",
					pageUrl: "/pages/soundmark/letter-reading/letter-reading"
				}, {
					url: "/static/imgs/home/绘画.png",
					text: "字母描红",
					pageUrl: "/pages/soundmark/letter-draw/letter-draw"
				}],
				wordStudyList: [{
						url: "/static/imgs/home/记单词.png",
						text: "单词学习",
						pageUrl: "/pages/word/study-word/select-unit"
					},
					{
						url: "/static/imgs/home/zimu.png",
						text: "单词消消乐",
						pageUrl: "/pages/word/eliminate-word/select-unit"
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			imageError() {
				console.log('imageError')
			},
			/**
			 * @description 模块触摸事件处理函数
			 * */
			handleModuleTab(pageUrl) {
				console.log('handleModuleTab', pageUrl);
				uni.navigateTo({
					url: pageUrl,
				}).then(res => {
					console.log('res', res)
				}).catch(err => console.log('err', err))
			}
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 300rpx;

	}

	.swiper-wrap {
		margin-bottom: 100rpx;
	}

	.swiper-item {
		display: block;
		height: 100%;
	}

	.swiper-item image {
		width: 100%;
	}

	/* module */
	.module-box {
		// background-color: aqua;
	}

	.module-title {
		margin: 18rpx 0;
		font-size: 40rpx;
		font-weight: bold;
	}

	.module-contents {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.module-contents .item {
		width: 48%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		margin-bottom: 24rpx;
		padding: 20rpx;
		background-color: #e9ecf0;
		border-radius: 15px;


		image {
			width: 90rpx;
			height: 90rpx;
			margin-right: 10rpx;
		}
	}
</style>