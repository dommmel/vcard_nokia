/**
 * Parses a single vCard into a JSON object. 
 * 
 * output format:
 * {
 *  default: {
 *   FN: [{ value: 'John Doe' }],
 *   TEL: [{ value: '+1234567890', type: ['CELL', 'VOICE'] }],
 *  },
 *  item1: {
 *    TEL: [{ value: '+1234567890', type: ['CELL', 'VOICE'] }],
 *    X-ABLabel: [{ value: 'ch mobile' }],
 *  }
 * }
 * 
 * 
 */
export function Parse(vCardData) {
  const cards = splitIntoVCards(vCardData)
  return cards.map(parseVcard)
}


function splitIntoVCards(vcfString) {
  return vcfString
    .trim()
    .split(/END:VCARD\s*BEGIN:VCARD/i)
}

function parseVcard(input) {
  const result = {};
  input.split(/\r\n|\r|\n/).forEach( line => {

    // skip if line does not start with "tel", "fn", or "itemXX" (case insensitive)
    if (!line.trim().match(/^(TEL|FN|ITEM\d+)/i)) {
      return;
    }
    const Re = /^(?:(item\d+)\.)?([^;:]+)((?:;[^:]+)*):(.+)$/i
    // const Re = /^(?:(item\d+)\.)?(\w+)((?:;[^:]+)*):(.+)$/i


    // Determine if there's a prefix like 'item1'
    const [fullMatch, item, sectionKey, attributes, value] = line.match(Re) || [];
    // If no value, skip
    if (!value) {
      return;
    }
    const key = sectionKey.trim().toLowerCase();
    // Set the appropriate section in the result object
    const section = item || 'default';

    // Initialize this section if not already present
    result[section] = result[section] || {};

    // Initialize the key array if not present
    result[section][key] = result[section][key] || [];

    // Parse attributes if any
    const attrs = {};

    attributes && attributes.split(';').forEach(attr => {
        if (attr.includes('=')) {
            const [akey, val] = attr.split('=');
            const normalizedKey = akey.trim().toLowerCase();
            const normalizedVal = val.replace(/"/g, '').trim();
            attrs[normalizedKey] = attrs[normalizedKey] || [];

            // Attributes can be comma separated or be present mulitple times, e.g. TYPE=CELL,VOICE or TYPE=CELL;TYPE=VOICE
            const newAttribute = normalizedVal.includes(',') ? normalizedVal.split(',').map(v => v.trim()) : [normalizedVal];
            attrs[normalizedKey] = [...attrs[normalizedKey], ...newAttribute];           
        }
    });

    // Construct entry object
    const entry = { ...attrs, value: value.trim() };

    // Add entry to the appropriate key in the section
    result[section][key].push(entry);
  });
  return result;
}