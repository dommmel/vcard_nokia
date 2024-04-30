import { expect, test } from 'vitest'
import { Parse } from './parser.js'

const vcardsInput = `
BEGIN:VCARD
VERSION:3.0
PRODID:-//Apple Inc.//macOS 14.4.1//EN
N:Mugglewood;Julia;;;
FN:Julia Mugglewood
EMAIL;type=INTERNET;type=pref:Mugglewoodjulia@Mugglewood.ch
EMAIL;type=INTERNET;type=HOME:julia@gmail.com
TEL;type=IPHONE;type=CELL;type=VOICE;type=pref:+49 1514444
item1.TEL:+41 77 0000000
item1.X-ABLabel:ch mobile
item2.TEL;type=HOME,VOICE:+49 176 123
item2.X-ABLabel:old
ADR;type=HOME;type=pref:;;Streefs 8; City;;83434724;Schweiz
BDAY:1983-08-06
X-IMAGEHASH:raJaq58verpEhqpOHBrD0Q==
X-IMAGETYPE:PHOTO
REV:2024-04-24T11:16:44Z
END:VCARD
BEGIN:VCARD
VERSION:3.0
N:Mugglewood;Martin;;;
FN:Martin Mugglewood
ORG: agents of chaos;
BDAY;VALUE=date:1979-10-10
TITLE:Head of SEM
item1.ADR;TYPE=WORK;TYPE=pref:;;Hossa 10-12;Hussa;Baden-Würt
 temberg;89898;Germany
item1.X-ABADR:de
TEL;TYPE=CELL;TYPE=pref;TYPE=VOICE:+49 177 3333333
TEL;TYPE=HOME;TYPE=VOICE:0703291444444
PRODID:-//Apple Inc.//iCloud Web Address Book 2414B11//EN
REV:2024-04-28T12:17:00Z
END:VCARD
BEGIN:VCARD
VERSION:3.0
N:Mugglewood;Dominik;;;
FN:Dominik Mugglewood
TEL;type=IPHONE;type=CELL;type=VOICE;type=pref:+49 163162
item2.TEL;type=HOME,VOICE:0899889898998
item2.X-ABLabel:festnetz
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:Daniel Mugglewood
TEL;type=IPHONE;type=CELL;type=VOICE;type=pref:+49 163162
TEL;type=HOME,VOICE:08158635
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:Mama Mugglewood
TEL;type=IPHONE;type=CELL;type=VOICE;type=pref:+49178665
item1.TEL:+41 7754545454
item1.X-ABLabel:ch mobile
item2.TEL:+41 7657657657
TEL;type=HOME,VOICE:+49 176 123
END:VCARD
`

export const Cards = Parse(vcardsInput)

test('Julia was parsed correctly', () => {
  const julia = {
    "default": {
      "fn": [{ "value": "Julia Mugglewood" }],
      "tel": [{ "type": ["IPHONE", "CELL","VOICE","pref"], "value": "+49 1514444" }]
    },
    "item1": {
      "tel": [{ "value": "+41 77 0000000" }],
      "x-ablabel": [{ "value": "ch mobile" }]
    },
    "item2": {
      "tel": [{ "type": ["HOME","VOICE"], "value": "+49 176 123" }],
      "x-ablabel": [{ "value": "old" }]
    }
  }
  expect(Cards[0]).toEqual(julia)
})  

