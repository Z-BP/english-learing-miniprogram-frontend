<template>
	<view class="container page">
		<u-toast ref="Toast"></u-toast>
		<view class="main">
			<!-- title -->
			<view class="main-title">{{unit.title}}</view>
			<!-- 功能栏 -->
			<view class="top-tools">
				<view class="clock">
					<image class="icon" :src="imgs.clock" mode=""></image>
					<u-count-down ref="countDownRef" :time="maxTime" format="ss" @change="onCountDownChange"
						@finish="onCountDownFinish"></u-count-down>
				</view>
				<view class="bckg-audio" @click="toggleBckgAudio">
					<image v-if="isBgAudio" class="icon" :src="imgs.yangShengQi" mode=""></image>
					<image v-else class="icon" :src="imgs.yangShengQiOff" mode=""></image>
				</view>
			</view>
			<!-- 单词游戏区 -->
			<view class="game-body">
				<template v-for="(item,index) in dataList" :key="index">
					<view :class="wordClass(item)" @click="handleWordClick(item)">
						{{item.type === 'word' ?  item.word : item.explains}}
					</view>

				</template>

			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="botoom-buttons">
			<view class="btn-container">
				<u-button icon="eye" text="瞄一眼" color="#ffe983" shape="circle" :customStyle="btnClass"
					throttleTime="700" @click="viewWordList"></u-button>
			</view>
			<view class="btn-container">
				<u-button :icon="imgs.reset" text="重新开始" color="#ffe983" shape="circle" :customStyle="btnClass"
					throttleTime="700" @click="gameReset"></u-button>
			</view>
		</view>




		<!-- 瞄一眼 -->
		<my-modal ref="wordListModal" title="喵一眼" width="700rpx" height="75vh" :showCancelButton="false"
			:showConfirmButton="false" @close="onViewModalClose">
			<template>
				<u-cell-group>
					<template v-for="word in wordList" :key="word.value">
						<u-cell :title="word.word" :label="word.explains" center>
							<template #value>
								<u-icon name="volume-fill" color="#FF9933" size="24"
									@click="handleWordAudio(word)"></u-icon>
							</template>
						</u-cell>
					</template>
				</u-cell-group>
			</template>
		</my-modal>


		<!-- 成功弹窗 -->
		<my-modal ref="successModal" title="恭喜" width="80vw" cancelText="下一关" confirmText="重玩" :ShowCloseButton='false'
			@cancel="nextLevel" @confirm="gameReset">
			<template>
				<view class="result">
					<h2 class="result--success__main">闯关成功</h2>
					<view class="result--success__text">
						<u-icon style="margin: 10px" name="clock-fill" color="#FF9933" size="18"></u-icon>
						<text style="margin-left: 6px;">本次用时<text class="main-color">{{usedTime}}</text>秒</text>
					</view>
				</view>

			</template>




		</my-modal>
		<!-- 失败弹窗 -->
		<my-modal ref="failModal" title="闯关超时" width="80vw" cancelText="先不闯了" confirmText="再次闯关"
			:ShowCloseButton='false' @cancel="onFailModalCancel" @confirm="gameReset">
			<template>
				<view class="result result--fail">
					<text>本次闯关超时啦</text>
					<text>不要灰心再来一次</text>
				</view>

			</template>
		</my-modal>


	</view>
</template>

