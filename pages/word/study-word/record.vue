<template>
	<view class="padding page bg-gradual-blue light">
		<u-toast ref="Toast"></u-toast>
		<!-- 单词练习详细成绩 -->
		<u-collapse :value="['0']">

			<u-collapse-item v-for="(unit,i) in state.data" :key="unit.id" :title="`unit${i+1} ${unit.title}`"
				:name="i">
				<view class="detail-wrap">
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
						<view v-for="{word,exercise_words} in unit.words" :key="word.id"
							class="grid margin-bottom text-center col-4">

							<view class="padding-xs text-black text-bold">{{word}}</view>
							<view class="padding-xs text-xl text-bold ">
								<text v-if="exercise_words.cnToEn" class="lg  text-green cuIcon-check"></text>
								<text v-else class="lg text-red  cuIcon-close"></text>

							</view>
							<view class="padding-xs text-xl text-bold">
								<text v-if="exercise_words.enToCn" class="lg text-green cuIcon-check"></text>
								<text v-else class="lg text-red cuIcon-close"></text>

							</view>
							<view class="padding-xs text-xl text-bold">
								<text v-if="exercise_words.spelling" class="lg text-green cuIcon-check"></text>
								<text v-else class="lg text-red cuIcon-close"></text>
							</view>
						</view>
					</view>
				</view>
			</u-collapse-item>

		</u-collapse>
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

	const {
		proxy
	} = getCurrentInstance();
	const Toast = ref(null);


	const state = reactive({
		title: '',
		data: [{}]
	})


	onMounted(() => {
		// const passedParams = getCurrentPages()[getCurrentPages().length - 1].$passedParams
		// state.title = passedParams.unitTitle;
		// state.data = passedParams.data
		// console.log("passedParams: ", passedParams);

		getExerciseData()
	})



	// 获取用户单词学习记录
	const getExerciseData = async () => {
		try {

			console.log('getExerciseData');
			const {
				status,
				data,
				msg
			} = await proxy.$http.get('/exercise/unit');
			if (!status) throw (msg);
			state.data = data;

		} catch (e) {
			//TODO handle the exception
			console.log(e);
			// 接口错误
			Toast.value.show({
				message: e.msg || e,
				type: 'error'
			})
		}

	}
</script>

<style lang="scss" scoped>
	.detail-wrap {
		position: relative;
		background-color: #effff5;
		border-radius: 20rpx;
		padding: 60rpx 0;
		margin: 15rpx 0;
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

	::v-deep .u-collapse {
		.u-cell {
			font-size: 32rpx;
			text-align: center;
			border-radius: 20rpx;
			background-color: #ff9e2d;
			margin: 15rpx 40rpx;

			.u-cell__title-text {
				color: #fff;
			}
		}

		.u-collapse-item__content__text {
			padding: 0;
		}
	}
</style>