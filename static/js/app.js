(function() {
    'use strict'
    window.app = new (function() {
        /// Runs on window.onload
        this.init = function() {
            app.resize()
            app.appendImageTitles()
        }
        /// Runs on window.onresize
        /// updates heights of elements with predefined classes heigh-xx, min-height-xx, max-height-xx
        this.resize = function(e) {
            var h = window.innerHeight,
                step = 10
            for(; step <= 100; step += 10) {
                _e('.height-' + step).forEach(function(e) {
                    e.style.height = (h * (step / 100)) + 'px'
                })
                _e('.max-height-' + step).forEach(function(e) {
                    e.style.maxHeight = (h * (step / 100)) + 'px'
                })
                _e('.min-height-' + step).forEach(function(e) {
                    e.style.minHeight = (h * (step / 100)) + 'px'
                })
            }
        }
        /// Iterates over images and creates image titles
        this.appendImageTitles = function() {
            _e('img').forEach(function(image) {
                var title = image.title,
                    node
                if (title !== undefined) {
                    node = document.createElement('p')
                    node.className = "image-title secondary"
                    node.innerHTML = title
                    image.parentNode.appendChild(node)
                }
            })
        }
        /// API test functoins
        this.testGet = function(id) {
            _e(id).val('')
            _e(id).css().add('progress')
            _c.get('/api/hello', {}, function(o, s) {
                _e(id).val(s)
                _e(id).css().remove('progress')
            })
        }
        this.testPost = function(id) {
            _e(id).val('')
            _e(id).css().add('progress')
            _c.post('/api/hello', {}, function(o, s) {
                _e(id).val(s)
                _e(id).css().remove('progress')
            })
        }
        this.testPut = function(id) {
            _e(id).val('')
            _e(id).css().add('progress')
            _c.put('/api/hello', {}, function(o, s) {
                _e(id).val(s)
                _e(id).css().remove('progress')
            })
        }
        this.testDelete = function(id) {
            _e(id).val('')
            _e(id).css().add('progress')
            _c.del('/api/hello', {}, function(o, s) {
                _e(id).val(s)
                _e(id).css().remove('progress')
            })
        }
    })() // app
    window.onload = app.init
    window.onresize = app.resize
})()
