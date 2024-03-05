/** Function dedupeRecipeIngredients
 * 
 * Accepts a recipe object like:
 * {id, title, ..., [extendedIngredients]}
 * 
 * Where [extendedIngredients] like:
 * 
 * [{aisle, amount, id, ...}, {aisle, amount, id, ...}... ]
 * 
 * For ingredient in extendedIngredients, if dupliacte ids, delete ingredient from extendedIngredients array.
 * 
 * Returns the object with no ingredients containing duplicate ids in [extendedIngredients]
 * 
*/

const dedupeRecipeIngredients = require("./dedupeRecipeIngredients")

const exampleRecipeWithDuplicate = {
                                    id:1,
                                    title: "faux recipe",
                                    extendedIngredients:[
                                        {
                                            id:55,
                                            name:"fake ingredient"
                                        },
                                        {
                                            id:55,
                                            name:"fake ingredient duplicate"
                                        },
                                        {
                                            id:786,
                                            name:"fake ingredient different"
                                        },
                                    ]
                                };

const exampleRecipeWithOutDuplicate = {
                                    id:1,
                                    title: "faux recipe",
                                    extendedIngredients:[
                                        {
                                            id:55,
                                            name:"fake ingredient"
                                        },
                                        {
                                            id:786,
                                            name:"fake ingredient different"
                                        },
                                    ]
                                };

describe("dedupeRecipeIngredients", () => {

    test("will remove duplicate ingredients if duplicate ingredient passed in", () => {

        const result = dedupeRecipeIngredients(exampleRecipeWithDuplicate)

        expect(result).toEqual(exampleRecipeWithOutDuplicate)

    });

    test("will return without modification if no ingredient passed in", () => {

        const result = dedupeRecipeIngredients(exampleRecipeWithOutDuplicate)

        expect(result).toEqual(exampleRecipeWithOutDuplicate)

    });


})