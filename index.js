const newId =() => `i${Math.floor(Math.random() * 10000000)}`;

class RightWrongQuestion {
	constructor(correct, points) {
		this.correct = correct;
		this.points = points;
	}
	makeElement() {
		const li = document.createElement("li");
		const input_id = newId();
		li.innerHTML = `<input id="${input_id}" type="checkbox"> <span>svarade hen "${this.correct}?"</span>`;
		this.input_el = li.querySelector("#" + input_id);
		return (this.li = li);
	}
	getPoints() {
		if (this.input_el.checked) return this.points;
		return 0;
	}
}
class MultiChoiceQuestion {
	constructor(n_choices, correct_index, points) {
		this.n_choices = n_choices;
		if (n_choices != 4) throw new Error("fixme");
		this.correct_index = correct_index;
		this.points = points;
	}
	makeElement() {
		const li = document.createElement("li");
		const input_id = newId();
		li.innerHTML = `<select size='2' id="${input_id}">
  <option>A</option>
  <option>B</option>
  <option>C</option>
  <option>D</option>
</select>`;
		this.input_el = li.querySelector("#" + input_id);
		return (this.li = li);
	}
	getPoints() {
		if (this.input_el.value.toLowerCase().charCodeAt(0) - 97 == this.correct_index) return this.points;
		return 0;
	}
}
class ManualQuestion {
	constructor(text) {
		this.text = text;
	}
	makeElement() {
		const li = document.createElement("li");
		const input_id = newId();
		li.innerHTML = `<input id="${input_id}" type="number"> <span>enter points manually. ${this.text}</span>`;
		this.input_el = li.querySelector("#" + input_id);
		return (this.li = li);
	}
	getPoints() {
		return +this.input_el.value;
	}
}
class JudgePointsQuestion {
	constructor(unit, is_numeric, point_fn) {
		this.unit = unit;
		this.is_numeric = is_numeric;
		this.point_fn = point_fn;
	}
	makeElement() {
		const li = document.createElement("li");
		const input_id = newId();
		li.innerHTML = `<input id="${input_id}"> <span>[${this.unit}]</span>`;
		this.input_el = li.querySelector("#" + input_id);
		return (this.li = li);
	}
	getPoints() {
		let val = this.input_el.value;
		if (this.is_numeric) {
			val = eval(val);
			if (isNaN(+val)) {
				val = 0;
			}
		}
		return this.point_fn(val);
	}
}
class JudgePointsWithCurrentTotalQuestion {
	constructor(unit, point_fn) {
		this.unit = unit;
		this.point_fn = point_fn;
	}
	makeElement() {
		const li = document.createElement("li");
		const input_id = newId();
		const input_id2 = newId();
		li.innerHTML = `<input id="${input_id}"> <span>[${this.unit}]</span>. <input id="${input_id2}"> <span>[relevanta svar, separerade med '+']</span>`;
		this.input_el = li.querySelector("#" + input_id);
		this.input_el2 = li.querySelector("#" + input_id2)
		return (this.li = li);
	}
	getPoints() {
		let val = this.input_el.value;
		if (this.is_numeric) {
			val = eval(val);
		}
		const s = eval(this.input_el2.value);
		return this.point_fn(val, s);
	}
}
class FuckedUp {
	constructor() {
	}
	makeElement() {
		return (this.li = document.createElement("li"));
	}
	getPoints() {
		throw new Error();
	}
}

const storleksordningar_fel = (a, b) => {
	return Math.log10(Math.max(a,b) / Math.min(a,b))
}

