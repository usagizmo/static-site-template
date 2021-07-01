;(function () {
  'use strict'

  var $window = $(window)
  var INTERVAL = 30

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
      scroll: $.throttle(INTERVAL, function () {
        onScroll()
      }),
      load: function () {
        onScroll()
      },
    })
  }

  var setSamaHeight = function () {
    var $els = $('[data-same-height]')

    var onResize = function () {
      $els.each(function () {
        var $el = $(this)
        var height = $($el.data('same-height')).outerHeight()
        $el.height(height)
      })
    }

    $window.on(
      'resize',
      $.throttle(INTERVAL, function () {
        onResize()
      })
    )
    onResize()
  }

  var setSticky = function () {
    $('[data-sticky]').sticky()
  }

  var fixPage = function () {
    var $body = $('body')
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
    var $body = $('body')
    var scrollTop = $body.data('scrollTop') || 0

    if (!$body.hasClass('is-fixed')) {
      return
    }

    $body.removeClass('is-fixed').removeAttr('style')
    $('html, body').scrollTop(scrollTop)
  }

  var setMenuModal = function () {
    var $body = $('body')

    var toggleModal = function (isOpen) {
      var nextIsOpen = isOpen === undefined ? !$body.hasClass('is-menu-open') : isOpen
      $body.toggleClass('is-menu-open', nextIsOpen)
      nextIsOpen ? fixPage() : releasePage()
    }

    $('[data-toggle-menu]').on('click', function () {
      toggleModal()
    })
    $('[data-open-menu]').on('click', function () {
      toggleModal(true)
    })
    $('[data-close-menu]').on('click', function () {
      toggleModal(false)
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
      var $target = href !== '#' ? $(href) : $('body')
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
    $('body').removeClass('u-animation-stopped')
  }

  setIn()
  setSamaHeight()
  setSticky()
  setMenuModal()
  setSmoothScroll()
  startAnimation()
})()
