# Format vCards for Nokia 2660 (30+ series)

## Why?

Nokia 2660 (30+ series) vCard import just sucks so bad.

- It only accepts a single (last) name per contact  
- It cannot deal with more than two phone numbers per contact (and then, one has to be *cell* and one *home*)
- It will fail to import on many occasions.

## What?

- Break contacts into multiple vCards, e.g "John Doe" and "John Doe (1)"
- When possible use custom labels as name suffixes, e.g "John Doe (old cell)"
- Use DOS line breaks (CRLF) instead of Unix (LF)
- Have a look at the source code for more details

## How?

1. Export vcf file from iCloud or Google
2. Use the [website](http://dommmel.github.io/vcard_nokia) to upload the vcf file and download the re-formatted vcf file
3. Transfer the file to your Nokia 2660 (e.g. via Bluetooth or USB cable)
