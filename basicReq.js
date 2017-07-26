function reqComps(fullname) {
    if (comps[fullname] == null || comps[fullname] == undefined) {
        throw new Error('require component not exist!' + 'please check your required Component');
    } else {
        return comps[fullname]();
    }
}

var comps = {};

for (var key in comps) {
    object.define(comps, key, {
        configurable: false,
        enumerable: true,
        writeable: false
    });
}

mudule.exports = {
    reqComps: reqComps,
    comps: comps
};