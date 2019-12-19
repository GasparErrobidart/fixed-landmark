
// =================================================================
/** Class that adds 'stickiness' behaviour to dom elements
  * within a contaienr. */
// =================================================================


class FixedElement extends Box{

  constructor(options){
    const {
      element,
      container,
      offsetValue,
      offsetElement,
      offsetFunction,
      dockTo                 = 'top',
      performancePriority    = true
    } = options
    super(element)
    this.container           = new Container(container)
    this.landmark            = new Landmark(this)
    this.offsetValue         = offsetValue || 0
    this.offsetElement       = offsetElement
    this.offsetFunction      = offsetFunction
    this.isFixed             = false
    this.performancePriority = performancePriority
    this.dockTo              = dockTo
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
      if(this.dockTo && this.dockTo != 'none' ){
        this.position( this.atContainerBottom ? 'absolute' : 'fixed')
        this.positionMargins(this)
      }
    }else{
      if(this.dockTo && this.dockTo != 'none'){
        this.position(this.defaultPosition)
        this.positionMargins(this.defaultPositionMargins)
      }
      this.dom.style.width = this.defaultWidth
    }
  }




  update(ev){
    const rect        = this.rect()
    const landmarkR   = this.landmark.rect()
    const containerR  = this.container.rect()
    const offset      = this.offset()
    const isFixed     = landmarkR.top <= 0 + offset
    const isAtContainerBottom = containerR.bottom <= 0 ||  containerR.bottom <= rect.bottom + offset
    console.log(containerR.bottom, '<=', rect.bottom , '+', offset)
    this.top          = offset
    this.left         = containerR.left

    // IF AT CONTAINER BOTTOM STATE CHANGED
    if(isAtContainerBottom != this.atContainerBottom){
      this.atContainerBottom = isAtContainerBottom
      const atContainerBottomRightState   =  isAtContainerBottom ? 'active' : 'inactive'
      const atContainerBottomWrongState   = !isAtContainerBottom ? 'active' : 'inactive'
      this.classReplace('at-container-bottom-'+atContainerBottomWrongState,'at-container-bottom-'+atContainerBottomRightState)

    }

    if(isAtContainerBottom){
      this.top += containerR.height - rect.height - offset
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
