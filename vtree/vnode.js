var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")

module.exports = VirtualNode

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties
    this.children = children
    this.key = (typeof key === "string") ? key : null
    this.namespace = (typeof namespace === "string") ? namespace : null
    this.count = countDescendants(children)
    this.hasWidgets = hasWidgets(children)
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

function countDescendants(children) {
    if (!children) {
        return 0
    }

    var count = children.length || 0
    var descendants = 0

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0
        }
    }

    return count + descendants
}

function hasWidgets(children) {
    if (!children) {
        return false
    }

    var count = children.length

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isWidget(child)) {
            if (typeof child.destroy === "function") {
                return true
            }
        } else if (isVNode(child) && child.hasWidgets) {
            return true
        }
    }

    return false
}
