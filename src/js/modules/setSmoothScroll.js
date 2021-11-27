// ref: https://github.com/cferdinandi/smooth-scroll

export function setSmoothScroll() {
  // eslint-disable-next-line no-undef
  new SmoothScroll('a[href*="#"]', {
    header: null, // Selector for fixed headers
    speed: 600,
    speedAsDuration: true,
    offset: 20,
    easing: 'easeOutQuint',
  })
}
