<template>
	<view class="padding bg-mauve light h-100vh bfc">

		<u-toast ref="Toast"></u-toast>

		<!-- 单词模块 title -->
		<view class="flex justify-center margin-tb">
			<view class="basis-df padding-sm bg-white text-center text-mauve light text-bold box">
				{{unit.title}}
			</view>
		</view>


		<!-- 内容区 -->
		<view class="bg-white box margin-bottom">
			<!-- 功能title -->
			<view class="padding-xs margin-tb text-center text-black function-title">
				{{functionTitle}}
			</view>
			<!-- 认识单词内容区 列表 -->
			<view v-if="!isStart" class="grid col-2 padding-left-sm  ">
				<!-- 卡片项容器 -->
				<view v-for="(item, index) in wordList" :key="index" class="padding-right-sm padding-bottom-sm">

					<view class="padding-sm bg-white radius solid shadow shadow-lg ">

						<view class="text-bold text-black">{{item.word}}</view>
						<view class="flex margin-tb-sm">
							<text>{{item.phonetic}}</text>
							<view class="margin-left-xs">
								<u-icon name="volume-fill" color="#6666CC" size="24"
									@click="playWord(item.word)"></u-icon>
							</view>
						</view>
						<view>{{item.explains}}</view>


					</view>
				</view>
			</view>


			<!-- 英译中 内容区 -->
			<view v-if="isStart && qTypeList[qTypeIndex] === '英译中'" class="margin">
				<!-- word -->
				<view class="flex flex-direction align-center padding light bg-gray radius">
					<view class="text-purple text-bold text-xxl ">{{enToChineseData[curIndex].word.word}}</view>
					<view class="flex margin-top-sm">
						<text>{{enToChineseData[curIndex].word.phonetic}}</text>
						<view class="margin-left-xs">
							<u-icon name="volume-fill" color="#6666CC" size="24"
								@click="playWord(enToChineseData[curIndex].word.word)"></u-icon>
						</view>
					</view>
				</view>

				<!-- 选项 -->
				<view v-for="(word,index) in enToChineseData[curIndex].optionWords" :key="index"
					class="margin-tb text-center light bg-grey round padding text-purple" :class="optionClass(index)"
					@click="selectOption(index)">
					<text class=" text-bold text-xl">{{word.explains}}</text>
					<!-- icon 由css控制显隐 optionClass -->
					<text class="cuIcon-check icon--correct"></text>
					<text class="cuIcon-close icon--error"></text>

				</view>


			</view>


			<!-- 中译英 -->
			<view v-if="isStart &&qTypeList[qTypeIndex] === '中译英'" class="margin">
				<!-- word -->
				<view class="flex flex-direction align-center padding light bg-gray radius">
					<view class="text-purple text-bold text-xxl ">{{enToChineseData[curIndex].word.explains}}
					</view>
					<view class="flex margin-top-sm">
						<text>{{enToChineseData[curIndex].word.phonetic}}</text>
						<view class="margin-left-xs">
							<u-icon name="volume-fill" color="#6666CC" size="24"
								@click="playWord(enToChineseData[curIndex].word.word)"></u-icon>
						</view>
					</view>
				</view>

				<!-- 选项 -->
				<view v-for="(item,index) in enToChineseData[curIndex].optionWords" :key="index"
					class="margin-tb text-center light bg-grey round padding text-purple" :class="optionClass(index)"
					@click="selectOption(index)">
					<text class=" text-bold text-xl">{{item.word}}</text>
					<!-- icon 由css控制显隐 optionClass -->
					<text class="cuIcon-check icon--correct"></text>
					<text class="cuIcon-close icon--error"></text>
				</view>
			</view>



			<!-- 单词拼写 -->
			<view v-if="isStart &&qTypeList[qTypeIndex] === '单词拼写'"
				class="flex flex-direction  padding-xl margin-lr light bg-gray radius">
				<!-- 单词 -->
				<view class="flex flex-direction align-center">
					<view class="text-purple text-bold text-xxl ">{{spellingWord.explains}}
					</view>
					<view class="flex margin-top-sm">
						<text>{{spellingWord.phonetic}}</text>
						<view class="margin-left-xs">
							<u-icon name="volume-fill" color="#6666CC" size="24"
								@click="playWord(spellingWord.word)"></u-icon>
						</view>
					</view>
				</view>


				<!-- 拼写 -->
				<view class="">
					<!-- show box -->
					<view class="flex justify-center align-center margin-tb-lg round bg-purple light  spelling-box">
						<text class="text-xxl">{{spellingLetterArr.join('')}}</text>
						<!-- 删除按钮 -->
						<view class="btn--delete">
							<u-icon name="close-circle" color="#6666CC" size="24" @click="deleteLeter"></u-icon>
						</view>
					</view>
					<!-- 字母项列表 -->
					<view class="flex flex-wrap justify-center ">
						<view v-for="(item, i) in letterList" :key="i"
							class="flex justify-center align-center margin-right-sm margin-bottom-sm bg-purple radius text-xl "
							:class="letterBlockClass(item,i)" @click="selectLetter(item, i)">
							{{item.isSelected ? '' : item.letter}}
						</view>
					</view>
				</view>


			</view>





			<!-- 按钮 -->
			<view class="flex justify-center margin-tb">
				<!-- 提交按钮 -->
				<view v-if="showSubmit" class="basis-df">
					<u-button type="primary" shape="circle" color="#6666CC" :disabled="disabled" text="提交"
						@click="submit"></u-button>
				</view>
				<view v-else class="basis-df">
					<u-button type="primary" shape="circle" color="#6666CC" :disabled="disabled" text="下一步"
						@click="nextStep(word)"></u-button>
				</view>

			</view>
		</view>



		<!-- 成功弹窗 -->
		<my-modal ref="successModal" title="恭喜" width="80vw" cancelText="返回" confirmText="重新开始" :ShowCloseButton='false'
			@cancel="onSuccessModalCancel" @confirm="onSuccessModalConfirm">
			<template>
				<view class="result">
					<h2 class="text-center text-sl margin">完成学习</h2>
					<!-- 				<view class="result--success__text">
						<u-icon style="margin: 10px" name="clock-fill" color="#FF9933" size="18"></u-icon>
						<text style="margin-left: 6px;">本次用时<text class="main-color">{{usedTime}}</text>秒</text>
					</view> -->
				</view>

			</template>




		</my-modal>
	</view>
