<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	// 导入组件库
	@import "@/uni_modules/uview-plus/index.scss";
	// 导入动画库
	@import "@/common/styles/animate.min.css";
	// 导入colorui
	@import "@/colorui/main.css";
	@import "@/colorui/icon.css";



	/*每个页面公共css */
	@import "@/common/styles/index.scss";
</style>