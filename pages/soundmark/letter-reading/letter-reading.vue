<template>
	<!-- 字母点读 -->
	<view class="container">
		<view class="content-title mv-12">
			26个英文字母发音
		</view>
		<view class="letter-list">
			<view v-for="(item, index) in letterList" :key="index" class="letter-item"
				@click="handleLetterAudio(item.audio)">
				<!-- 字母 -->
				<view class="letter">
					{{item.letter}}
				</view>
				<!-- 音标 -->
				<view class="sound">
					{{item.sound}}
				</view>
			</view>
		</view>

		<u-toast ref="uToast"></u-toast>

	</view>
</template>

<script>
	const basicUrl = "/static/mp3/26letter/";
	export default {
		data() {
			return {
				basicUrl: "/static/mp3/26letter/",
				letterList: [{
						letter: 'A a',
						sound: '[ei]',
						audio: basicUrl + "a.mp3",
					}, {
						letter: 'B b',
						sound: '[bi:]',
						audio: basicUrl + "b.mp3",
					}, {
						letter: 'C c',
						sound: '[si:]',
						audio: basicUrl + "c.mp3",
					}, {
						letter: 'D d',
						sound: '[di:]',
						audio: basicUrl + "d.mp3",
					}, {
						letter: 'E e',
						sound: '[i:]',
						audio: basicUrl + "e.mp3",
					}, {
						letter: 'F f',
						sound: '[ef]',
						audio: basicUrl + "f.mp3",
					}, {
						letter: 'G g',
						sound: '[d3i:]',
						audio: basicUrl + "g.mp3",
					}, {
						letter: 'H h',
						sound: '[eit∫]',
						audio: basicUrl + "h.mp3",
					}, {
						letter: 'I i',
						sound: '[ai]',
						audio: basicUrl + 'i.mp3',
					}, {
						letter: 'J j',
						sound: '[d3ei]',
						audio: basicUrl + 'j.mp3',
					}, {
						letter: 'K k',
						sound: '[kei]',
						audio: basicUrl + "k.mp3",
					}, {
						letter: 'L l',
						sound: '[el]',
						audio: basicUrl + 'l.mp3',
					}, {
						letter: 'M m',
						sound: '[em]',
						audio: basicUrl + "m.mp3",
					}, {
						letter: 'N n',
						sound: '[en]',
						audio: basicUrl + 'n.mp3',
					}, {
						letter: 'O o',
						sound: '[əu]',
						audio: basicUrl + "o.mp3",
					}, {
						letter: 'P p',
						sound: '[pi:]',
						audio: basicUrl + 'p.mp3',
					}, {
						letter: 'Q q',
						sound: '[kju:]',
						audio: basicUrl + "q.mp3",
					}, {
						letter: 'R r',
						sound: '[a:]',
						audio: basicUrl + "r.mp3",
					}, {
						letter: 'S s',
						sound: '[es]',
						audio: basicUrl + 's.mp3',
					}, {
						letter: 'T t',
						sound: '[ti:]',
						audio: basicUrl + 't.mp3',
					}, {
						letter: 'U u',
						sound: '[ju:]',
						audio: basicUrl + "u.mp3",
					}, {
						letter: 'V v',
						sound: '[vi:]',
						audio: basicUrl + "v.mp3",
					}, {
						letter: 'W w',
						sound: '[′d∧blju:]',
						audio: basicUrl + "w.mp3",
					}, {
						letter: 'X x',
						sound: '[eks]',
						audio: basicUrl + 'x.mp3',
					}, {
						letter: 'Y y',
						sound: '[wai]',
						audio: basicUrl + "y.mp3",
					}, {
						letter: 'Z z',
						sound: '[zi:]',
						audio: basicUrl + "z.mp3",
					},

				],


				show: false,
			}
		},
		methods: {
			/**@desc 字母点击事件处理函数
			 * @param {string} audioSrc 音频资源路径
			 * */
			handleLetterAudio(audioSrc) {
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = audioSrc;
				innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
					// 显示提示
					this.showToast(res);
				});
			},

			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						params.url && uni.navigateTo({
							url: params.url
						})
					}
				});
			}



		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0 24rpx;
	}

	.content-title {
		width: 70%;
		padding: 8px;
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		background-color: $uni-color-primary;
		color: #fff;
		border-radius: 16px;
		margin: 0 auto;
	}

	$border-height: 18px;

	.letter-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.letter-item {
		position: relative;
		flex: none;
		box-sizing: border-box;
		width: 160rpx;
		margin-bottom: 20rpx;
		border-top: $border-height solid #D8D8D8;
		border-bottom: $border-height solid $uni-color-primary;
		border-radius: 0.75 * $border-height;
	}

	.letter-item:nth-child(3n) {
		border-bottom: $border-height solid $uni-color-primary;
	}

	.letter-item:nth-child(3n+1) {
		border-bottom: $border-height solid $uni-color-success;
	}

	.letter-item:nth-child(3n+2) {
		border-bottom: $border-height solid $uni-color-error;
	}

	.letter {
		text-align: center;
		font-weight: bold;
		font-size: 32px;
		background-color: #F3F4F6;
	}

	.sound {
		position: absolute;
		bottom: -0.5 * $border-height;
		left: 50%;
		transform: translate(-50%, 50%);
		color: #fff;
		font-size: 14px;
	}
</style>