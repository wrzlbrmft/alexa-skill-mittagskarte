import * as request from "request";
import * as cheerio from "cheerio";

request("http://www.alte-raffinerie.de/index.php/Essen.html", (error, response, body) => {
	let $ = cheerio.load(body);
	$("#lunch").find("strong").each((index, element) => {
		console.log($(element).text());
	});
});
