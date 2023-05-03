import {
	ref,
	reactive
} from 'vue'
import {
	stringToRgb
} from '/utils/color/color.js'
import {
	getAudioSrc,
	playAudio
} from '/utils/dict/index.js'
export default class LetterTracer {
	constructor(ctx, rect) {
		this.ctx = ctx; // canvas context
		this.rect = rect; // canvas rect

		this.originRGB = {
			r: 200,
			g: 200,
			b: 250
		}; // 绘制初始letter 的rgb

		this.drawRGB = {
			r: 200,
			g: 100,
			b: 200
		}; // 描红的 rgb
		this.font = 'arial'; // letter 字体
		this.fontSize = 310; // letter 字体大小
		this.basicRadius = 2; // 基础描红半径
		// this.basicRadius = 3; // 基础描红半径
		this.radius = 15; // 描红半径

		this.letter = 'A'
		this.pixels = []; // canvas 最初状态像素数据
		this.letterPixelAmount = 0; // 最初状态 字母的像素点数
		this.isLetterComplete = false; // 字母是否绘制完成

		this.timers = []; // 绘制脉冲动画的定时器id

		this.init()

	}


	async init() {
		try {

			this.drawInitialLetter(this.letter);
			this.isLetterComplete = false;
			this.pixels = await this.getPixelData(0, 0, this.rect.width, this.rect.height)
			this.letterPixelAmount = await this.getPixelAmount(this.originRGB.r, this.originRGB.g, this.originRGB.b)


			console.log(this);

			// this.ctx.fillStyle = 'rgb(0, 0, 50)';
			// this.letterPixelAmount = this.getPixelAmount(200, 200, 250);
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}

	}

	drawletter(letter) {

		const ctx = this.ctx;
		let centerx = (this.rect.width - ctx.measureText(letter).width) / 2;
		let centery = this.rect.height / 2;
		// const fix = ctx.measureText(letter).actualBoundingBoxAscent + ctx.measureText(letter)
		// 	.actualBoundingBoxDescent;
		// let centery = this.rect.height / 2 + fix / 2;

		ctx.fillText(letter, centerx, centery);
		ctx.draw();

		console.log('drawletter', this, centerx, centery);

		// drawletterBorder(letter)
	};

	// 绘制最初状态的letter
	drawInitialLetter() {
		// 初始化画笔样式
		this.ctx.lineCap = 'round';
		this.ctx.font = `bold ${this.fontSize}px ${this.font}`;
		this.ctx.fillStyle = `rgb(${this.originRGB.r}, ${this.originRGB.g},${this.originRGB.b})`;
		this.ctx.textBaseline = 'middle';
		this.drawletter(this.letter);
	}


	// 用户触摸移动事件处理
	onTouchMove(e) {
		// console.log("e: ", e);
		if (this.isLetterComplete) return;
		let x, y;
		x = Math.round(e.touches[0].x);
		y = Math.round(e.touches[0].y);
		// 绘制轨迹
		this.paint(x, y)
	};

	onTouchStart(e) {
		// console.log('onTouchStart e', e);
	}


	async onTouchEnd(e) {
		// console.log('onTouchEnd e', e);
		// mousedown = false;
		if (this.isLetterComplete) return;
		const isThreshold = await this.pixelthreshold();
		// 脉冲动画
		if (isThreshold) {
			this.isLetterComplete = true;
			this.pulse()
			playAudio(getAudioSrc(this.letter))
		}
		// 等动画完成

	}

	paint(x, y) {
		// console.log('paint', x, y);
		// let colour = getpixelcolour(x, y);
		const ctx = this.ctx;
		// ctx.beginPath()
		ctx.fillStyle = `rgb(${this.drawRGB.r}, ${this.drawRGB.g},${this.drawRGB.b})`;
		ctx.globalCompositeOperation = 'source-atop'; // 新内容只在与旧内容重叠处绘制
		ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
		ctx.fill()
		ctx.closePath()
		ctx.draw(true) // 不清空旧内容

	};


	// 获取canvas中对应rgb值的像素点个数
	async getPixelAmount(r, g, b) {
		try {
			console.log("rgb: ", r, g, b);
			let pixels = await this.getPixelData(0, 0, this.rect.width, this.rect.height);
			let all = pixels.length;
			let amount = 0;
			for (let i = 0; i < all; i += 4) {
				if (pixels[i] === +r &&
					pixels[i + 1] === +g &&
					pixels[i + 2] === +b) {
					amount++;
				}
			}
			return amount;
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}

	};

	// 获取canvas中的像素数据
	async getPixelData(x, y, width, height) {
		try {
			const data = await uni.canvasGetImageData({
				canvasId: 'firstCanvas',
				x,
				y,
				width,
				height
			})
			return data.data
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}

	}

