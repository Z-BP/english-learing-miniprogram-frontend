<template>
	<view class="page">
		<u-toast ref="Toast"></u-toast>
		<view v-for="(unit,index) in unitList" :key="unit.id" class="unit-item" @click="goEliminate(unit)">
			<!-- 左侧 -->
			<view class="flex align-center">
				<view class="order">
					{{index + 1}}
				</view>
				<view class="margin-left-sm">
					<view>unit{{index+1}} {{unit.title}}</view>
					<view v-if="unit.eliminate_words[0]?.finishDuration" style="display: inline-block;"
						class="text-sm padding-lr-sm padding-tb-xs margin-top-xs  text-center bg-blue light round">
						上次完成时间: <text>{{unit.eliminate_words[0]?.finishDuration}}</text>秒
					</view>

					<view v-else style="display: inline-block;"
						class="text-sm padding-lr-sm padding-tb-xs margin-top-xs  text-center bg-orange light round">
						未完成
					</view>

				</view>
			</view>
			<!-- 右侧 -->
			<view class="">
				<u-icon name="arrow-right" size="28"></u-icon>
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


	const unitList = ref([]);

	// onShow hook
	onShow(() => {
		console.log('onShow');
		// 获取数据
		getEliminateUnitList();
	})


	// 获取unit数据
	const getEliminateUnitList = async () => {
		try {
			// request
			const {
				status,
				data,
				msg
			} = await proxy.$http.get('/eliminate')
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



	// 进入消消乐
	const goEliminate = (unit) => {
		console.log('goEliminate', unit);
		uni.navigateTo({
			url: `/pages/word/eliminate-word/eliminate-word?unitId=${unit.id}&unitTitle=${unit.title}`
		})
	}
</script>

<style lang="scss">
	.unit-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
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
</style>