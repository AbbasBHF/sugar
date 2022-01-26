/**
 * Is it an element node
 * @param   {Element}  element
 * @return  {Boolean}
 */
export function isElement (element) {
    return element.nodeType === 1
}

/**
 * Is it a text node
 * @param   {Element}  element
 * @return  {Boolean}
 */
export function isTextNode (element) {
    return element.nodeType === 3
}

/**
 * Clear all children of element
 * @param  {Element}  element
 */
export function empty (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
    return element
}

/**
 * Get node attribute value
 * @param   {Element}  node
 * @param   {String}   name
 * @return  {String}
 */
export function getAttr (node, name) {
    return node.getAttribute(name) || ''
}

/**
 * Remove node attribute
 * @param  {Element}  node
 * @param  {String}   name
 */
export function removeAttr (node, name) {
    node.removeAttribute(name)
}

/**
 * Set node attribute
 * @param  {Element}  node
 * @param  {String}   name
 * @param  {String}   value
 */
export function setAttr (node, name, value) {
    // Remove attribute if value is null/undefined or false
    if (value == null || value === false) {
        return removeAttr(node, name)
    }

    if (value === true) {
        node[name] = value

        // Some browsers use node[name] = true
        // It is not possible to add custom attributes, at this time set an empty string
        if (!hasAttr(node, name)) {
            node.setAttribute(name, '')
        }
    } else if (value !== getAttr(node, name)) {
        node.setAttribute(name, value)
    }
}

/**
 * Determine if a node has an attribute
 * @param   {Element}  node
 * @param   {String}   name
 * @return  {Boolean}
 */
export function hasAttr (node, name) {
    return node.hasAttribute(name)
}

/**
 * Determine if a node has classname
 * @param   {Element}  node
 * @param   {String}   classname
 * @return  {Boolean}
 */
export function hasClass (node, classname) {
    let current, list = node.classList

    /* istanbul ignore else */
    if (list) {
        return list.contains(classname)
    } else {
        current = ' ' + getAttr(node, 'class') + ' '
        return current.indexOf(' ' + classname + ' ') > -1
    }
}

/**
 * Add classname to node
 * @param  {Element}  node
 * @param  {String}   classname
 */
export function addClass (node, classname) {
    let current, list = node.classList

    if (!classname || hasClass(node, classname)) {
        return
    }

    /* istanbul ignore else */
    if (list) {
        list.add(classname)
    } else {
        current = ' ' + getAttr(node, 'class') + ' '

        if (current.indexOf(' ' + classname + ' ') === -1) {
            setAttr(node, 'class', (current + classname).trim())
        }
    }
}

/**
 * Remove classname from node
 * @param  {Element}  node
 * @param  {String}   classname
 */
export function removeClass (node, classname) {
    let current, target, list = node.classList

    if (!classname || !hasClass(node, classname)) {
        return
    }

    /* istanbul ignore else */
    if (list) {
        list.remove(classname)
    } else {
        target = ' ' + classname + ' '
        current = ' ' + getAttr(node, 'class') + ' '

        while (current.indexOf(target) > -1) {
            current = current.replace(target, ' ')
        }

        setAttr(node, 'class', current.trim())
    }

    if (!node.className) {
        removeAttr(node, 'class')
    }
}

/**
 * Bind a node event
 * @param  {Element}   node
 * @param  {String}    evt
 * @param  {Function}  callback
 * @param  {Boolean}   capture
 */
export function addEvent (node, evt, callback, capture) {
    node.addEventListener(evt, callback, capture)
}

/**
 * Unbind a node event
 * @param  {Element}   node
 * @param  {String}    evt
 * @param  {Function}  callback
 * @param  {Boolean}   capture
 */
export function removeEvent (node, evt, callback, capture) {
    node.removeEventListener(evt, callback, capture)
}

/**
 * Export the DOM handling constructor as a component system
 */
export default function DOM () {
    this.empty = empty
    this.getAttr = getAttr
    this.removeAttr = removeAttr
    this.setAttr = setAttr
    this.hasAttr = hasAttr
    this.hasClass = hasClass
    this.addClass = addClass
    this.removeClass = removeClass
    this.addEvent = addEvent
    this.removeEvent = removeEvent
}
