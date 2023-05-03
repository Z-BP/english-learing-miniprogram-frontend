<template>
	<view class="container" @tap="hideToolContext">
		<view :style="canvasStyle" class="canvas-wrap">
			<canvas style="width: 100%;height: 100%;" canvas-id="firstCanvas" id="firstCanvas" @touchmove="onTouchMove"
				@touchstart="onTouchStart" @touchend="onTouchEnd"></canvas>
		</view>
		<view class="toolbar">


			<view class="toolbar-top">
				<view class="item" @tap.stop='chooseLineColor'>
					<u-icon label="颜色" bold size="32" labelPos="bottom" name="/static/imgs/icon/color.png"></u-icon>
				</view>
				<view class="item" @tap.stop='chooseLineWidth'>
					<u-icon label="宽度" size="32" labelPos="bottom" name="/static/imgs/icon/line-width.png"></u-icon>
				</view>

			</view>


			<view v-if="isChooseWidth" class="toolbar-bottom toolbar-width">
				<view class="slider-box">
					<slider @change="widthSliderChange" min="1" max="10" :value="lineWidth" show-value></slider>
				</view>
			</view>
			<view v-if="isChooseColor" class="toolbar-bottom">
				<view class="color-box">
					<view v-for="color in allColor"
						:class="color === lineColor ?  'color-point color-point--active' : 'color-point'"
						:data-selected="color" :style="{
							background: color
						}" @tap.stop='lineColorChange'></view>
				</view>
			</view>

		</view>



		<!-- 字母选择 -->
		<view style="margin-top: 20rpx">
			<u-scroll-list>
				<view v-for="(letter, index) in letterList" :key="index" :class="scollLetterClass(letter)"
					@click="changeLetter(letter)">
					{{letter}}
				</view>
			</u-scroll-list>
		</view>






		<!-- 	<view class="buttons">
			<u-button type="primary" :plain="true" text="button"></u-button>
		</view> -->
	</view>

</template>
<script>
</script>
<script setup>
	import {
		getCurrentInstance,
		onMounted,
		reactive,
		ref,
		computed
	} from 'vue'

	import {
		generateBig
	} from '/utils/common/index.js'
	import LetterTracer from './letterTracer.js'


	// 字母列表样式
	const scollLetterClass = computed(() => {
		return (letter) => {
			// letter: 字母值
			const classList = ['scoll-letter'];
			if (letter === curLetter.value) {
				classList.push('scoll-letter--active')
			}


			return classList.join(' ')
		}
	})

	const curLetter = ref('A');
	const letterList = reactive(generateBig())

	// 切换当前描红字母
	const changeLetter = (letter) => {
		console.log('changeLetter');
		curLetter.value = letter
		tracer.setLetter(curLetter.value);
	}


	const canvasStyle = reactive({
		width: 700 + 'rpx',
		height: '60vh',
	})


	// 画笔宽度和颜色
	const isChooseWidth = ref(false);
	const isChooseColor = ref(false);
	const allColor = reactive(['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c',
		'#00a2e8', '#ffaec9', '#a349a4', '#ffffff', '#c3c3c3'
	])
	const chooseLineWidth = () => {

		isChooseColor.value = false;
		isChooseWidth.value = true;

	}
	const chooseLineColor = () => {
		isChooseWidth.value = false;
		isChooseColor.value = true;
	}

	let lineColor = ref(allColor[4])
	const lineColorChange = (e) => {
		console.log('lineColorChange', e);
		lineColor.value = e.target.dataset.selected;
		tracer.setFillStyle(lineColor.value)
		// isChooseColor.value = false;
		// isChooseWidth.value = false;
	}
	let lineWidth = ref(5)
	const widthSliderChange = (e) => {
		console.log('widthSliderChange', e);
		lineWidth.value = e.detail.value
		tracer.setFillWidth(lineWidth.value)
	}






	let ctx = null;
	let tracer = null;


	let onTouchMove, onTouchStart, onTouchEnd;
	// *******************Mounted hook****************
	onMounted(async () => {
		console.log('onMounted');
		ctx = uni.createCanvasContext('firstCanvas', getCurrentInstance());
		const {
			width,
			height,
			left,
			right,
			top,
			bottom
		} = await queryNodeClientRect('#firstCanvas');
		tracer = new LetterTracer(ctx, {
			width,
			height,
			left,
			right,
			top,
			bottom
		})

		tracer.setFillStyle(lineColor.value)
		tracer.setFillWidth(lineWidth.value)
		tracer.setLetter(curLetter.value);

		console.log('tracer', tracer)
		onTouchMove = tracer.onTouchMove.bind(tracer);
		onTouchStart = tracer.onTouchStart.bind(tracer);
		onTouchEnd = tracer.onTouchEnd.bind(tracer);

	})


	// 隐藏工具内容
	const hideToolContext = () => {
		isChooseColor.value = false;
		isChooseWidth.value = false;
	}




	/**
	 * @description uiniapp 查询结点布局信息
	 * @param {string} 选择器
	 * @return {NodesRef} 
	 * */
	const queryNodeClientRect = (selector) => {
		return new Promise((resolve, reject) => {
			const query = uni.createSelectorQuery();
			const node = query.select(selector);
			node.boundingClientRect(data => {
				console.log("得到布局位置信息" + JSON.stringify(data));
				console.log("节点离页面顶部的距离为" + data.top);
				resolve(data)
			}).exec();

		})


	}
