<template>
	<view>
		<u-popup :show="show" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @open="$emit('open')"
			@close="$emit('close')">


			<view class="view-container" :style="{
				width: props.width,
				height: props.height
			}">
				<text v-if="!!title" class="view-title">{{title}}</text>
				<view v-if="ShowCloseButton" class="view-close">
					<u-icon name="close-circle-fill" color="#FF9933" labelColor="#000" size="32"
						@click="close"></u-icon>
				</view>
				<view class="view-list">
					<!-- 内容插槽 -->
					<slot></slot>
				</view>
				<view class="botoom-buttons">
					<view v-if="showCancelButton" class="btn-container">
						<u-button :text="cancelText" color="rgb(117,211,242)" shape="circle" throttleTime=" 700"
							@click="onCancel"></u-button>
					</view>
					<view v-if="showConfirmButton" class="btn-container">
						<u-button :text="confirmText" color="rgb(117,211,242)" shape="circle" throttleTime=" 700"
							@click="onConfirm"></u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang=ts>
	import { ref } from 'vue'
	const props = defineProps({
		width: {
			type: String,
			default() {
				return '80vw'
			}
		},
		height: {
			type: String,
			default() {
				return '30vh'
			}

		},
		// title
		title: {
			type: String,
		},
		// 是否显示按钮
		ShowCloseButton: {
			type: Boolean,
			default() {
				return true
			}
		},
		showCancelButton: {
			type: Boolean,
			default() {
				return true
			}
		},
		showConfirmButton: {
			type: Boolean,
			default() {
				return true
			}
		},

		confirmText: {
			type: String,
			default() {
				return '确认'
			}
		},
		cancelText: {
			type: String,
			default() { return '取消' }
		},

	})

	// console.log('props', props);
	// 开关函数
	const emit = defineEmits(['open', 'close', 'confirm', 'cancel'])
	const show = ref(false);
	const close = () => {
		show.value = false;
		emit('close');


	}
	const open = () => {
		show.value = true;
		emit('open');
	}
	defineExpose({
		open,
		close
	})
	// 开关事件

	const onCancel = () => {
		// close();
		emit('cancel')
	}
	const onConfirm = () => {
		emit('confirm')
	}
</script>

<style lang="scss" scoped>
	// 弹窗样式
	.view-container {
		// width: 700rpx;
		// width: 80vw;
		// height: 30vh;
		position: relative;
		padding: 35px 34rpx 34rpx 34rpx;
		border-radius: 16px;
		background-color: #ecd9a7;
	}

	.view-title {
		display: inline-block;
		padding: 6px;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);

		background-color: #ce6772;
		border-radius: 8px;
		box-shadow: 0px 5px 2px 0px rgba(200, 86, 98, 0.3);
		font-size: 18px;
		color: #fff;
		font-weight: bold;
		letter-spacing: 0.7em;
		text-indent: 0.7em;
	}

	.view-close {
		position: absolute;
		top: -5px;
		right: 2px;
		cursor: pointer;
	}

	.view-list {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 8px;
		overflow: auto;
	}


	.botoom-buttons {
		display: flex;
		justify-content: center;
		margin-top: $uni-spacing-col-base;
	}

	.btn-container {
		width: 40%;
	}

	.btn-container:nth-child(2) {
		margin-left: 40rpx;
	}
</style>