	// 判断当前canvas 对应rgb像素点（描红的部分）占最初字母像素点的比例是否达到阈值
	// async pixelthreshold() {

	// 	const tracePixels = await this.getPixelAmount(this.drawRGB.r, this.drawRGB.g, this.drawRGB.b)
	// 	console.log('pixelthreshold', tracePixels, this.letterPixelAmount, tracePixels / this.letterPixelAmount >
	// 		0.78);
	// 	if (tracePixels / this.letterPixelAmount > 0.78) {
	// 		// if (!this.isLetterComplete) {
	// 		// 	this.pulse()
	// 		// }
	// 		return true;
	// 	}
	// 	return false;
	// };

	// 计算当前描红像素点是否达到完成阈值
	async pixelthreshold() {
		// 获取轮廓像素点数量
		const originPixelAmount = await this.getPixelAmount(
			this.originRGB.r, this.originRGB.g, this.originRGB.b)
		// 计算描红像素点数量
		const tracePixelAmount = this.letterPixelAmount - originPixelAmount;
		// 判断是否达到阈值
		if (tracePixelAmount / this.letterPixelAmount > 0.8) {
			return true;
		}
		return false;
	};

	// 脉冲动画
	pulse() {
		let size = this.fontSize
		const ctx = this.ctx;
		// audio.play()
		this.ctx.globalCompositeOperation = 'source-over'; // 新内容覆盖就内容
		let timerId1 = setInterval(() => {
			size += 2
			ctx.clearRect(0, 0, this.rect.width, this.rect.height)
			ctx.font = `bold ${size}px ${this.font}`;
			ctx.fillStyle = `rgb(${this.drawRGB.r}, ${this.drawRGB.g},${this.drawRGB.b})`;
			this.drawletter(this.letter)
		}, 40);
		// this.timers.puhs(timerId1);

		setTimeout(() => {
			clearInterval(timerId1);
			let timerId2 = setInterval(() => {
				size -= 2
				ctx.clearRect(0, 0, this.rect.width, this.rect.height)
				ctx.font = `bold ${size}px ${this.font}`;
				ctx.fillStyle = `rgb(${this.drawRGB.r}, ${this.drawRGB.g},${this.drawRGB.b})`;
				this.drawletter(this.letter)

			}, 40);
			// this.timers.puhs(timerId2);
			setTimeout(() => {
				clearInterval(timerId2);
				this.isLetterComplete = true
			}, 1000);
		}, 1000);


	}

	// 没用？
	stopPulse() {
		this.timers.forEach(timer => {
			clearInterval(timer);
		})
	}
	// async pulse() {
	// 	let size = this.fontSize
	// 	const ctx = this.ctx;
	// 	const pixels = await this.getPixelData(0, 0, this.rect.width, this.rect.height)
	// 	// audio.play()
	// 	this.ctx.globalCompositeOperation = 'source-over'; // 新内容覆盖就内容
	// 	let timerId1 = setInterval(() => {
	// 		console.log(111);
	// 		ctx.scale(1.2);
	// 		uni.canvasPutImageData({
	// 			canvasId: 'firstCanvas',
	// 			x: 0,
	// 			y: 0,
	// 			width: this.rect.width,
	// 			height: this.rect.height,
	// 			data: pixels,
	// 			success(res) {}
	// 		})


	// 		// ctx.draw()
	// 	}, 40);

	// 	setTimeout(() => {
	// 		clearInterval(timerId1);
	// 		let timerId2 = setInterval(() => {
	// 			console.log(222);
	// 			// ctx.scale(0.8);
	// 			// ctx.draw();

	// 		}, 40);
	// 		setTimeout(() => {
	// 			clearInterval(timerId2);
	// 		}, 1000);
	// 	}, 1000);

	// 	this.isLetterComplete = true
	// }


	// 设置描红的颜色
	setFillStyle(color) {
		let rgb = [];
		if (color.startsWith('#')) {
			// #fff 格式
			rgb = stringToRgb(color, 'array')
		} else {
			// rgb(*,*,*) 格式
			rgb = color.replace(/rgb\(/g, "").replace(/\)/g, "").split(",");
		}
		console.log(rgb);
		this.drawRGB = {
			r: rgb[0],
			g: rgb[1],
			b: rgb[2]
		}
		// console.log(this);
	}

	// 设置描红的宽度
	setFillWidth(scale) {
		this.radius = this.basicRadius * scale;
	}

	// 设置描红letter
	setLetter(letter) {
		this.letter = letter;
		this.stopPulse()
		// 重新初始化
		this.init();
	}


}