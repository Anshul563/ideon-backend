import axios from "axios";
import * as cheerio from "cheerio";
import { runAI } from "../ai/pipeline/aiRunner";

export const getMarketTrends = async (filters?: { industry?: string; targetAudience?: string }) => {
  const hasFilters = filters?.industry || filters?.targetAudience;
  const today = new Date().toLocaleDateString();
  
  try {
    let items: any[] = [];
    let platformName = "Market Intelligence";

    if (hasFilters) {
      // Use Google Search for targeted research
      platformName = "Google Search";
      const query = `trending SaaS ideas 2026 ${filters?.industry || ""} for ${filters?.targetAudience || ""}`.trim();
      items = await scrapeGoogle(query);
      console.log(`Google Research found ${items.length} items for: ${query}`);
    } 

    // If Google failed or no filters, try PH then HN
    if (items.length === 0) {
      try {
        const phRes = await axios.get("https://www.producthunt.com/feed", {
          headers: { 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml, application/xml, text/xml"
          },
          timeout: 6000
        });
        items = parseRSS(phRes.data, "Product Hunt");
        platformName = "Product Hunt";
      } catch (e) {
        console.warn("PH Feed failed, trying Hacker News...");
        try {
          const hnRes = await axios.get("https://news.ycombinator.com/showrss", { timeout: 6000 });
          items = parseRSS(hnRes.data, "Hacker News");
          platformName = "Hacker News";
        } catch (hnE) {
          console.error("All feeds failed.");
        }
      }
    }

    // FINAL FALLBACK: If still no items, use AI to fetch REAL market data from its 2026 knowledge
    if (items.length === 0) {
      console.log(`AI Synthesis triggered for filters: ${JSON.stringify(filters)}`);
      const aiTrends = await runAI(`
        As a market intelligence expert in May 2026, provide 5 REAL or highly probable trending SaaS/Startup concepts for:
        Industry: ${filters?.industry || "General Technology"}
        Target Audience: ${filters?.targetAudience || "Early Adopters"}
        
        Focus on niche opportunities and emerging "Product-Market Fit" signals.
        
        Return JSON ONLY:
        {
          "trends": [
            { "name": "Company/Idea Name", "description": "1-2 sentence market role", "link": "https://producthunt.com", "tags": ["AI", "Niche"] }
          ]
        }
      `);
      items = aiTrends?.trends || [];
      platformName = "AI Strategic Analysis";
    }

    if (items.length === 0) {
      console.warn("AI Synthesis returned empty results, using hardcoded fallbacks.");
      return fallbackTrends;
    }

    // Enhance with strategic insights
    const prompt = `
      Analyze these ${items.length} ${hasFilters ? "industry-specific" : "trending"} concepts and identify one "Strategic Gap" or "Future Pivot" for each.
      Date: ${today}
      Context: ${filters?.industry || "General"} | ${filters?.targetAudience || "General"}
      
      Items: ${JSON.stringify(items)}

      Return JSON:
      {
        "trends": [
          { "name": "Exact Name", "gap": "Concise strategic insight" }
        ]
      }
    `;

    const enhanced = await runAI(prompt);
    
    return items.map(t => ({
      ...t,
      platform: t.platform || platformName,
      gap: enhanced?.trends?.find((e: any) => e.name === t.name)?.gap || "Opportunity for disruption via vertical AI integration."
    }));

  } catch (err) {
    console.error("Market Research Engine Critical Error:", err);
    return fallbackTrends;
  }
};

const parseRSS = (xml: string, platform: string) => {
  const $ = cheerio.load(xml, { xmlMode: true });
  return $("item, entry").slice(0, 6).map((_, el) => {
    const $el = $(el);
    const title = $el.find("title").text().trim();
    let description = ($el.find("description").text() || $el.find("summary").text() || $el.find("content").text() || "")
      .replace(/<[^>]*>/g, '')
      .trim();
    
    if (!description || description.length < 10) description = "Emerging market opportunity in " + title;
    description = description.slice(0, 150) + "...";

    const link = $el.find("link").attr("href") || $el.find("link").text().trim();
    
    return {
      name: title,
      description,
      link: link || "https://www.producthunt.com",
      tags: ["Trending", platform]
    };
  }).get().filter(i => i.name && i.name.length > 2);
};

const scrapeGoogle = async (query: string) => {
  const tryScrape = async (modeUrl: string, selectors: any) => {
    try {
      const { data } = await axios.get(modeUrl, {
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.google.com/"
        },
        timeout: 8000
      });

      const $ = cheerio.load(data);
      const results: any[] = [];

      $(selectors.container).slice(0, 6).each((_, el) => {
        const name = $(el).find(selectors.title).first().text().trim();
        const description = $(el).find(selectors.snippet).first().text().trim();
        let link = $(el).find("a").first().attr("href");

        // Cleanup Google link tracking
        if (link && link.startsWith("/url?q=")) {
          link = link.split("/url?q=")[1].split("&")[0];
          link = decodeURIComponent(link);
        }

        if (name && link && !link.includes("google.com/search") && name.length > 5) {
          results.push({
            name,
            description: description || "Strategic market opportunity discovered.",
            link: link.startsWith("http") ? link : `https://${link}`,
            tags: ["Market Insight", "Research"]
          });
        }
      });
      return results;
    } catch (err) {
      return [];
    }
  };

  // Try Web Filter (udm=14) - Cleanest for scraping
  const webResults = await tryScrape(
    `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=14`,
    { container: "div.g", title: "h3", snippet: "div.VwiC3b, div.MJ8UF" }
  );
  if (webResults.length > 0) return webResults;

  // Fallback to Basic (gbv=1)
  const basicResults = await tryScrape(
    `https://www.google.com/search?q=${encodeURIComponent(query)}&gbv=1`,
    { container: "div.ZIN69e, div.g", title: "h3, div.BNeawe.vvA7qc", snippet: "div.VwiC3b, div.BNeawe.s3u99c" }
  );
  
  return basicResults;
};

const fallbackTrends = [
  {
    platform: "AI Synthesis",
    name: "Autonomous Agent Platforms",
    description: "Systems that orchestrate multiple AI agents to execute complex business workflows.",
    link: "https://www.producthunt.com",
    tags: ["AI", "Enterprise"],
    gap: "Lack of deep industry-specific guardrails and compliance layers."
  },
  {
    platform: "AI Synthesis",
    name: "Privacy-First Analytics",
    description: "Market insights tools that operate on zero-knowledge proofs to protect user data.",
    link: "https://www.indiehackers.com",
    tags: ["Privacy", "Data"],
    gap: "Current incumbents are struggling with GDPR/CCPA migration overhead."
  }
];
