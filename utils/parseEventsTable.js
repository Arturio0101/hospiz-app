// utils/parseEventsTable.js
const cheerio = require('cheerio');

function parseEventsTable(html) {
  const $ = cheerio.load(html);
  const events = [];

  $('table tbody tr').each((i, el) => {
    const columns = $(el).find('td');
    if (columns.length < 5) return;

    const dateText = $(columns[0]).text().trim();
    const title = $(columns[1]).text().trim();
    const speakersRaw = $(columns[2]).text().trim();
    const location = $(columns[3]).text().trim();
    const timeRaw = $(columns[4]).text().trim();

    const links = [];
    $(columns[1]).find('a').each((i, a) => {
      const href = $(a).attr('href');
      if (href && href.startsWith('/images/')) {
        links.push(href);
      }
    });
    const absoluteLink = links.length > 0 ? `https://www.hospiz-seligenstadt.de${links[0]}` : undefined;

    const speakers = speakersRaw
      ? speakersRaw.split(/,\s*(?=[A-ZÄÖÜ])/).map(s => s.trim()).filter(Boolean)
      : undefined;

    const time = timeRaw || undefined;

    const parseDateRange = (text) => {
      const dates = [];
      const parseSingle = (d) => {
        const match = d.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if (!match) return null;
        const [, day, month, year] = match;
        return new Date(`${year}-${month}-${day}`);
      };

      const rangeMatch = text.match(/(\d{1,2})\.–?(\d{1,2})\.(\d{2})\.(\d{4})/);
      if (rangeMatch) {
        const [, day1, day2, month, year] = rangeMatch;
        const start = new Date(`${year}-${month}-${day1.padStart(2, '0')}`);
        const end = new Date(`${year}-${month}-${day2.padStart(2, '0')}`);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      } else {
        const allMatches = [...text.matchAll(/(\d{2})\.(\d{2})\.(\d{4})/g)];
        for (const match of allMatches) {
          const d = parseSingle(match[0]);
          if (d) dates.push(d);
        }
      }

      const uniqueDates = [...new Set(dates.map(d => d.toISOString().split('T')[0]))];
      return uniqueDates;
    };

    const dates = parseDateRange(dateText);

    const event = {
      title,
      dates,
      Datum: dateText
    };

    if (speakers) event.speakers = speakers;
    if (location) event.location = location;
    if (time) event.time = time;
    if (links.length) event.links = links;
    if (absoluteLink) event.Link = absoluteLink;

    const notesMatch = $(columns[4]).text().match(/entfällt|Flyer|Eintritt/i);
    if (notesMatch) {
      event.notes = $(columns[4]).text().trim();
    }

    events.push(event);
  });

  return events;
}

module.exports = { parseEventsTable };
