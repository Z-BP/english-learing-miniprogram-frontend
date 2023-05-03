// #fff 转 rgb()
export const stringToRgb = (str, mode = "string") => {
	const template = str.toLowerCase()
	let result = ''
	if (template.indexOf("rgb(") === 0) {
		result = template
	} else if (template.indexOf("rgba(") === 0) {
		const colors = template.replace(/rgba\(/g, "").replace(/\)/g, "").split(",")
		const r = colors[0]
		const g = colors[1]
		const b = colors[2]
		result = `rgb(${r},${g},${b})`
	} else if (template.indexOf("#") === 0) {
		let colors = template.replace(/#/g, "")
		let resultArr = []
		if (colors.length === 3) {
			colors = colors.replace(/[0-9a-f]/g, (str) => {
				return str + str
			})
		}
		for (let i = 0; i < colors.length; i += 2) {
			resultArr.push(parseInt(colors[i] + colors[i + 1], 16))
		}
		result = `rgb(${resultArr.join(",")})`
	}
	if (mode === "string") {
		return result
	} else if (mode === "array") {
		return result.replace(/rgb\(/g, "").replace(/\)/g, "").split(",")
	}
}

// rgb() 转 #fff
export const rgbToString = (str) => {
	let result = ''
	if (str.indexOf("#") === 0) {
		result = str
	} else if (str.indexOf("rgb(") === 0) {
		const colors = str.replace(/rgb\(/g, "").replace(/\)/g, "").split(",")
		const r = parseInt(colors[0]).toString(16).length === 1 ? "0" + parseInt(colors[0]).toString(16) : parseInt(
			colors[0]).toString(16)
		const g = parseInt(colors[1]).toString(16).length === 1 ? "0" + parseInt(colors[1]).toString(16) : parseInt(
			colors[1]).toString(16)
		const b = parseInt(colors[2]).toString(16).length === 1 ? "0" + parseInt(colors[2]).toString(16) : parseInt(
			colors[2]).toString(16)
		result = `#${r}${g}${b}`
	}
	return result
}