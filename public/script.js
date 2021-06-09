;(function () {
  'use strict'

  const $window = $(window)
  const INTERVAL = 30

  const setIn = function () {
    const inRatio = 1
    const $ins = $('[data-in]')

    const onScroll = function () {
      const windowHeight = $window.height()
      const scrollTop = $window.scrollTop()

      $ins.each(function () {
        const $el = $(this)

        if (!$el.is('[data-in-out]') && $el.hasClass('is-in')) {
          return
        }

        const inOutTop = $el.data('in-top')
        if (inOutTop) {
          $el.toggleClass('is-in', scrollTop >= inOutTop)
          return
        }

        const $group = $el.closest('[data-in-group]')
        const elTop = $group.length ? $group.offset().top : $el.offset().top
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

  const setSamaHeight = function () {
    const $els = $('[data-same-height]')

    const onResize = function () {
      $els.each(function () {
        const $el = $(this)
        const height = $($el.data('same-height')).outerHeight()
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

  const setSticky = function () {
    $('[data-sticky]').sticky()
  }

  const fixPage = function () {
    const $body = $('body')
    const scrollTop = $('html, body').scrollTop()

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

  const releasePage = function () {
    const $body = $('body')
    const scrollTop = $body.data('scrollTop') || 0

    if (!$body.hasClass('is-fixed')) {
      return
    }

    $body.removeClass('is-fixed').removeAttr('style')
    $('html, body').scrollTop(scrollTop)
  }

  const setMenuModal = function () {
    const $body = $('body')

    const toggleModal = function (isOpen) {
      const nextIsOpen = isOpen === undefined ? !$body.hasClass('is-menu-open') : isOpen
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

  const setSmoothScroll = function () {
    $('a[href^="#"]').on('click', function (ev) {
      ev.preventDefault()
      const href = $(this).attr('href')
      const $target = href !== '#' ? $(href) : $('body')
      const $offset = $('[data-scroll-offset]')
      const targetTop = $target.offset().top
      const offsetTop = $offset.length ? $offset.height() : 0
      const scrollTop = targetTop - offsetTop
      $('html, body').stop().animate(
        {
          scrollTop: scrollTop,
        },
        800,
        'easeOutQuint'
      )
    })
  }

  setIn()
  setSamaHeight()
  setSticky()
  setMenuModal()
  setSmoothScroll()
})()
