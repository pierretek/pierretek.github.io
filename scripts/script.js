
//funny demo thing
document.getElementById("funny-demo").addEventListener("click", function () {
	const original = this.textContent;
	this.textContent = "You're already here dummy";

	setTimeout(() => {
		this.textContent = original;
	}, 5000);
});
