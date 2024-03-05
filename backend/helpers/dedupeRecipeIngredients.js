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

function dedupeRecipeIngredients(recipe) {

    const uniqueIds = new Set();

    recipe.extendedIngredients = recipe.extendedIngredients.filter(ingredient => {
        if (!uniqueIds.has(ingredient.id)) {
            uniqueIds.add(ingredient.id);
            return true;
        }
        return false;
    });

    return recipe;
}

module.exports = dedupeRecipeIngredients;