class Box{

  constructor(element){
    if(typeof element == "string"){
      this.dom = document.querySelector(element)
    }else if(typeof element == "object"){
      this.dom = element
    }
    if(!this.dom) console.error(`Element (${element}) wasn't found.`)
    this.rect()
    this.styles()
  }

  rect(){
    this.cachedRect = this.dom.getBoundingClientRect()
    return this.cachedRect
  }

  styles(){
    this.cachedStyles = this.dom.currentStyle || window.getComputedStyle(this.dom)
    return this.cachedStyles
  }

  inView(){
    const rect = this.rect()
    return rect.bottom >= 0
  }


  classReplace(wrong,right){
    let limiter
    clearTimeout(limiter)
    limiter = setTimeout(()=>{
      this.dom.className = this.dom.className.replace(wrong, '').replace(/\s\s/gi,' ') + ' ' + right
    },5)
  }


}


class Container extends Box{

  constructor(element){
    super(element)
  }

}


class FixedElement extends Box{

  constructor(options){
    const {
      element,
      container,
      offsetValue,
      offsetElement,
      offsetFunction,
      performancePriority = true
    } = options
    super(element)
    this.container                  = new Container(container)
    this.landmark                   = new Landmark(this)
    this.offsetValue                = offsetValue || 0
    this.offsetElement              = offsetElement
    this.offsetFunction             = offsetFunction
    this.isFixed                    = false
    this.performancePriority        = performancePriority
    this.reset()
    this.watchScroll()
    this.watchResize()
    this.update()
  }


  watchResize(){
    this.resizeListener = window.addEventListener('resize',()=>{
      this.reset()
      this.landmark.reset()
      clearTimeout(this.resizeLimiter)
      this.resizeLimiter = setTimeout(()=>{
        this.update()
        this.landmark.update()
      },100)
    })
  }


  stopWatchResize(){
    window.removeEventListener('resize',this.resizeListener)
  }


  watchScroll(){
    let limiter, limitCount = 0
    this.scrollListener = window.addEventListener('scroll',()=>{
      if(!this.performancePriority) return this.update()
      if(limitCount < 10) clearTimeout(limiter)
      limitCount++
      limiter = setTimeout(()=>{
        this.update()
        limitCount = 0
      },5)
    })
  }


  stopWatchScroll(){
    window.removeEventListener('scroll',this.scrollListener)
  }


  reset(){
    this.dom.removeAttribute('style')
    this.defaultPosition            = this.position()
    this.defaultWidth               = this.styles().defaultWidth
    this.defaultPositionMargins     = {
                                        top   : this.styles().top,
                                        right : this.styles().right,
                                        bottom: this.styles().bottom,
                                        left  : this.styles().left
                                      }
  }


  offset(){
    let offset = this.offsetValue || 0
    if(this.offsetElement){
      // STATIC OFFSET VALUE WILL BE ADDED TO OFFSET FROM ELEMENT
      offset += new Box(this.offsetElement).rect().height
    }
    if(this.offsetFunction){
      // MANUALLY EVALUATE OFFSET FROM A FUNCTION
      offset = this.offsetFunction(this,offset)
    }
    return offset
  }


  position(value){
    if(!value) return this.styles().position
    this.dom.style.position = value
  }


  positionMargins(values = {}){
    ['top','right','bottom','left'].forEach(
      attr => this.dom.style[attr] = values[attr] || 'auto'
    )
  }


  fix(value){
    this.isFixed = value
    if(this.isFixed){
      this.dom.style.width = this.dom.offsetWidth + 'px'
      this.position('fixed')
      this.positionMargins(this)
    }else{
      this.position(this.defaultPosition)
      this.positionMargins(this.defaultPositionMargins)
      this.dom.style.width = this.defaultWidth
    }
  }




  update(ev){
    const rect        = this.rect()
    const landmarkR   = this.landmark.rect()
    const containerR  = this.container.rect()
    const offset      = this.offset()
    const isFixed     = landmarkR.top <= 0 + offset
    const isAtContainerBottom = containerR.bottom <= rect.height + offset
    this.top          = offset
    this.left         = containerR.left

    // IF AT CONTAINER BOTTOM STATE CHANGED
    if(isAtContainerBottom != this.atContainerBottom){
      this.atContainerBottom = isAtContainerBottom
      const atContainerBottomRightState   =  isAtContainerBottom ? 'active' : 'inactive'
      const atContainerBottomWrongState   = !isAtContainerBottom ? 'active' : 'inactive'
      this.classReplace('at-container-bottom-'+atContainerBottomWrongState,'at-container-bottom-'+atContainerBottomRightState)
    }

    if(this.atContainerBottom){
      this.top += containerR.bottom - rect.height - offset
    }

    this.top  += 'px'
    this.left += 'px'

    // IF FIXED CHANGED
    if(this.landmark.isEnabled != isFixed) {
      if(!isFixed) this.landmark.update()
      this.landmark.display(isFixed)
      // SET FIXED OR NOT CLASSES
      const fixedRightState   =  isFixed ? 'active' : 'inactive'
      const fixedWrongState   = !isFixed ? 'active' : 'inactive'
      this.classReplace('fixed-element-'+fixedWrongState,'fixed-element-'+fixedRightState)
    }

    this.fix(isFixed)

  }

}



class Landmark extends Box{

  constructor(target){
    super(document.createElement('div'))
    this.target = target
    this.parent = target.dom.parentNode
    this.update()
    this.dom.classList.add('fixed-landmark')
    this.parent.insertBefore(this.dom, this.target.dom)
    this.isEnabled = false
    this.display(false)
  }

  display(value){
    this.isEnabled        = value
    this.dom.style.position = value ? 'relative' : 'absolute';
  }

  reset(){
    this.dom.removeAttribute('style')
  }

  update(){
    const styles = this.target.styles()
    this.dom.style.width  = `${this.target.rect().width}px`;
    this.dom.style.height = `${this.target.rect().height}px`;
    ['marginTop','marginBottom','marginLeft','marginRight']
      .forEach(
        attr=> this.dom.style[attr] = styles[attr]
      )
  }

}