const questions = [
	new RightWrongQuestion("8", 1),
	new MultiChoiceQuestion(4, 0, 3),
	new ManualQuestion("Nämn tre stjärnor förutom solen. +2 poäng per stjärna"),
	new MultiChoiceQuestion(4, 0, 3),
	new JudgePointsQuestion("dagar", true, n => {
		const CORRECT = 83 * (10**9);
		const err = storleksordningar_fel(CORRECT, n);
		if (err <= 1) return 7;
		if (err <= 3) return 3;
		return 0;
	}),
	new MultiChoiceQuestion(4, 2, 3),
	new JudgePointsQuestion("meter", true, n => {
		const CORRECT = 1.496 * (10**11);
		const err = storleksordningar_fel(CORRECT, n);
		return Math.max(0, 5 - Math.floor(err));
	}),
	new JudgePointsQuestion("st", true, n => {
		if (isNaN(+n)) return -0.1;
		const CORRECT = 288;
		if (n == CORRECT) return 30;
		if (Math.abs(n - CORRECT) <= 20) return 10;
		if (Math.abs(n - CORRECT) <= 100) return 4;
		return 0
	}),
	new RightWrongQuestion("Ja", 1),
	new ManualQuestion("Indien/Polen/Ungern ger +5. Alla länder utom USA, Ryssland, Japan, Kanada, Italien, Frankrike, Tyskland, Saudiarabien, Förenade Arabemiraten, Indien, Polen, Ungern, Belarus, Belgien, Brasilien, Danmark, Storbritannien, Israel, Kazakstan, Malaysia, Nederländerna, Sydafrika, Sydkorea, Spanien, Sverige och Turkiet ger -6 poäng"),
	new MultiChoiceQuestion(4, 1, 3),
	new RightWrongQuestion("Solen", 3),
	new RightWrongQuestion("3", 15),
	new ManualQuestion("detta är jobbigt, fråga ai eller något"),
	new ManualQuestion("detta är jobbigt, kolla manuellt"),
	new RightWrongQuestion("1990", 5),
	new ManualQuestion("+5 poäng för Edwin. +5 för tele=fjärran. +5 för skopein=betrakta/titta på/etc"),
	new JudgePointsQuestion("bokstav", false, x => {
		if (x == "b") return 14-2;
		if (x == "j") return 14-10;
		if (x == "k") return 14-11;
		return 0;
	}),
	new ManualQuestion("+2 om gigaljusår skrivs. +10 om 9,5*10^24 meter skrivs."),
	new ManualQuestion("Björn, ge poäng här!!"),
	new ManualQuestion("googla burh (1 poäng per astronaut. Vidare -0.1 poäng ifall felstavat, +10 poäng ifall fransk.)"),
	new JudgePointsQuestion("naturliga logaritmen av antalet", true, l => {
		const CORRECT = 184.2068074395237;
		return 13 - Math.abs(CORRECT - l) / 2
	}),
	new RightWrongQuestion("0", 1),
	new JudgePointsWithCurrentTotalQuestion("st", (n, S) => {
		if (n == 0) return 4;
		S = Math.round(S);
		const N = Math.sin(S);
		if (n == S) {
			return 50 * N;
		}
		return 10;
	}),
	new FuckedUp(),
	new JudgePointsQuestion("lista av ord.", false, words => {
		words = words.split(",").map(w => w.trim().toLowerCase());
		const REAL_WORDS = [["General", "a"], ["relativity", "a"], ["general", "a"], ["theory", "a"], ["of", "a"], ["relativity", "a"], ["Einstein", "s"], ["Gravity", "i"], ["gravitation", "p"], ["Albert", "i"], ["Einstein", "i"], ["1916", "a"], ["gravitation", "o"], ["modern", "p"], ["general", "g"], ["relativity", "g"], ["special", "a"], ["relativity", "a"], ["universal", "p"], ["gravitation", "p"], ["gravity", "a"], ["space", "a"], ["time", "o"], ["dimensional", "i"], ["spacetime", "i"], ["curvature", "o"], ["spacetime", "i"], ["Einstein", "f"], ["spacetime", "t"], ["matter", "h"], ["move", "t"], ["matter", "t"], ["spacetime", "h"], ["curve", "w"], ["general", "v"], ["relativity", "v"]]
			.map(([word, letter]) => [word, (letter.toLowerCase().charCodeAt(0) - 96) % 7]);
		const REALER_WORDS = {};
		for (const [w, k] of REAL_WORDS) {
			if (w in REALER_WORDS) {
				REALER_WORDS[w] *= k;
			} else {
				REALER_WORDS[w] = k;
			}
		}
		let REALEST_WORDS = [];
		for (let k = 0; k < 7; k++) {
			const tmp = REALEST_WORDS.filter(([_w, word_k]) => word_k == k).map(([w, _k]) => w.toLowerCase()).sort();
			REALEST_WORDS = [...REALEST_WORDS, ...tmp];
		}

		const filtered_words = [...new Set(words.filter(x => REALEST_WORDS.includes(x)))];
		const order = filtered_words.map(x => REALEST_WORDS.indexOf(x));
		// vibed from chatgpt
		function longestIncreasingSubsequence(nums) {
			if (nums.length === 0) return 0;

			const dp = new Array(nums.length).fill(1);

			for (let i = 0; i < nums.length; i++) {
				for (let j = 0; j < i; j++) {
					if (nums[j] < nums[i]) {
						dp[i] = Math.max(dp[i], dp[j] + 1);
					}
				}
			}

			return Math.max(...dp);
		}
		return longestIncreasingSubsequence(order) * 2;
	}),
	new JudgePointsQuestion("bli lars en minut!!. skall skriva in 'A','B','C','D','E' eller 'F'. rätt svar enligt chatgpt är 1440 år", false, b => {
		if (b.toLowerCase() == "a") return 20;
		if (b.toLowerCase() == "b") return 17.5;
		if (b.toLowerCase() == "c") return 15;
		if (b.toLowerCase() == "d") return 12.5;
		if (b.toLowerCase() == "e") return 10;
		return 0;
	}),
	new MultiChoiceQuestion(4, 3, 6.9),
	new JudgePointsQuestion("enhetslös", true, n => {
		const CORRECT = 0.0529330772836;
		const err = storleksordningar_fel(CORRECT, n);
		if (err <= 2) return 10;
		return 0;
	})
];


(() => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const ol = document.createElement("ol");
	container.appendChild(ol);
	for (let i = 0; i < questions.length; i++) {
		const e = questions[i].makeElement(i);
		e.appendChild(document.createElement("span"));
		ol.appendChild(e);
	}
	const doneb = document.createElement("button");
	doneb.innerHTML = "Done";
	container.appendChild(doneb);
	const total = document.createElement("p");
	total.innerHTML = "total: ";
	container.appendChild(total);
	doneb.onclick = () => {
		let score = 0;
		let exactly_0_points_n = 0;
		for (let i = 0; i < questions.length; i++) {
			const q = questions[i];
			if (q instanceof FuckedUp) {
				if ([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31].includes(exactly_0_points_n)) {
					score -= 10;
					q.li.querySelector("span:last-child").innerHTML = ` || ${-10} points`;
				}
			} else {
				let points = q.getPoints();
				q.li.querySelector("span:last-child").innerHTML = ` || ${points} points`;
				score += points;
				if (points == 0) exactly_0_points_n += 1;
			}
		}
		total.innerHTML = "total: " + score;
	};
})()
