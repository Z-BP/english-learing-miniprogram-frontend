<template>
	<view class="bfc page">
		<!-- 消息提示组件 -->
		<u-toast ref="Toast"></u-toast>
		<!-- 登录界面 -->
		<view v-show="isLogin" class="margin-lr-lg padding-lr padding-tb-xl bg-white radius shadow-lg box">
			<h1 class="text-black text-sl text-center">Login</h1>
			<view class="margin">
				<u--form labelWidth="auto" :model="loginInfo" :rules="rules" ref="form1">
					<u-form-item prop="userName" required ref="item1">
						<u--input v-model="loginInfo.userName" fontSize="36rpx" placeholder="userName" border="bottom"
							clearable></u--input>
					</u-form-item>
					<u-form-item prop="passWord" required ref="item1">
						<u--input v-model="loginInfo.passWord" fontSize="36rpx" passWord placeholder="passWord"
							border="bottom" clearable></u--input>
					</u-form-item>
				</u--form>

				<!-- login btn -->
				<view class="margin">
					<u-button text="login" type="primary" shape="circle" @click="login"></u-button>
				</view>
				<view class="text-black text-center">
					Don't have account? <text class="text-blue" @click="goSignUp">Sign up</text>
				</view>
			</view>

		</view>

		<!-- 注册界面 -->
		<view v-show="!isLogin" class="margin-lr-lg padding-lr padding-tb-xl bg-white radius shadow-lg box">
			<h1 class="text-black text-sl text-center">Sign Up</h1>
			<view class="margin">
				<u--form labelWidth="auto" :model="registerInfo" :rules="rules" ref="form1">
					<u-form-item prop="userName" required ref="item1">
						<u--input v-model="registerInfo.userName" fontSize="36rpx" placeholder="userName"
							border="bottom" clearable></u--input>
					</u-form-item>
					<u-form-item prop="passWord" required ref="item1">
						<u--input v-model="registerInfo.passWord" fontSize="36rpx" passWord placeholder="passWord"
							border="bottom" clearable></u--input>
					</u-form-item>
				</u--form>

				<!-- signUp btn -->
				<view class="margin">
					<u-button text="login" type="primary" shape="circle" @click="signUp"></u-button>
				</view>

				<view class="text-black text-center">
					Have account? <text class="text-blue" @click="goLogin">login</text>
				</view>
			</view>

		</view>

	</view>
</template>


<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance
	} from 'vue';
	import {
		getUserInfo,
		setUserInfo
	} from '/utils/auth/index.js'
	// 获取代理实例对象，访问全局变量
	const {
		proxy
	} = getCurrentInstance();
	const Toast = ref(null); // 消息提示组件

	const loginInfo = reactive({
		userName: 'zbp',
		passWord: 'zbp12',
	})
	const registerInfo = reactive({
		userName: 'zbp',
		passWord: 'zbp12',
	})
	const rules = reactive({
		'userName': [{
			type: 'string',
			required: true,
			message: '请填写用户名',
			trigger: ['blur', 'change'],
		}],
		'passWord': {
			type: 'string',
			required: true,
			message: '请填写密码',
			trigger: ['blur', 'change']
		},
	})

	const isLogin = ref('true'); // 控制页面 登录还是注册

	const goSignUp = () => {
		isLogin.value = false;
	}

	const goLogin = () => {
		isLogin.value = true;
	}

	const login = async () => {
		try {
			console.log('login');
			const {
				data
			} = await proxy.$http.post('/user/login', loginInfo)
			// 缓存用户信息
			setUserInfo(data);

			// 跳转页面
			await uni.switchTab({
				url: '/pages/index/index',
			})
		} catch (e) {
			//TODO handle the exception
			console.log('error', e);
			// 接口错误
			Toast.value.show({
				message: e.msg || e,
				type: 'error'
			})

		}

	}

	const signUp = async () => {
		try {
			console.log('signUp');
			const {
				status,
				msg,
				data
			} = await proxy.$http.post('/user/register', registerInfo);
			if (!status) {
				throw (msg);
			}
			Toast.value.show({
				message: '注册成功',
				type: 'success'
			})
			// 显示登录页面
			isLogin.value = true;

		} catch (e) {
			console.log(e);
			Toast.value.show({
				message: e.msg || e,
				type: 'error'
			})
			//TODO handle the exception
		}

	}
</script>


<style lang="scss">
	.box {
		margin-top: 200rpx;
	}
</style>