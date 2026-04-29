import { scrapeProductHunt } from "../src/modules/competitor/phScraper";

async function test() {
  console.log("Searching for competitors of 'Excel drawing tool'...");
  const results = await scrapeProductHunt("excel draw");
  console.log("Results:");
  console.log(JSON.stringify(results, null, 2));
}

test();
