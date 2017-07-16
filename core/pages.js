// pages.js
'use strict'

var express = require('express'),
    hbs = require('express-handlebars'),
    fs = require('fs'),
    md = new require('markdown-it')({ html: true }),
    rejectNames = ['nav', 'footer', 'maintenance']

module.exports.resolve = function(name, res) {
    name = name.replace(/[^a-zA-Z0-9_\-]/g, '')

    getContent(name, (data) => {
        var context = {}, template
        if (data !== undefined) {
            context = process(data)
            context.name = name // add current page name
            template = context.template || 'default'
            res.status(200).render(template, context)
        } else {
            getContent('404', (data) => {
                data = data || 'ERROR: File not found'
                context = process(data)
                context.name = name
                template = context.template || 'default'
                res.status(404).render(template, context)
            })
        }
    })
}

/// Process page data and return page context for handlebars template
function process(content) {
    var p = pageProperties(content),
        html = md.render(p.content)
    p.content = expandSections(html)
    return p
}

/// Extracts title, keywords and other properties from page content
/// Property line starts with '@' character
function pageProperties(content) {
    var lines = content.split('\n'),
        result = [],
        object = {},
        skip = ['section', 'subsection', 'space']
    lines.forEach(function(s) {
        var p = [], command
        if (s[0] === '@') {
            p = s.split(' ')
            command = (p[0]).toLowerCase().substr(1)
            if (skip.indexOf(command) === -1) {
                // A command found
                if (command.length > 0) {
                    object[command] = p.slice(1).join(' ')
                }
            } else {
                result.push(s)
            }
        } else {
            result.push(s)
        }
    })
    object.content = result.join('\n')
    return object
}

/// Expands @section and @subsection keywords to HTML tags
/// @section = <section>...</section>
/// @subsection = <div class="subsection (...)">...</div>
/// Any string after a keyword is treated as a list of css classes
function expandSections(s) {
    var inSection = false,
        inSubsection = false,
        lines = s.trim().split('\n'),
        result = []
    function getExtensions(classArray) {
        var ext = [],
            files = classArray.filter( (c) => c.startsWith('"') && c.endsWith('"') ),
            file = files[0]
        console.log('classArray: ' + classArray + ' files: ' + files)
        if (classArray.indexOf('video') !== -1 && file !== undefined) {
            ext.push('<video playsinline autoplay muted loop src=' + file + '></video>')
        }
        // cover must be the last element
        if (classArray.indexOf('video') !== -1 || classArray.indexOf('image') !== -1 || classArray.indexOf('fixed-image') !== -1 || classArray.indexOf('slides') !== -1) {
            ext.push('<div class="section-cover"></div>')
        }
        return ext.join('')
    }
    function beginSection(classNames) {
        var classString = (classNames || 'default').replace(/&quot;/g, '"'),
            classArray = classString.split(' '),
            extensions = getExtensions(classArray),
            classArray = classArray.filter( (c) => !(c.startsWith('"') && c.endsWith('"')) )
        if (inSubsection) endSubsection()
        if (inSection) endSection()
        result.push('<section class="' + classArray.join(' ') + '">' + extensions + '<div class="section-wrapper">')
        inSection = true
    }
    function endSection() {
        if (inSubsection) endSubsection()
        result.push('</div></section>')
        inSection = false
    }
    function beginSubsection(classNames) {
        var classString = classNames || 'default'
        if (inSubsection) endSubsection()
        result.push('<div class="subsection ' + classString + '">')
        inSubsection = true
    }
    function endSubsection() {
        result.push('</div>')
        inSubsection = false
    }

    lines.forEach(function(line, i) {
        var p = [],
            command,
            classNames
        if (line.startsWith('<p>@s') || line.startsWith('@s')) {
            // remove tags added by markdown.render()
            p = line.replace(/<\/?p>/g, '').split(' ')
            command = p[0]
            classNames = p.slice(1).filter(function(o) {
                return (o.trim() !== '')
            }).join(' ')
            if (command === '@section') beginSection(classNames)
            if (command === '@subsection') beginSubsection(classNames)
            if (command === '@space') result.push('<div class="' + classNames + '"></div>')
        } else {
            if (!inSection) beginSection()
            if (!inSubsection) beginSubsection()
            result.push(line)
        }
    })
    // close section
    if (inSubsection) endSubsection()
    if (inSection) endSection()
    return result.join('\n')
}

/// Get content of a file
function getContent(name, cb) {
    var filename = 'pages/' + name + '.md'
    if (rejectNames.indexOf(name) !== -1) {
        cb()
    } else if (fs.existsSync(filename)) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) console.log(err);
            cb(data)
        })
    } else {
        cb()
    }
}
