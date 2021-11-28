export function setSmoothScroll() {
  gsap.utils.toArray('a[href*="#"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault()
      gsap.to(window, { scrollTo: e.target.getAttribute('href') })
    })
  })
}
