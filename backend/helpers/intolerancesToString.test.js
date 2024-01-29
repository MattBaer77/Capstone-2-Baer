/** Function intolerancesToString
 * 
 * Accepts an array of intolerances like:
 * [{ intoleranceId: 2, intoleranceName: 'egg' }, { intoleranceId: 3, intoleranceName: 'gluten' }]
 * 
 * Returns a string like 'egg free, gluten free'
 * 
 * If no input like: [] return ''
 * 
*/

const { intolerancesToString } = require("./intolerancesToString")

const example2Input = [{ intoleranceId: 2, intoleranceName: 'egg' }, { intoleranceId: 3, intoleranceName: 'gluten' }]

const exampleNoInput = []

const exampleAllInput = [

    { intoleranceId: 1, intoleranceName: 'dairy' },
    { intoleranceId: 2, intoleranceName: 'egg' },
    { intoleranceId: 3, intoleranceName: 'gluten' },
    { intoleranceId: 4, intoleranceName: 'grain' },
    { intoleranceId: 5, intoleranceName: 'peanut' },
    { intoleranceId: 6, intoleranceName: 'seafood' },
    { intoleranceId: 7, intoleranceName: 'sesame' },
    { intoleranceId: 8, intoleranceName: 'shell fish' },
    { intoleranceId: 9, intoleranceName: 'soy' },
    { intoleranceId: 10, intoleranceName: 'sulfite' },
    { intoleranceId: 11, intoleranceName: 'tree nut' },
    { intoleranceId: 12, intoleranceName: 'wheat' },

]

describe("intolerancesToString", () => {

    test("works with example inputs - array of 2 intolerances", () => {

        const result = intolerancesToString(example2Input)

        expect(result).toEqual('egg free, gluten free')

    });

    test("works with example inputs - array of 2 intolerances", () => {

        const result = intolerancesToString(exampleNoInput)

        expect(result).toEqual('')

    });

    test("works with example inputs - array of all intolerances", () => {

        const result = intolerancesToString(exampleAllInput)

        expect(result).toEqual('diary free, egg free, gluten free, grain free, peanut free, seafood free, sesame free, shell fish free, soy free, sulfite free, tree nut free, wheat free')

    });

})
