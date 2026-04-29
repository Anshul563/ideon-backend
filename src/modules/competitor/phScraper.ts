import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeProductHunt = async (query: string) => {
  try {
    const url = `https://www.producthunt.com/search?q=${encodeURIComponent(query)}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const products: any[] = [];

    $("a[data-test='product-item']").each((_, el) => {
      const name = $(el).find("h3").text().trim();
      const description = $(el).find("p").text().trim();
      const link = "https://www.producthunt.com" + $(el).attr("href");

      if (name) {
        products.push({
          name,
          description,
          link,
        });
      }
    });

    return products.slice(0, 5);
  } catch (err) {
    return [];
  }
};