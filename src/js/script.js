// import { removeInitialCover } from './modules/removeInitialCover.js'
// import { setDeep } from './modules/setDeep'
import { setIn } from './modules/setIn'
// import { setModal } from './modules/setModal'
import { setSmoothScroll } from './modules/setSmoothScroll'
// import { setSpMenu } from './modules/setSpMenu'
import { startAnimation } from './modules/startAnimation.js'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

startAnimation()
// removeInitialCover()
// setSpMenu()
setSmoothScroll()
setIn()
// setModal()
// setDeep()
