/** Function intolerancesToQueryString
 * 
 * Accepts an array of intolerances like:
 * [{ intoleranceId: 2, intoleranceName: 'egg' }, { intoleranceId: 3, intoleranceName: 'gluten' }]
 * 
 * Returns a string like 'egg,gluten'
 * 
 * If a space in intoleranceName like 'sea food' replace ' ' with %20 like 'sea%20food'
 * 
 * If no input like: [] return ''
 * 
*/

const intolerancesToQueryString = require("./intolerancesToQueryString")

const example2Input = [{ intoleranceId: 2, intoleranceName: 'egg' }, { intoleranceId: 3, intoleranceName: 'gluten' }]

const example2InputA = [{ intoleranceId: 2, intoleranceName: 'egg' }, { intoleranceId: 8, intoleranceName: 'tree nut' }]

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

describe("intolerancesToQueryString", () => {

    test("works with example inputs - array of 2 intolerances", () => {

        const result = intolerancesToQueryString(example2Input)

        expect(result).toEqual('egg,gluten')

    });

    test("works with example inputs - array of 2 intolerances - with space replace", () => {

        const result = intolerancesToQueryString(example2InputA)

        expect(result).toEqual('egg,tree%20nut')

    });

    test("works with example inputs - array of 0 intolerances", () => {

        const result = intolerancesToQueryString(exampleNoInput)

        expect(result).toEqual('')

    });

    test("works with example inputs - array of all intolerances", () => {

        const result = intolerancesToQueryString(exampleAllInput)

        expect(result).toEqual('dairy,egg,gluten,grain,peanut,seafood,sesame,shell%20fish,soy,sulfite,tree%20nut,wheat')

    });

})
