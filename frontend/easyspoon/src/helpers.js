
const removeDuplicateById = (objs) => {

    let uniqueObjs = {};

    objs.forEach(obj => {
        if (!uniqueObjs[obj.id]) {
            uniqueObjs[obj.id] = obj;
        }
    });

    return Object.values(uniqueObjs);

}

export {removeDuplicateById}