<script>
	import * as dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	dayjs.extend(duration);

	import {
		shuffle
	} from 'lodash-es'
	import {
		playAudio,
		getAudioSrc
	} from '/utils/dict/index.js'


	import myModal from "/components/my-modal.vue"
	export default {
		components: {
			myModal
		},

		data() {
			return {
				imgs: {
					clock: '/static/imgs/icon/clock_fill.png',
					yangShengQi: '/static/imgs/icon/yangshengqi.png',
					yangShengQiOff: '/static/imgs/icon/yangshengqi-off.png',
					reset: '/static/imgs/icon/reset.png'
				},
				// 当前页面的unitId
				unit: {},
				unitList: [],

				isBgAudio: false, // 是否开启背景音乐
				bgAudioContext: null,

				// 单词数据
				wordList: [],
				// 已消除的word 
				// [{
				// 	word: 'hello',
				// 	explains: '你好'
				// }]
				resolvedList: [],
				// 当前选中的单词卡片对 value, 
				selectedPair: {
					wordItem: null, // 整个单词
					explainsItem: null // 整个单词
				},

				// result modal
				maxTime: 2 * 60 * 1000, // 游戏时长
				usedTime: 0,



			}
		},
		computed: {
			dataList() {
				let list = [];
				this.wordList.forEach(item => {
					list.push({
						type: 'word',
						word: item.word,
						explains: item.explains,
					});
					list.push({
						type: 'explains',
						word: item.word,
						explains: item.explains,
					})
				})
				// 打乱顺序
				list = shuffle(list);

				return list;
			},
			wordClass() {
				// 计算属性传参，返回一个函数，在调用这个函数时传参
				return (item) => {
					const classList = ['word'];

					if (item.type === 'word') {
						this.selectedPair.wordItem?.word === item.word ?
							classList.push('word-status1--active') :
							classList.push('word-status1--default')


					} else {
						this.selectedPair.explainsItem?.explains === item.explains ?
							classList.push('word-status2--active') :
							classList.push('word-status2--default')

					}

					// 判断是否应该添加动画
					// 解决的
					const isResolove = this.resolvedList.some(_item => {
						return _item.word === item.word
					})
					if (isResolove) {
						// 这里动画只在添加了动画类时执行
						classList.push('animate__animated', 'animate__zoomOut')
					}
					// 选错的
					if (this.selectedPair.wordItem && this.selectedPair.explainsItem) {
						// 两种情况
						(item.type === 'word' && this.selectedPair.wordItem?.word === item.word) ?
						classList.push(
							'animate__animated', 'animate__shakeX'): '';
						(item.type === 'explains' && this.selectedPair.explainsItem?.word === item.word) ?
						classList.push(
							'animate__animated', 'animate__shakeX'): '';
					}

					return classList.join(' ');
				}

			},
			btnClass() {
				return {
					fontSize: '16px',
					color: '#a15300',
					fontWeight: 'bold'
				}

			},
		},
		mounted() {
			this.isBgAudio = false;
			this.bgAudioContext?.destroy();
			this.bgAudioContext = null;
			// this.toggleBckgAudio()
		},

		async onLoad(options) {
			try {
				// 获取页面跳转参数
				console.log('2222', options);
				this.unit.id = options.unitId;
				this.unit.title = options.unitTitle;
				// 获取unitlist
				this.getUnitList();
				// 获取当前unit数据
				this.getUnitData()

			} catch (e) {
				console.log('e', e)
				Toast.value.show({
					message: e.msg || e,
					type: 'error'
				});
			}


		},

		beforeDestroy() {
			this.bgAudioContext?.destroy();
		},
		onUnload() {
			this.bgAudioContext?.destroy();
		},


		methods: {
			/**
			 * @description 处理单词块点击事件
			 * */
			handleWordClick(item) {
				console.log('handleWordClick', item);
				const temp = this.resolvedList.find(_item => {
					return _item.word === item.word;
				})
				if (temp) return; // 单词块已解决，直接return

				item.type === 'word' ?
					this.selectedPair['wordItem'] = {
						word: item.word,
						explains: item.explains
					} : item.type === 'explains' ?
					this.selectedPair['explainsItem'] = {
						word: item.word,
						explains: item.explains
					} : ''

				if (!this.selectedPair.wordItem || !this.selectedPair.explainsItem) return;

				// 已选择两个类型的item 判断是否正确
				const isResolve = this.wordList.some(_item => {
					return _item.word === this.selectedPair.wordItem.word &&
						_item.explains === this.selectedPair.explainsItem.explains
				});
				if (isResolve) {
					// 随便选一个添加进去
					this.resolvedList.push(Object.assign({}, this.selectedPair.wordItem));
					this.selectedPair = {}
				}
				// 播放音效
				const audioSrc = isResolve ?
					'/static/mp3/game/correct.mp3' :
					'/static/mp3/game/error.mp3'
				this.createAudioContext({
					src: audioSrc,
					autoplay: true,
				})

				// 定时器 等动画可以执行后才刷新
				setTimeout(() => {
					this.selectedPair = {
						wordItem: null,
						explainsItem: null
					}
				}, 300)

				// 判断游戏是否通关结束
				if (this.resolvedList.length === this.wordList.length) {
					// 等动画结束
					setTimeout(() => {
						this.gameFinish();
					}, 500)

				}
			},

			// 倒计时
			countDownReset() {
				this.$refs.countDownRef.reset()
			},
			countDownStart() {
				this.$refs.countDownRef.start()
			},
			countDownPause() {
				this.$refs.countDownRef.pause()
			},

			onCountDownFinish() {
				console.log('onCountDownFinish');
				this.gameFail();
			},

			/**
			 * @param {string} timeObj 倒计时剩余时间
			 * */
			onCountDownChange(timeObj) {
				const duration = dayjs.duration(timeObj) // 剩余时长
				const maxDuration = dayjs.duration(this.maxTime) //最大时长
				const usedSeconds = maxDuration.subtract(duration).asSeconds() // 用时
				this.usedTime = Math.round(usedSeconds);
			},

			/**
			 * @description 创建InnerAudioContext
			 * @param {Object} options context的属性配置
			 * @return {InnerAudioContext} context实例
			 * */
			createAudioContext(options) {

				const ctx = uni.createInnerAudioContext();
				for (let key in options) {
					if (key in ctx) {
						// ctx 存在对应属性
						ctx[key] = options[key]
					}
				}
				ctx.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
				return ctx;
			},
			/**
			 * @description 切换背景音乐
			 * 
			 * */
			toggleBckgAudio() {
				console.log('toggleBckgAudio');
				if (!this.bgAudioContext) {
					// create context
					const ctx = this.createAudioContext({
						src: '/static/mp3/game/bg_music.mp3',
						autoplay: true,
						loop: true
					});
					ctx.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
						this.isBgAudio = false;
						this.bgAudioContext = null;
					});
					this.bgAudioContext = ctx
					console.log('ctx', ctx);
				}
				this.isBgAudio = !this.isBgAudio;
				this.isBgAudio ?
					this.bgAudioContext.play() :
					this.bgAudioContext.pause()
			},

			/**
			 * @description 游戏通过
			 * */
			async gameFinish() {
				try {

					console.log('finishGame');
					this.countDownPause();

					this.$refs.successModal.open();

					// 发送完成数据
					const {
						status,
						data,
						msg
					} = await this.$http.post('/eliminate', {
						unitId: this.unit.id,
						finishDuration: this.usedTime
					})
					if (!status) throw (msg);


				} catch (e) {
					//TODO handle the exception
					console.log('e', e);
					// 接口错误
					Toast.value.show({
						message: e.msg || e,
						type: 'error'
					});
				}
			},

			/**
			 * @description 游戏失败 时间到了
			 * */
			gameFail() {
				this.$refs.failModal.open();
			},

			gameReset() {
				console.log('gameReset');
				this.$refs.successModal.close();
				this.countDownReset();
				this.resolvedList = [];
				this.selectedPair = {};
				this.usedTime = 0;
			},

			// 瞄一眼
			viewWordList() {
				console.log('viewWordList');
				this.countDownPause();
				this.$refs.wordListModal.open()
			},
			onViewModalClose() {
				this.countDownStart();
			},

			/**
			 * @description 单词发音点击
			 * */
			handleWordAudio(word) {
				console.log('handleWordAudio', word);
				playAudio(getAudioSrc(word.word))

			},



			// 弹窗  下一关
			nextLevel() {
				console.log('下一关', this.unitList);
				this.$refs.successModal.close();
				// 寻找下一个unitId
				const i = this.unitList.findIndex(item => {
					return item.id == this.unit.id
				});
				if (i === this.unitList.length - 1) {
					// 提示没有下一关
					this.$refs.Toast.show({
						message: '已经是最后一关了!',
					})

				} else {
					// 获取下一关的数据
					this.gameReset();
					this.unit = this.unitList[i + 1];
					this.getUnitData();
				}

			},


			onFailModalCancel() {
				// 先不闯了
				this.$refs.failModal.close();
				uni.navigateBack();
			},

			// 获取unit list数据
			async getUnitList() {
				try {
					// request
					const {
						status,
						data,
						msg
					} = await this.$http.get('/levels/units')
					if (!status) throw (msg);

					this.unitList = data.sort((obj1, obj2) => {
						return obj1.id - obj2.id
					});

				} catch (e) {
					//TODO handle the exception
					console.log('e', e);
					// 接口错误
					Toast.value.show({
						message: e.msg || e,
						type: 'error'
					});
					return Promise.reject(e.msg)
				}
			},

			async getUnitData() {
				try {
					// 获取当前unit数据
					const {
						status,
						data,
						msg
					} = await this.$http.get(`/words/${this.unit.id}`)

					if (!status) throw (msg);

					this.wordList = data;

				} catch (e) {
					//TODO handle the exception
					console.log('e', e);
					// 接口错误
					Toast.value.show({
						message: e.msg || e,
						type: 'error'
					});
					return Promise.reject(e.msg)
				}
			}


		}

	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 12px;

	}

	// 主要颜色
	$main-color: #FF9933;

	.main {
		position: relative;
		padding: 8px;
		margin-top: 64px;
		background-color: $main-color;
		border-radius: 16px;

	}

	.main-title {
		position: absolute;
		left: 50%;
		top: 0;
		transform: translate(-50%, -100%);
		min-width: 220rpx;
		padding: 8px;

		text-align: center;
		font-size: 20px;
		color: #a95301;
		background-color: #ffe983;
		border-radius: 1em 1em 0 0;


	}

	.top-tools {
		display: flex;
		justify-content: space-between;
		align-items: center;


		.icon {
			width: 24px;
			height: 24px;
		}

		.clock {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 180rpx;
			height: 32px;
			padding: 0 12px;
			background-color: #fff;
			border-radius: 16px;
		}

		.bckg-audio {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 32px;
			height: 32px;
			background-color: #fff;
			border-radius: 50%;
		}
	}

	// 单词垂直间距
	$v-gap: 12px;

	.game-body {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		min-height: 300px;
		padding: $v-gap 6px 0 6px;
		margin-top: 10px;
		background-color: #fff3f8;
		border-radius: 8px;


		.word {
			flex: none;
			width: 30%;
			margin-bottom: $v-gap;
			padding: 12rpx 15rpx;

			text-align: center;
			box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset, inset 2px 2px 2px white;
			border-radius: 5px;
		}

		// 单词项状态样式
		.word-status1--default {
			background-color: #ff99dc;
		}

		.word-status1--active {
			color: #fff;
			font-weight: bold;
			background-color: #ec4912;
		}

		.word-status2--default {
			background-color: #4fe5f5;
		}

		.word-status2--active {
			color: #fff;
			font-weight: bold;
			background-color: #661aff;
		}
	}



	.botoom-buttons {
		display: flex;
		justify-content: space-between;
		margin: 60rpx 30rpx 0 30rpx;
	}

	.btn-container {
		width: 35%;
	}

	// 棋盘背景
	.box {
		background: #eee;
		background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.25) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.25) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.25) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.25) 0);
		background-position: 0 0, 20px 20px;
		background-size: 40px 40px;
	}


	.main-color {
		color: $main-color;
	}

	.result {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}


	.result--success__main {
		margin-bottom: 16px;
		font-size: 24px;
		font-weight: bold;
	}

	.result--success__text {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80%;
		padding: 4px;
		border-radius: 14px;
		font-size: $uni-font-size-base;
		background: rgba(254, 242, 226, 0.7);
	}

	.result--fail {
		color: rgb(227, 85, 98);
		font-size: 20px;
	}
</style>