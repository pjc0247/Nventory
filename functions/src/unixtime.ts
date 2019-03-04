export function unixtime() {
	return Math.floor(new Date().getTime() / 1000);
}
