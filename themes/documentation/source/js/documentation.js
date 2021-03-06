// header nav dropdown
+function($) {
  $(function() {
    dropdownToggle('.levelA', '.levelB')
    dropdownToggle('.levelB', '.levelC')
  })

  function dropdownToggle(sup, sub) {
    var subWrapper
    $(sup).hover(function() {
      subWrapper = $(this).find(sub + '-wrapper')
      subWrapper.show()
    }, function() {
      subWrapper = $(this).find(sub + '-wrapper')
      subWrapper.hide()
    })
  }
}(jQuery)



// index redirect
+function() {
  var lang

  function getCookie(name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length == 2)
      return parts.pop().split(';').shift()
  }

  function getLang(prefLang, savePref) {
    var browserLang = /zh/.test(navigator.userLanguage || navigator.language) ? 'zh-cn' : 'en-us'
    if (/zh-cn/.test(prefLang) || /en-us/.test(prefLang)) {
      lang = prefLang
    } else {
      lang = browserLang
      savePref(lang)
    }
  }

  if (localStorage) {
    var prefLang = localStorage.getItem('lang')
    var setStorage = function(lang) {
      localStorage.setItem('lang', lang)
    }
    getLang(prefLang, setStorage)
  } else {
    var prefLang = getCookie('lang')
    var setCookie = function(lang) {
      document.cookie = 'lang=' + lang + '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    }
    getLang(prefLang, setCookie)
  }

  if (location.pathname === '/')
    location.href = lang + '/overview/overview.html'
}()



// lang switch
+function($) {
  $(function() {
    $('.lang-switch').click(function() {
      var lang = $(this).data('lang')
      var paths = location.pathname.split('/').slice(2)
      paths.unshift(lang)
      location.href = '/' + paths.join('/')

      if (localStorage) {
        localStorage.setItem('lang', lang)
      } else {
        document.cookie = 'lang=' + lang + '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
      }
    })
  })
}(jQuery)



// doc editing
+function($) {
  $(function() {
    var path = location.pathname
    var editPath = 'https://github.com/gizwits-docs/gizwits-docs/edit/develop/source' + path.slice(0, path.length - 4) + 'md'
    $('.edit-link').attr('href', editPath)
  }) 
}(jQuery)



// documentation's navigation
+function($) {
  $(function() {
    var headings = $('.markdown-body').find('h1, h2')
    var navigation = '<ol>'
    headings.each(function(index) {
      var $this = $(this)
      var className = $this.prop('tagName').toLowerCase()
      var anchor = $this.attr('id')
      var text = $this.text()
      var element = '<a class="' + className + '" href="#' + anchor + '">' + text + '</a>'
      $this.wrap('<a href="#' + anchor + '"></a>')

      switch (className) {
        case 'h1':
          navigation += (index ? '</ol></li>' : '') + '<li>' + element + '<ol>'
          break
        case 'h2':
          navigation += '<li>' + element + '</li>' + (index === (length - 1) ? '</ol></li>' : '')
          break
      }
    })
    navigation += '</ol>'
    navigation = navigation.replace(/<ol><\/ol>/g, '')
    $('.navigation').find('.nav').append(navigation)
  })
}(jQuery)



// doc's nav scrollspy
+function($) {
  $(function() {
    $('.navigation li:first').addClass('active')
    var timeoutHandler
    var navHeight = $('.navigation').height()
    $(window).scroll(function() {
      clearTimeout(timeoutHandler)
      if (!$('.navigation .active').length) {
        $('.navigation li:first').addClass('active')
      }
      var pos = $('.navigation .active:last').position().top

      timeoutHandler = setTimeout(function() {
        if (pos + $('.navigation').scrollTop() > navHeight) {
          $('.navigation').animate({
            scrollTop: pos + $('.navigation').scrollTop()
          })
        } else if (pos - navHeight < 376) {
          $('.navigation').animate({
            scrollTop: - pos - $('.navigation').scrollTop()
          })
        }
      }, 500)

      $('.navigation .active').each(function() {
        var $this = $(this)
        if ($this.find('.active').length) {
          $this.css('background', '#fcfcfc')
        }
      })
    })
    $('body').scrollspy({target: '.navigation'})
  })
}(jQuery)



// fix fixed header anchors' behavior
+function($) {
  $(function() {
    $(window).hashchange(function() {
      var headerHeight = $('.header').height()
      $(window).scrollTop($(window).scrollTop() - headerHeight)
    })
  })
}(jQuery)



// clipboard
+function($) {
  $(function() {
    $('.code pre').prepend($('<i class="fa fa-clone fa-lg tooltip" title="复制" aria-hidden="true"><i class="tooltiptext">已复制</i></i>'))

    new Clipboard('.fa-clone', {
      text: function(trigger) {
        var $trigger = $(trigger)
        var text = ''
        var tooltip = $trigger.find('.tooltiptext')

        $trigger.parent().find('.line').each(function() {
          text += $(this).text() + '\n'
        })
        tooltip.show()
        setTimeout(function() {
          tooltip.hide()
        }, 1000)
        return text
      }
    })
  })
}(jQuery)