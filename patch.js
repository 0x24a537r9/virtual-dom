var domIndex = require("./lib/dom-index")
var isArray = require("./lib/is-array")

module.exports = patch

function patch(rootNode, patches) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex])
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchList[i].apply(domNode)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchList.apply(domNode)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}
