document.querySelector('link[href*="main-ver"]').remove()
setInterval(() => {
	document.querySelector('#master-panel').style.width = ''
	document
		.querySelectorAll('#main-menu div')
		.forEach(e => (e.innerHTML.trim() ? null : e.remove()))
}, 10)

let rlObserver = new MutationObserver(mutations => {
	for (let m of mutations) {
		if (m.type === 'attributes' && m.attributeName === 'class')
			setTimeout(
				() =>
					(window.location.pathname = `/home/${m.target.classList[0]}`),
				500
			)
	}
})
setTimeout(()=>rlObserver.observe(document.querySelector('body'), { attributes: true }), 10)

function classDiv(...classes) {
	const div = document.createElement('div')
	div.classList.add(...classes)
	return div
}

const times = []
for (let el of document.querySelectorAll('.hour')) {
	let time =
		el.querySelector('.uurTijd')?.textContent.trim() ??
		el.querySelector('.pauzetijden')?.textContent.trim()
	time = time.split('-')[0].trim()
	if (time.startsWith('0')) time = time.substring(1)
	times.push({
		time,
		isBreak: el.classList.contains('pauze')
	})
}
for (let day of document.querySelectorAll('.day')) {
	let index = 0
	for (let el of day.querySelectorAll('.afspraak')) {
		el.classList.add('lesuur')
		let i = times.findIndex(
			e =>
				e.time ===
				el
					.querySelector('.afspraakTijden')
					.textContent.split('-')[0]
					.trim()
		)
		for (index; index < i; index++) {
			day.insertBefore(
				classDiv('afspraak', times[index].isBreak ? 'pauze' : 'lesuur'),
				el
			)
		}
		index++
	}
}

var examListIsAdded = false
function addExamList() {
	if (location.pathname.includes('homework') && !examListIsAdded) {
		let examElement = document.createElement('div')
		let titleElement = document.createElement('div')
		titleElement.innerHTML = '<div><p>Aankomende toetsen</p></div>'
		titleElement.classList.add('date')
		examElement.appendChild(titleElement)
		for (let dayEl of document.querySelectorAll(
			'.homeworkaster > :not(.panel-header) > div:not(.load-more)'
		)) {
			let date = dayEl
				.querySelector('.date')
				.innerText.replaceAll('\n', ' ')
			for (let assignmentEl of dayEl.querySelectorAll(
				'.m-wrapper:has(.icon-toets), .m-wrapper:has(.icon-grote-toets)'
			)) {
				assignmentEl = assignmentEl.cloneNode(true)
				let dateEl = document.createElement('i')
				dateEl.innerText = 'Datum: ' + date
				assignmentEl
					.querySelector('.huiswerk')
					.appendChild(document.createElement('br'))
				assignmentEl.querySelector('.huiswerk').appendChild(dateEl)
				examElement.appendChild(assignmentEl)
			}
		}
		document
			.querySelector('.homeworkaster > :not(.panel-header')
			.prepend(examElement)
		examListIsAdded = true
	}
}
let previousSearchKey = ''
setInterval(function () {
	let searchKey =
		Object.keys(
			Object.fromEntries(new URLSearchParams(location.search).entries())
		).find(e => !Number(e)) ?? ''
	if (searchKey !== previousSearchKey) {
		previousSearchKey = searchKey
		examListIsAdded = false
		addExamList()
	}
}, 50)
addExamList()
