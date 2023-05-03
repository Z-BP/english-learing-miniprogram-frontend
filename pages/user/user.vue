<template>
	<view>
		<!-- 消息提示组件 -->
		<u-toast ref="Toast"></u-toast>
		<!-- 信息块 -->
		<view class="padding info-block">
			<view class="">
				<u-avatar :src="defaultAvatar" size="100" shape="circle"></u-avatar>
			</view>
			<text class="text-sl">{{userInfo.userName}}</text>
			<view class="flex align-center">
				<view class="margin-right-sm text-xl">学习等级：{{userInfo.levelTitle}}</view>


				<u-icon name="edit-pen-fill" color="#00557f" size="60rpx" @click="editLevel"></u-icon>

			</view>

			<!-- button -->
			<view class="margin-top-xl" style="width: 50%;">
				<u-button type="primary" shape="circle" :disabled="disabled" text="单词记录" icon='file-text'
					@click="viewWordRecord"></u-button>
			</view>
		</view>



		<!-- 编辑level modal -->
		<my-modal ref="levelListModal" title="学习等级" width="700rpx" height="75vh" :showCancelButton="false"
			:showConfirmButton="true" @confirm="confirmLevel">
			<template>
				<view class="">
					<view v-for="level in levelList" :key="level.id"
						class="solid margin padding-sm radius shadow  text-xl text-center"
						:class="levelItemClass(level.id)" @click="selectLevel(level.id)">
						{{level.title}}
					</view>
				</view>
			</template>
		</my-modal>

	</view>
</template>


<script setup>
	import myModal from "/components/my-modal.vue"
	import {
		ref,
		reactive,
		onMounted,
		getCurrentInstance,
		computed,
		toRaw,
		unref
	} from 'vue'
	import {
		getUserInfo
	} from '/utils/auth/index.js'
	import {
		setUserInfo
	} from "../../utils/auth";

	const {
		proxy
	} = getCurrentInstance()
	const Toast = ref(null); // 消息提示组件

	// 默认头像url
	const defaultAvatar = ref('/static/imgs/avatar.jpg')
	// userInfo
	const userInfo = ref(getUserInfo());




	const levelList = ref({});
	const curLevelId = ref(Infinity);
	const levelItemClass = computed(() => {
		return (levelId) => {
			const classList = ['level-item'];
			if (levelId.toString() === curLevelId.value.toString()) {
				classList.push('level-item--active')
			}
			return classList.join(' ');
		}
	});
	const levelListModal = ref(null);

	// 编辑level
	const editLevel = async () => {
		try {

			console.log('editLevel');
			levelListModal.value.open()
			curLevelId.value = unref(userInfo).levelId;

			console.log("curLevelId: ", curLevelId.value, unref(userInfo));
			const {
				status,
				data,
				msg
			} = await proxy.$http.get('/levels');
			// if (!status) throw (msg);
			console.log('data', data);
			levelList.value = data;

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
	// 选择level
	const selectLevel = (id) => {
		curLevelId.value = id;
	}
	// 确定level
	const confirmLevel = async () => {
		try {
			levelListModal.value.close(); //关闭modal，不然toast提示被遮盖
			// request
			const {
				status,
				data,
				msg
			} = await proxy.$http.put(`/user/level/${curLevelId.value}`, );
			if (!status) throw (msg);
			// 重新设置用户信息
			unref(userInfo).levelId = curLevelId.value;
			unref(userInfo).levelTitle = unref(levelList).find(item => {
				return item.id === curLevelId.value
			}).title

			console.log('toRaw(userInfo)', unref(userInfo));
			setUserInfo(unref(userInfo));

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


	const viewWordRecord = () => {
		console.log('viewWordRecord');
		uni.navigateTo({
			url: '/pages/word/study-word/record'
		})
	}
</script>

<style lang="scss">
	.info-block {
		min-height: 50Vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #66CCFF;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 50rpx;
		margin: 150rpx 30rpx 30rpx 30rpx
	}

	.level-item {
		color: #0081ff;
		background-color: #cce6ff;
	}

	.level-item--active,
	.level-item:active {
		// background-color: #3e8bff;
		background-color: #ff6315;
		color: white
	}
</style>