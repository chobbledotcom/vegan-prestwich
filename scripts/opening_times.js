const fs = require("node:fs").promises;
const path = require("node:path");
const matter = require("gray-matter");
const axios = require("axios");
const cheerio = require("cheerio");

async function updateOpeningTimes() {
        const placesDir = "../place";

        try {
                const files = await fs.readdir(placesDir);
                const mdFiles = files.filter((file) => file.endsWith(".md"));

                for (const file of mdFiles) {
                        const filePath = path.join(placesDir, file);
                        const fileContent = await fs.readFile(filePath, "utf8");
                        const { data, content } = matter(fileContent);

                        if (data.opening_times_page_url) {
                                console.log(`Processing ${file}...`);

                                try {
                                        const response = await axios.get(data.opening_times_page_url);
                                        const $ = cheerio.load(response.data);

                                        const timeSelector = data.opening_times_page_selector;
                                        if (!timeSelector) {
                                                console.log(`No selector specified for ${file}`);
                                                continue;
                                        }

                                        const times = [];

                                        if (
                                                data.opening_page_times_date_selector &&
                                                data.opening_page_times_value_selector
                                        ) {
                                                // Use specific date and time selectors
                                                $(timeSelector).each((i, element) => {
                                                        const date = $(element)
                                                                .find(data.opening_page_times_date_selector)
                                                                .text()
                                                                .trim();
                                                        const time = $(element)
                                                                .find(data.opening_page_times_value_selector)
                                                                .text()
                                                                .trim();
                                                        if (date && time) {
                                                                times.push(`*${date}:* ${time}`);
                                                        }
                                                });
                                        } else {
                                                // Handle multiple selectors
                                                const selectors = Array.isArray(timeSelector) 
                                                    ? timeSelector 
                                                    : [timeSelector];

                                                for (const selector of selectors) {
                                                    $(selector).each((i, element) => {
                                                        const line = $(element)
                                                            .text()
                                                            .trim();
                                                        
                                                        if (line) {
                                                            const parts = line.split(":");
                                                            if (parts.length > 1) {
                                                                times.push(`*${parts[0].trim()}:* ${parts.slice(1).join(":").trim()}`);
                                                            } else {
                                                                times.push(line);
                                                            }
                                                        }
                                                    });
                                                }
                                        }

                                        if (times.length > 0) {
                                                data.times = times;
                                                data.last_modified_at = new Date().toISOString();

                                                const updatedFileContent = matter.stringify(content, data);
                                                await fs.writeFile(filePath, updatedFileContent);
                                                console.log(`Updated times for ${file}`);
                                        }
                                } catch (error) {
                                        console.error(`Error processing ${file}: ${error.message}`);
                                }
                        }
                }
        } catch (error) {
                console.error("Error:", error);
        }
}

updateOpeningTimes();

