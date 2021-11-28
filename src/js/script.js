import { startAnimation } from './modules/startAnimation.js'
import { setSmoothScroll } from './modules/setSmoothScroll'
import { setIn } from './modules/setIn'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

startAnimation()
setSmoothScroll()
setIn()
