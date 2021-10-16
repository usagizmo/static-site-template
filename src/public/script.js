;(function () {
  'use strict'

  var $window = $(window)
  var $body = $('body')
  var INTERVAL = 30

  function throttle(func, interval) {
    var timer = null
    var self = this
    return function () {
      if (timer === null) {
        timer = setTimeout(function () {
          func.apply(self, arguments)
          timer = null
        }, interval)
      }
    }
  }

  var setIn = function () {
    var inRatio = 1
    var $ins = $('[data-in]')

    var onScroll = function () {
      var windowHeight = $window.height()
      var scrollTop = $window.scrollTop()

      $ins.each(function () {
        var $el = $(this)

        if (!$el.is('[data-in-out]') && $el.hasClass('is-in')) {
          return
        }

        var inOutTop = $el.data('in-top')
        if (inOutTop) {
          $el.toggleClass('is-in', scrollTop >= inOutTop)
          return
        }

        var $group = $el.closest('[data-in-group]')
        var elTop = $group.length ? $group.offset().top : $el.offset().top
        $group.add($el).toggleClass('is-in', inRatio >= (elTop - scrollTop) / windowHeight)
      })
    }

    $window.on({
      scroll: throttle(function () {
        onScroll()
      }, INTERVAL),
      load: function () {
        onScroll()
      },
    })
  }

  var fixPage = function () {
    var scrollTop = $('html, body').scrollTop()

    if ($body.hasClass('is-fixed')) {
      return
    }

    $body.data('scrollTop', scrollTop).addClass('is-fixed').css({
      position: 'fixed',
      left: 0,
      top: -scrollTop,
      width: '100%',
    })
  }

  var releasePage = function () {
    var scrollTop = $body.data('scrollTop') || 0

    if (!$body.hasClass('is-fixed')) {
      return
    }

    $body.removeClass('is-fixed').removeAttr('style')
    $('html, body').scrollTop(scrollTop)
  }

  var setMenuModal = function () {
    var toggle = function ($el, isOpen) {
      var nextIsOpen = isOpen === undefined ? !$el.hasClass('is-open') : isOpen
      $el.toggleClass('is-open', nextIsOpen)
      nextIsOpen ? fixPage() : releasePage()
    }

    $('[data-modal-toggle]').on('click', function () {
      var $modal = $($(this).data('modal-toggle'))
      toggle($modal)
    })

    $('[data-modal-open]').on('click', function () {
      fixPage()
      var $modal = $($(this).data('modal-open'))
      toggle($modal, true)
    })

    $('[data-modal-close]').on('click', function () {
      releasePage()
      toggle($('[data-modal]'), false)
    })
    $('[data-modal-close-prevent]').on('click', function (ev) {
      ev.stopPropagation()
    })
  }

  var setAccordion = function () {
    var SELECTOR = {
      accordion: '.js-accordion',
      button: '.js-accordion_button',
      content: '.js-accordion_content',
    }

    var toggleIsOpen = function (uid, $el, $content, isOpen) {
      window[uid] = window[uid] || {
        removeMaxHeight: function () {
          $content.css('max-height', '')
          $content.off('transitionend', window[uid].removeMaxHeight)
        },
      }
      $content.off('transitionend', window[uid].removeMaxHeight)

      if (isOpen) {
        $el.addClass('is-open')
        var height = $content.height()

        $content.css('max-height', 'none')
        var maxHeight = $content.height()

        $content.css('max-height', height)

        setTimeout(function () {
          $content.on('transitionend', window[uid].removeMaxHeight)
          $content.css('max-height', maxHeight)
        }, 0)
      } else {
        $el.removeClass('is-open')
        var height = $content.height()
        $content.css('max-height', height)

        setTimeout(function () {
          $content.css('max-height', 0)
        }, 0)
      }
    }

    var $accordions = $(SELECTOR.accordion)

    $accordions.each(function (i) {
      var $accordion = $(this)
      var $button = $accordion.find(SELECTOR.button)
      var $content = $accordion.find(SELECTOR.content)
      $button.on('click', function () {
        var nextIsOpen = !$accordion.hasClass('is-open')
        toggleIsOpen('accordion.' + i, $accordion, $content, nextIsOpen)
      })
    })
  }

  var setSmoothScroll = function () {
    var scrollTo = function ($target) {
      if (!$target.length) return

      var $offset = $('[data-scroll-offset]')
      var targetTop = $target.offset().top
      var offsetTop = $offset.length ? $offset.height() : 0
      var scrollTop = targetTop - offsetTop
      $('html, body').stop().animate(
        {
          scrollTop: scrollTop,
        },
        800,
        'easeOutQuint'
      )
    }

    $('a[href^="#"], a[href^="./#"]').on('click', function () {
      var href = $(this).attr('href').replace(/^\.\//, '')
      var $target = href !== '#' ? $(href) : $body
      scrollTo($target)
    })

    $window.on({
      load: function () {
        var $target = $(window.location.hash)
        scrollTo($target)
      },
    })
  }

  var startAnimation = function () {
    $body.removeClass('u-prevent-initial-animation')
  }

  setIn()
  setMenuModal()
  setSmoothScroll()
  setAccordion()
  startAnimation()
})()
