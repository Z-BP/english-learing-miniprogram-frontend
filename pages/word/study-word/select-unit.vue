<template>
	<view class="page">
		<u-toast ref="Toast"></u-toast>
		<view v-for="(unit,index) in unitList" :key="unit.id" class="unit-item">
			<!-- 头部 -->
			<view class="flex justify-between align-center bg-grey light">
				<view class=" bg-yellow light unit-title">
					<text class="text-xl text-black">unit{{index+1}} {{unit.title}}</text>

				</view>
				<view class="margin-right-sm" style="color: #666; background-color: #dfe6e67d;">
					共<text class="text-orange">{{unit.wordCount}}</text>个单词
				</view>
			</view>

			<!-- item list-->
			<view class="flex padding">
				<!-- item -->
				<view v-for="blockIndex in blockCount(unit.id)" :key="i" class="text-xxl bg-blue light block"
					@click="enterStudy(unit, blockIndex - 1)">
					{{blockIndex}}
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
		getCurrentInstance,
		onMounted
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'


	const {
		proxy
	} = getCurrentInstance();
	const Toast = ref(null);



	// onShow hook
	onShow(() => {
		getUnitList();
	})

	const unitList = ref([1]);
	const blockCount = computed(() => {
		return (unitId) => {
			const size = 4; // 每个块的最大单词个数
			const unit = unitList.value.find(item => {
				return item.id == unitId;
			})
			return unit.wordCount ? Math.ceil(unit.wordCount / size) : 0;

		}
	})

	// 获取unit数据
	const getUnitList = async () => {
		try {
			// request
			const {
				status,
				data,
				msg
			} = await proxy.$http.get('/levels/units')
			if (!status) throw (msg);

			unitList.value = data;

		} catch (e) {
			//TODO handle the exception
			console.log('e', e);
			// 接口错误
			Toast.value.show({
				message: e.msg || e,
				type: 'error'
			});
		}


	}






	/**
	 * @description 进入单词先例
	 * @param {object} unit 
	 * @param {number} index unit下的第几个块 默认4个单词为一块?  
	 * */
	const enterStudy = (unit, index) => {
		console.log('enterStudy');
		uni.navigateTo({
			url: `/pages/word/study-word/study-word?unitId=${unit.id}&unitTitle=${unit.title}&blockIndex=${index}`
		})
	}
</script>

<style lang="scss">
	.unit-item {
		overflow: hidden;
		margin: 32rpx;
		border-radius: 32rpx;
		box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
		background-color: #fff;
	}

	.order {
		background-color: #99CCFF;
		color: #fff;
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 40rpx;
		font-weight: bold;
		border-radius: 50%;
	}

	.unit-title {
		position: relative;
		padding: 10rpx 40rpx 10rpx 60rpx;
		border-radius: 0 0 30rpx 0;
		color: #000;


	}

	.unit-title::before {
		display: block;
		content: "";
		position: absolute;
		width: 10rpx;
		height: 20rpx;
		background: #ff5555;
		left: 30rpx;
		top: 50%;
		transform: translateY(-50%)
	}

	.block {
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		margin-right: 30rpx;
		border-radius: 20rpx;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	}
</style>