'use strict';

let position = {x: -1, y: -1};
document.addEventListener('mousedown', e => {
	if (e.button == 2) {
		position = {x: e.clientX, y: e.clientY};
	}
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
	sendResponse({status: 'ok'});

	let images = [];
	[...document.querySelectorAll("*")].filter(e => {
		const rect = e.getBoundingClientRect();
		return (rect.left < position.x && position.x < rect.right)
				&& (rect.top < position.y && position.y < rect.bottom);
	}).forEach(e => {
		if (typeof e.src !== "undefined") {
			images.push(e.src);
		}
		const style = window.getComputedStyle(e, false);
		if (typeof style !== "undefined") {
			const bg = style["background-image"] || "";
			const image = bg.match(/url\(["']?([^"']*)["']?\)/);
			if (image) {
				images.push(image[1]);
			}
		}
	});

	let container = document.createElement("div");
	container.id = "BLACKLE__borescope_container";

	container.innerHTML = `
	<style>
#BLACKLE__borescope_container, #BLACKLE__borescope_container * {
	margin: 0;
	padding: 0;
	border: 0;
	color: black;
	all: revert
	font-size: 1em;
	font-family: inherit;
}
#BLACKLE__borescope_container {
	background: rgba(0,0,0,.4) !important;
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	z-index: 999999999 !important;
	display: grid !important;
	place-items: center !important;
}
#BLACKLE__borescope_container #BLACKLE__borescope_modal {
	border: 1px solid grey;
	background: white;
	box-shadow: 1px 1px 10px rgba(0,0,0,.5);
	border-radius: 5px;
	min-width: 500px;
	max-width: 95%;
	max-height: 95vh;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 10px 20px;
	position: fixed;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
#BLACKLE__borescope_container #BLACKLE__borescope_modal > h1 {
	font-family: sans;
	font-size: 15px;
	margin: 0;
	font-weight: normal;
	margin-bottom: 5px;
}
#BLACKLE__borescope_container #BLACKLE__borescope_modal_close {
	border: 1px solid grey;
	border-radius: 3px;
	background-color: #eee;
	width: 20px;
	height: 20px;
	cursor: pointer;
	position: absolute;
	right: 5px;
	top: 5px;
	background-image: url('data:image/svg+xml,%3Csvg%20width%3D%22100mm%22%20height%3D%22100mm%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-linecap%3D%22round%22%20stroke-width%3D%228%22%3E%3Cpath%20d%3D%22M22.41%2077.6l55.18-55.18M22.41%2022.4l55.18%2055.18%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
	background-size: cover;
}
#BLACKLE__borescope_container #BLACKLE__borescope_modal_close:hover {
	background-color: #ddd;
}
#BLACKLE__borescope_container #BLACKLE__borescope_modal_list {
	width: 100%;
	border: 1px solid grey;
	border-radius: 3px;
	background-color: #eee;
	min-height: 80px;
	overflow-y: scroll;
}
#BLACKLE__borescope_container .BLACKLE__borescope_modal_list_item {
	display: flex;
	font-family: sans-serif;
	flex-direction: column;
	align-items: center;
	padding: 5px 8px;
	box-sizing: border-box;
}

#BLACKLE__borescope_container .BLACKLE__borescope_modal_list_item:not(:first-child) {
	border-top: 1px solid grey;
}

#BLACKLE__borescope_container .BLACKLE__borescope_modal_list_item > img {
    max-width: 100%;
    margin-bottom: 10px;
}

#BLACKLE__borescope_container .BLACKLE__borescope_modal_list_text {
	max-width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: inline-block;
}
	</style>
	<div id="BLACKLE__borescope_modal">
	<div id="BLACKLE__borescope_modal_close"></div>
	<h1>Right-Click Borescope - ${images.length} images found</h1>
	<div id="BLACKLE__borescope_modal_list">
	</div>
	</div>
	`;
	const body = document.querySelector("body");
	body.appendChild(container);

	const list = container.querySelector("#BLACKLE__borescope_modal_list");
	for (const image of images) {
		let imageEl = document.createElement("a");
		imageEl.href = image;
		imageEl.target = "_blank"
		imageEl.classList.add("BLACKLE__borescope_modal_list_item");
		imageEl.innerHTML = `
			<img src="${image}"/>
			<span class="BLACKLE__borescope_modal_list_text">${image}</span>
		`;
		list.appendChild(imageEl);
	}

	container.querySelector("#BLACKLE__borescope_modal_close").onclick = e => {
		body.removeChild(container);
	}
});
