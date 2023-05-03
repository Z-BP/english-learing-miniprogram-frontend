<template>
	<view class="padding page bg-gradual-blue light">
		<view class="bg-white padding margin-top-lg">
			<view class="text-center text-xxl margin-tb">
				{{state.title}}
			</view>

			<!-- 统计数据 列表 -->
			<view class="flex justify-between padding-sm " style="width:100%">
				<view class="flex flex-direction align-center justify-center">
					<view class="count">
						{{qCount}}
					</view>
					<text>练习题数</text>
				</view>
				<view class="flex flex-direction align-center justify-center">
					<view class="count">
						{{errorCount}}
					</view>
					<text>错误题数</text>
				</view>
				<view class="flex flex-direction align-center justify-center">
					<view class="count">
						{{Number.parseFloat(((qCount - errorCount)/ qCount) * 100).toFixed(0)}}%
					</view>
					<text>正确率</text>
				</view>
			</view>


			<!-- 单词练习详细成绩 -->
			<view class="detail-wrap">
				<view class="detail-title">
					单词练习详细成绩
				</view>
				<!-- 具体数据 -->
				<view>
					<!-- 头部 -->
					<view class="grid margin-bottom text-center col-4 text-black text-bold">
						<view class="padding-xs">单词</view>
						<view class="padding-xs">中译英</view>
						<view class="padding-xs ">英译中</view>
						<view class="padding-xs">单词拼写</view>
					</view>
					<!-- 内容-->
					<view v-for="item in state.data" class="grid margin-bottom text-center col-4">

						<view class="padding-xs text-black text-bold">{{item.word}}</view>
						<view class="padding-xs text-xl text-bold ">
							<text v-if="item.cnToEn" class="lg  text-green cuIcon-check"></text>
							<text v-else class="lg text-red  cuIcon-close"></text>

						</view>
						<view class="padding-xs text-xl text-bold">
							<text v-if="item.enToCn" class="lg text-green cuIcon-check"></text>
							<text v-else class="lg text-red cuIcon-close"></text>

						</view>
						<view class="padding-xs text-xl text-bold">
							<text v-if="item.spelling" class="lg text-green cuIcon-check"></text>
							<text v-else class="lg text-red cuIcon-close"></text>
						</view>
					</view>
				</view>
			</view>


			<!-- button -->
			<view class="margin-tb-xl margin-lr-xl">
				<u-button type="primary" shape="circle" :disabled="disabled" text="继续学习" icon='play-circle'
					@click="continueStudy"></u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		onMounted,
		getCurrentInstance
	} from 'vue'

	const state = reactive({
		title: '',
		data: [{
			wordId: 8,
			word: "ruler",
			enToCn: true,
			cnToEn: true,
			spelling: false
		}, ]
	})

	// 错题数
	const errorCount = computed(() => {
		const typeArr = ['enToCn', 'cnToEn', 'spelling']
		const count = state.data.reduce((pre, cur) => {
			for (let key in cur) {
				typeArr.includes(key) && cur[key] === false ? pre++ : ''
			}
			return pre;
		}, 0)
		return count;

	})
	// 题目总数 默认每个单词三种题型
	const qCount = computed(() => {
		return state.data.length * 3;
	})

	onMounted(() => {
		const passedParams = getCurrentPages()[getCurrentPages().length - 1].$passedParams
		state.title = passedParams.unitTitle;
		state.data = passedParams.data
		console.log("passedParams: ", passedParams);
	})

	const continueStudy = () => {
		console.log('continueStudy');
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.count {
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		border: 4rpx solid $uni-color-success;
		border-radius: 50%;
	}

	.detail-wrap {
		position: relative;
		background-color: #effff5;
		border-radius: 20rpx;
		padding: 60rpx 0;
		margin-top: 60rpx;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	}

	.detail-title {
		position: absolute;
		top: 0;
		left: 50%;
		width: 60%;
		transform: translate(-50%, -50%);
		text-align: center;
		padding: 10rpx 0;
		border-radius: 20rpx;
		background-color: #ff9e2d;
		color: #fff;
	}
</style>