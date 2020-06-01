function allNotranslate(target) {
    if ("notranslate" in target.classList.values()) return
    for (let node of target.childNodes) {
        let text = node.textContent
        if (text != undefined && text.length > 0) {
            let nodeName = String(node.nodeName)
            if (["SPAN", "#text", "CODE", "PRE"].includes(nodeName)) {
                if (!text.includes("\n") && (text.startsWith('//') || text.startsWith('#'))
                    || text.startsWith('/*') && text.endsWith('*/')
                ) continue
            }
            if (nodeName == "#text") {
                if (target.childElementCount == 0) {
                    target.classList.add("notranslate")
                }
                else {
                    let c = document.createElement("span")
                    c.textContent = node.data
                    c.classList.add("notranslate")
                    node.replaceWith(c)
                }
            }
        }
        if (node.hasChildNodes()) allNotranslate(node)
    }
}

var notranslateName = [
    'PRE', 'CODE', 'FIGURE', 'SOURCE'
]

function addNotranslate(target) {
    for (let node of target.children) {
        let nodeName = String(node.nodeName)
        if (notranslateName.includes(nodeName)
            || nodeName.search('COMMAND') >= 0
            || nodeName.search('CODE') >= 0) {
            // node.classList.add("notranslate")
            allNotranslate(node)
            continue
        }
        else if (node.className != undefined) {
            let className = String(node.className)
            if (className.search("shell") >= 0
                || (className.search("code") >= 0
                    && className.search("block") < 0
                    && className.search("container") < 0
                )) {
                allNotranslate(node)
                continue
            }
        }
        if (node.hasChildNodes()) addNotranslate(node)
    }
}

addNotranslate(document.firstElementChild)
setTimeout(addNotranslate, 1000, document.firstElementChild)