</script>

<style lang="scss">
	.container {
		padding: 20rpx;
	}

	.canvas-wrap {
		background: #deede7;
		margin-bottom: 40rpx;
		margin-top: 50rpx;
		border-radius: 40rpx;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}


	.toolbar {
		position: relative;
	}

	@keyframes toolbarAnimation {
		// 0% {
		// 	top: 200%;
		// }

		// 100% {
		// 	top: 100%;
		// }
		0% {
			height: 0;
		}

		100% {
			height: 100rpx;
		}
	}

	.toolbar-bottom {
		width: 100%;
		height: 100rpx;
		background-color: #9dc9b6;
		border-bottom: 1rpx solid #9dc9b6;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		animation-name: toolbarAnimation;
		animation-duration: 0.2s;
		animation-timing-function: ease;
		overflow: hidden;
	}

	.toolbar-width {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.slider-box {
		width: 80%;
	}

	.color-box {
		width: 750rpx;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		overflow: auto;
		align-content: space-around;

	}

	.color-point {
		flex: none;
		width: 60rpx;
		height: 60rpx;
		margin: 20rpx 30rpx;
		border-radius: 50%;
		box-shadow: 0 0 0 4rpx transparent;
	}

	.color-point--active,
	.color-point:active {
		box-shadow: 0 0 0 4rpx #fff;
	}



	.toolbar-top {
		display: flex;
		justify-content: center;
		align-items: center;
		// background-color: #d5fff8;
		border-radius: 20rpx;
	}



	.toolbar-top .item {
		padding: 10rpx;
		border-radius: 15rpx;
		box-sizing: border-box;
	}

	.toolbar-top .item:active {

		border: 1rpx solid #9dc9b6;

	}

	.toolbar-top .item+.item {
		margin-left: 30rpx;
	}

	.buttons {
		// margin-top: 120rpx
	}


	.scoll-letter {
		font-size: 40rpx;

		padding: 30rpx;

		background: #deede7;
		margin-right: 20rpx;

		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	}

	.scoll-letter--active,
	.scoll-letter:active {
		/* border: 0rpx solid #2a0d21; */
		/* transform: translateZ(-30px); */
		background: #CCCCFF;
		color: #fff;
		/* position: relative; */
		/* top: 20px; */
		/* font-size: 50rpx; */
		font-weight: bold;
	}
</style>