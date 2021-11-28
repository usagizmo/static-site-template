export function setIn() {
  gsap.utils.toArray('[data-in="slide-in"]').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 100%-=80px',
      },
      y: 20,
      opacity: 0,
    })
  })
}
