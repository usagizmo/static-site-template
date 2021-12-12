import { startAnimation } from './modules/startAnimation.js'
// import { removeInitialCover } from './modules/removeInitialCover.js'
// import { setSpMenu } from './modules/setSpMenu'
import { setSmoothScroll } from './modules/setSmoothScroll'
import { setIn } from './modules/setIn'
// import { setModal } from './modules/setModal'
// import { setDeep } from './modules/setDeep'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

startAnimation()
// removeInitialCover()
// setSpMenu()
setSmoothScroll()
setIn()
// setModal()
// setDeep()