</template>

<script setup>
	import myModal from "/components/my-modal.vue"
	import {
		reactive,
		ref,
		computed,
		onMounted,
		unref,
		getCurrentInstance
	} from "vue";
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		shuffle,
		random,
	}
	from 'lodash'

	import {
		getAudioSrc,
		playAudio
	} from '/utils/dict/index.js'


	const {
		proxy
	} = getCurrentInstance()
	const Toast = ref(null);

	// onShow hook
	onShow(() => {
		console.log("onLoad options: ", getCurrentPages()[getCurrentPages().length - 1]);
		const options = getCurrentPages()[getCurrentPages().length - 1].options
		unit.id = options.unitId;
		unit.title = options.unitTitle;
		blockIndex.value = options.blockIndex;

		init();
		// 获取当前unit数据
		getUnitData()

	})

	// 页面传递参数
	const unit = reactive({}); // 当前unit数据
	const blockIndex = ref(Infinity); // 当前要展示的uinit数据范围 序号[0, ...] 默认4个为一组



	// word 数据
	const wordList = ref([{
		value: 'how',
		phonetic: '[hau]',
		explains: 'adv.怎样;如何;多少 '

	}])

	// 获取word数据
	const getUnitData = async () => {
		try {
			// 获取当前unit数据
			const {
				status,
				data,
				msg
			} = await proxy.$http.get(`/words/${unit.id}`)

			if (!status) throw (msg);

			// 根据 页面参数 blockIndex取到对应的单词
			wordList.value = data.splice(4 * blockIndex.value, 4);

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


	// page init
	const init = () => {

		isStart.value = false;
		isAnswer.value = false;
		functionTitle.value = '认识单词';

		curIndex.value = 0; //当前单词下标
		// 题型控制
		qTypeIndex.value = 0;
		// 英译中 || 中译英
		correctIndex.value = Infinity;
		selectedIndex.value = Infinity;
		spellingLetterArr.splice(0); // 清空数据
		errorletterBlockIndex.value = Infinity;

		answerData.value = {}

	}


	const isStart = ref(false); // 是否开始进入练习阶段
	const isAnswer = ref(false);
	const functionTitle = ref('认识单词') // 内容标题
	const curIndex = ref(0); // 当前展示的下标


	// {
	// 	wordId: {
	// 		enToCn: boolean,
	// 		cnToEn: boolean,
	// 		spelling: boolean
	// 	},
	// }
	const answerData = ref({}); // 作答数据

	// 题型控制
	const qTypeList = reactive(['英译中', '中译英', '单词拼写']);
	const qTypeIndex = ref(0); // 当前题目类型所在下标



	// **************英译中 与 中译英******************
	// 题目数据
	const enToChineseData = computed(() => {
		let arr = []; // 所有单词选择题目数据
		let count = unref(wordList).length > 4 ? 4 : unref(wordList).length; // 选项的个数

		// 生成arr
		unref(wordList).forEach(curWord => {
			// 生成 optionWords
			let optionWords = shuffle(unref(wordList)).slice(0, count + 1);
			//  查询curword是否在里面，没有则替换进去
			let word = optionWords.find(item => item.id === curWord.id)
			if (!word) {
				optionWords.pop()
				optionWords.push(curWord)
			};
			// 打乱顺序
			optionWords = shuffle(optionWords);

			// 加入arr
			arr.push({
				word,
				optionWords
			})
		})


		return arr;
	})

	const correctIndex = ref(Infinity); // 正确的选项下标
	const selectedIndex = ref(Infinity); // 选中的选项下标
	// 用户选择选项处理逻辑
	const selectOption = (index) => {
		// console.log(index);
		if (isAnswer.value) {
			// 已作答
			return;
		}

		let data = unref(enToChineseData)[unref(curIndex)]; // 当前展示的数据
		correctIndex.value = data.optionWords.findIndex(item => {
			return item.word.toString() === data.word.word.toString();
		})
		selectedIndex.value = index;
		isAnswer.value = true;

		// 记录作答数据
		// 这里调用的情况只有两种 enToCn || cnToEn
		const curWord = data.word; // 当前练习的单词数据
		const key = qTypeList[unref(qTypeIndex)] === '英译中' ? 'enToCn' : 'cnToEn';
		unref(answerData)[curWord.id] = Object.assign(unref(answerData)[curWord.id] || {}, {
			[key]: selectedIndex.value === correctIndex.value
		})
	}

	// 选项动态样式类
	const optionClass = computed(() => {
		return (index) => {
			let classList = [];
			if (index === selectedIndex.value) {
				if (index === correctIndex.value) {
					classList.push('option--correct')
				} else {
					classList.push('option--error')
				}
			} else if (index === correctIndex.value) {
				classList.push('option--correct')
			}

			return classList.join(' ');
		}

	})

	// 初始化作答状态
	const clearResponseStatus = () => {
		isAnswer.value = false;
		correctIndex.value = Infinity;
		selectedIndex.value = Infinity;
		spellingLetterArr.splice(0); // 清空数据

	}




	// **************单词拼写******************

	const spellingWord = computed(() => {
		return unref(wordList)[curIndex.value]
	}) // 待拼写的单词


	const letterList = computed(() => {
		let arr = unref(spellingWord).word.split('').map((letter) => {
			return {
				letter,
				isSelected: false
			}
		});
		return shuffle(arr);
	}) // 显示的字母列表数据
	const spellingLetterArr = reactive([]); // 已经成功拼写的字母数组

	const errorletterBlockIndex = ref(Infinity); // 当前选错的letterBlock下标

	const letterBlockClass = computed(() => {
		return (item, i) => {
			let classList = ['letter-block'];
			if (i === errorletterBlockIndex.value) {
				classList.push('ltter-block--error')
			}
			if (item.isSelected) {
				classList.push('light')
			}
			return classList.join();
		}

	})


	// 选中字母
	const selectLetter = (letterObj, index) => {
		console.log('selectLetter');
		if (letterObj.isSelected) return;

		// 判断选中的letter是否符合顺序
		let nextLetter = unref(spellingWord).word.split('')
			.at(spellingLetterArr.length); // 下一个正确的letter
		if (letterObj.letter === nextLetter) {
			// 选对了
			spellingLetterArr.push(letterObj.letter);
			letterObj.isSelected = true;

			// 判断是否是完成了
			if (unref(spellingLetterArr).length === unref(letterList).length) {
				// 记录作答数据 只要之前没设置过false值，就代表全程正确
				const curWord = unref(spellingWord)
				const key = 'spelling'
				unref(answerData)[curWord.id][key] = unref(answerData)[curWord.id][key] === false ? false :
					true;
			}


		} else {
			// 选错了 错误样式
			errorletterBlockIndex.value = index
			setTimeout(() => {
				errorletterBlockIndex.value = Infinity
			}, 500)

			// 记录作答数据
			const curWord = unref(spellingWord)
			const key = 'spelling';
			console.log('spelling', answerData);
			unref(answerData)[curWord.id] = Object.assign(unref(answerData)[curWord.id] || {}, {
				[key]: false
			})

		}
	}


	// 删除选中的字母
	const deleteLeter = () => {
		console.log('deletLetter');
		let letter = spellingLetterArr.pop();
		if (!letter) return;
		unref(letterList).find(item => {
			return (item.isSelected && item.letter === letter);
		}).isSelected = false;

	}




	//  *******************按钮*******************
	// 判断是否显示提交按钮
	const showSubmit = computed(() => {
		// 最后一个单词了，并且是最后一个步骤了（单词拼写）
		return curIndex.value === unref(wordList).length - 1 && qTypeIndex.value === qTypeList.length - 1
	})
	// 控制next btn 是否可用
	const disabled = computed(() => {
		if (!isStart.value) {
			// 还没开始， 不禁用
			return false;
		}
		const type = qTypeList[qTypeIndex.value]; // 类型
		let res = true;
		switch (type) {
			case '英译中': {
				res = selectedIndex.value === Infinity
				break;
			}
			case '中译英':
				res = selectedIndex.value === Infinity
				break;
			case '单词拼写':
				res = letterList.value.length !== spellingLetterArr.length
				break;
			default:
				break;
		}

		return res;
	})



	/**
	 * @description 下一步按钮
	 * @param {object} word 
	 * */
	const nextStep = (word) => {
		console.log('nextStep');
		if (!isStart.value) {
			// 还未开始
			isStart.value = true;
			functionTitle.value = qTypeList[qTypeIndex.value];
			return;
		}

		if (curIndex.value === unref(wordList).length - 1 && qTypeIndex.value === qTypeList.length - 1) {
			console.log('完成单词学习');
			successModal.value.open()
			return;
		}
		// 切换题目类型
		if (qTypeIndex.value === qTypeList.length - 1) {
			// 最后一个题目类型了 切换word
			console.log('切换题型和word');

			qTypeIndex.value = 0;
			curIndex.value++;

		} else {
			console.log('切换题型');
			qTypeIndex.value++;

			console.log(functionTitle.value, qTypeIndex.value, spellingWord.value);
		}

		// 切换title
		functionTitle.value = qTypeList[qTypeIndex.value]

		clearResponseStatus(); // 初始化作答状态

	}



	// 提交作答数据
	const submit = async () => {
		try {
			// request

			const payload = [];
			for (let id in unref(answerData)) {
				payload.push({
					wordId: id,
					...unref(answerData)[id]
				})
			}
			console.log('payload', payload);

			Toast.value.show({
				message: '正在提交',
				type: 'loading',
			});
			const {
				status,
				msg
			} = await proxy.$http.post('/exercise', payload);
			if (!status) throw (msg);

			// 跳转到result页面
			const data = unref(wordList).map(item => {
				return {
					wordId: item.id,
					word: item.word,
					...unref(answerData)[item.id]
				}
			})
			// 关闭当前页面，跳转到result页面
			uni.redirectTo({
				url: '/pages/word/study-word/result',
				// 提供了基于跳转过程的过程参数对象
				passedParams: {
					unitTitle: unit.title,
					data
				}
			})


		} catch (e) {
			//TODO handle the exception
			console.log('e', e);
			// 接口错误
			Toast.value.show({
				message: e.msg || e,
				type: 'error'
			});
		}
	};


	// 弹窗
	const successModal = ref(null);
	const onSuccessModalCancel = () => {
		// 返回
		uni.navigateBack()
	}
	const onSuccessModalConfirm = () => {
		// 重新开始
		successModal.value.close();
		init();
	};


	/**
	 * @description 播放单词发音
	 * */
	function playWord(word) {
		playAudio(getAudioSrc(word));
	}
</script>

<style lang="scss" scoped>
	.box {
		overflow: auto;
		border: 4px solid #a3a3e0;
		box-shadow: 0px 5px 0px 0px #6666CC;
		border-radius: 20px;

	}


	.function-title {
		width: 230rpx;
		background-color: $u-warning;
		border-top-right-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
		font-weight: bold;
	}

	// 选项样式
	.option--correct {
		position: relative;
		background-color: $uni-color-success;
		color: white;

		.icon--correct {
			display: block;
		}
	}

	.icon--correct,
	.icon--error {
		display: none;
		position: absolute;
		right: 30rpx;
		font-size: 50rpx;
		top: 50%;
		transform: translate(0, -50%);
	}


	.option--error {
		position: relative;
		background-color: $uni-color-error;
		color: white;

		.icon--error {
			display: block;
		}
	}


	// 单词拼写
	.spelling-box {
		position: relative;
		height: 90rpx;
	}

	.letter-block {
		width: 70rpx;
		height: 70rpx;
	}

	.ltter-block--error {
		background-color: $u-error;
	}

	.btn--delete {
		position: absolute;
		right: 10rpx;
		top: 50%;
		transform: translate(0, -50%)
	}
</style>