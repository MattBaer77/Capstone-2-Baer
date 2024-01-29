/** Function intolerancesToString
 * 
 * Accepts an array of intolerances like:
 * [{ intoleranceId: 2, intoleranceName: 'egg' }, { intoleranceId: 3, intoleranceName: 'gluten' }]
 * 
 * Returns a string like 'egg free, gluten free'
 * 
*/

function intolerancesToQueryString(arr) {

    return ((arr.reduce((str, intolerance) => str + ((intolerance.intoleranceName).replace(/ /g, '%20')) + ',', '')).slice(0, -1))

};

module.exports = intolerancesToQueryString;