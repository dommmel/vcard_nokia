import { expect, test } from 'vitest'
import { Cards } from './parser.test.js'
import { Nokia,ToVcards } from './serializer.js'



function expectNumberOfVcardsToBe(vcards, number) {
   let re = /^FN.*/mg
   expect(vcards.match(re).length).toBe(number)
 
   re = /^BEGIN:VCARD.*/mg
   expect(vcards.match(re).length).toBe(number)
 
   re = /^END:VCARD.*/mg
   expect(vcards.match(re).length).toBe(number)
 
   re = /^TEL:.*/mg
   expect(vcards.match(re).length).toBe(number)
}
test('Julia has three phone numbers and a name', () => {
  const nokiaResult = Nokia(Cards[0])
  // console.log(JSON.stringify(nokiaResult))

  expect(nokiaResult.tel.length).toBe(3)
  expect(nokiaResult.name).toBe("Julia Mugglewood")
})

test('Martin has two phone numbers and a name', () => {
  const nokiaResult = Nokia(Cards[1])
  // console.log(JSON.stringify(nokiaResult))
  expect(nokiaResult.tel.length).toBe(2)
  expect(nokiaResult.name).toBe("Martin Mugglewood")
})

test('Contact with two numbers (one TYPE=CELL and one TYPE=HOME) becomes a single vcard', () => {
  const nokiaResult = Nokia(Cards[2])
  const vcards = ToVcards(nokiaResult)

  // console.log(vcards)
  let re = /^TEL.*/mg // 'm' is for multiline, 'g' for global search
  expect(vcards.match(re).length).toBe(2)

  re = /type=CELL:.*/mg
  expect(vcards.match(re).length).toBe(1)

  re = /type=HOME:.*/mg
  expect(vcards.match(re).length).toBe(1)

})

test('Contact with multiple (labeled) numbers becomes many vcards whre names have labels as suffix', () => {
  const nokiaResult = Nokia(Cards[0])
  const vcards = ToVcards(nokiaResult)

  expectNumberOfVcardsToBe(vcards, 3)

  // Two with labels
  let re = new RegExp(nokiaResult.name + " \\(ch mobile\\)","mg")
  expect(vcards.match(re).length).toBe(1)

  re = new RegExp(nokiaResult.name + " \\(old\\)","mg")
  expect(vcards.match(re).length).toBe(1)

  re = /\(old\)/mg
  expect(vcards.match(re).length).toBe(1)
  

})


test('Contact with multiple numbers becomes many vcards whre names have numbers as suffix', () => {
  const nokiaResult = Nokia(Cards[4])
  const vcards = ToVcards(nokiaResult)
  
  // console.log(vcards)
  expectNumberOfVcardsToBe(vcards, 4)

  expect(vcards).toContain("Mama Mugglewood (1)")
  expect(vcards).toContain("Mama Mugglewood (ch mobile)")

})