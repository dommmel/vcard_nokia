function phoneNumbers(parsedVcard) {
  let phoneNumbers = []
  Object.keys(parsedVcard).forEach( key => {
    let tel = parsedVcard[key]["tel"]
    if (tel === undefined) {
      return
    }
    if (parsedVcard[key]["x-ablabel"]) {
      tel[0]["label"] = parsedVcard[key]["x-ablabel"][0].value
    }
    phoneNumbers = [...phoneNumbers, ...tel];
  })
  return phoneNumbers
}

/**
 * 
 * @param {Object} parsedVcard 
 * @returns a json object ready to be written out to a NOKIA specific vcard object
 */
export function Nokia(parsedVcard) {
  return {
    name: parsedVcard.default.fn[0].value,
    tel:phoneNumbers(parsedVcard)
  }
}

/**
 * 
 * @param {Object} nokiaJson 
 * @returns a one or more vcards as a string
 * 
 * If there are multiple phone numbers, there will be multiple vcards.
 * 
 * Exeption: If a contact has two phone number, and contains type=CELL but not type=HOME and 
 * the other contains type=HOME and not type=CELL, then they will be combined into one vcard.
 * 
 * Ortherwise, each phone number will be in a separate vcard.
 * For the additional vcards, the name will have a number appended to it, e.g. "Julia Mugglewood (1)".
 * If the number has a label associated with it, it will be appended to the name, e.g. "Julia Mugglewood (ch mobile)".
 * 
 */
export function ToVcards(nokiaJson) {
  const vcards = [];
  const { name, tel: phoneNumbers } = nokiaJson;

  // Filtering numbers to find ones with exclusive types CELL and HOME
  let cellOnly, homeOnly; 
  if (phoneNumbers.length === 2) {
    cellOnly = phoneNumbers.find(phone => phone.type && phone.type.includes("CELL") && !phone.type.includes("HOME"));
    homeOnly = phoneNumbers.find(phone => phone.type && phone.type.includes("HOME") && !phone.type.includes("CELL"));
  }

  if (cellOnly && homeOnly) {
      // Combine into one vCard when exactly two numbers match the specified types
      vcards.push(`BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:${name}
TEL;type=CELL:${cleanupTel(cellOnly.value)}
TEL;type=HOME:${cleanupTel(homeOnly.value)}
END:VCARD\r\n`);
  } else {
      // Handle all other numbers individually
      phoneNumbers.forEach((phone, index) => {
          let labelSuffix = phone.label ? ` (${phone.label})` : '';
          let numberSuffix = labelSuffix === '' && index > 0 ? ` (${index})` : '';
          vcards.push(`BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:${name}${labelSuffix}${numberSuffix}
TEL:${cleanupTel(phone.value)}
END:VCARD\r\n`);
      });
  }

  // Join all vcards into a single string.
  // First, normalize any existing CR+LF to LF to avoid duplicating CR in CR+LF
  // Then, replace all LF with CR+LF
  return vcards.join('').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
}

/*
* @param {string} tel
* @returns {string} cleaned up tel number
* description: 
*  - remove all spaces
*  - replace 00 with + at the beginning of the number
*  - remove zeros in parentheses (0)
*  - lastly remove all characters that are not numbers or the plus + sign
*/
function cleanupTel(tel) {
  return tel.replace(/\s/g, '').replace(/^00/, '+').replace(/\(0\)/g, '').replace(/[^0-9+]/g, '');
}