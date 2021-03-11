;(function () {
  'use strict'

  const INTERVAL = 100

  const setIn = function () {
    const inRatio = 1
    const $ins = $('[data-in]')

    const onScroll = function () {
      const windowHeight = $(window).height()
      const scrollTop = $(window).scrollTop()

      $ins.each(function () {
        const $el = $(this)

        if (!$el.is('[data-in-out]') && $el.hasClass('--in')) {
          return
        }

        const inOutTop = $el.data('in-top')
        if (inOutTop) {
          $el.toggleClass('--in', scrollTop >= inOutTop)
          return
        }

        const elTop = $el.offset().top
        $el.toggleClass('--in', inRatio >= (elTop - scrollTop) / windowHeight)
      })
    }

    $(window).on(
      'scroll',
      $.throttle(INTERVAL, function () {
        onScroll()
      })
    )
    onScroll()
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

    $(window).on(
      'resize',
      $.throttle(INTERVAL, function () {
        onResize()
      })
    )
    onResize()
  }

  const setSticky = function () {
    $('.js-sticky').sticky()
  }

  const fixPage = function () {
    const $body = $('body')
    const scrollTop = $('html, body').scrollTop()

    if ($body.hasClass('--fixed')) {
      return
    }

    $body.data('scrollTop', scrollTop).addClass('--fixed').css({
      position: 'fixed',
      left: 0,
      top: -scrollTop,
      width: '100%',
    })
  }

  const releasePage = function () {
    const $body = $('body')
    const scrollTop = $body.data('scrollTop') || 0

    if (!$body.hasClass('--fixed')) {
      return
    }

    $body.removeClass('--fixed').removeAttr('style')
    $('html, body').scrollTop(scrollTop)
  }

  const setMenuModal = function () {
    const $body = $('body')

    const toggleModal = function (isOpen) {
      const nextIsOpen = isOpen === undefined ? !$body.hasClass('--menu-open') : isOpen
      $body.toggleClass('--menu-open', nextIsOpen)
      nextIsOpen ? fixPage() : releasePage()
    }

    $('.js-toggle-menu').on('click', function () {
      toggleModal()
    })
    $('.js-open-menu').on('click', function () {
      toggleModal(true)
    })
    $('.js-close-menu').on('click', function () {
      toggleModal(false)
    })
  }

  const setSmoothScroll = function () {
    $('a[href^="#"]:not([href="#"])').on('click', function (ev) {
      ev.preventDefault()
      const $target = $($(this).attr('href'))
      const $offset = $('.js-scroll-offset')
      let offsetTop = 0

      if (!$target.length) {
        return
      }

      if ($offset.length) {
        offsetTop = $offset.height()
      }

      const scrollTop = $target.offset().top - offsetTop
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
