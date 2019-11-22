class Box{

  constructor(element){
    if(typeof element == "string"){
      this.dom = document.querySelector(element)
    }else if(typeof element == "object"){
      this.dom = element
    }
    if(!this.dom) console.error(`Element (${element}) wasn't found.`)
  }

  rect(){
    return this.dom.getBoundingClientRect()
  }

  styles(){
    return this.dom.currentStyle || window.getComputedStyle(this.dom)
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
    const height          = this.target.rect().height
    this.isEnabled        = value
    if(this.isEnabled){
      this.dom.classList.add('fixed-landmark-active')
      this.dom.classList.remove('fixed-landmark-inactive')
    }else{
      this.dom.classList.add('fixed-landmark-inactive')
      this.dom.classList.remove('fixed-landmark-active')
    }
    this.dom.style.height = value ? height+'px' : '0px'
  }

  update(){
    this.dom.style.width  = `${this.target.rect().width}px`;
    this.dom.style.height = `${this.target.rect().height}px`;
    ['marginTop','marginBottom','marginLeft','marginRight']
      .forEach(
        attr=> this.dom.style[attr] = this.target.dom.style[attr]
      )
  }

}


class Container extends Box{

  constructor(element){
    super(element)
  }

}


class FixedElement extends Box{

  constructor(options){
    const {element, container, offsetValue, offsetElement, offsetFunction} = options
    super(element)
    this.container                  = new Container(container)
    this.landmark                   = new Landmark(this)
    this.offsetValue                = offsetValue || 0
    this.offsetElement              = offsetElement
    this.offsetFunction             = offsetFunction
    this.isFixed                    = false
    this.defaultPosition            = this.position()
    this.defaultWidth               = this.styles().defaultWidth
    this.defaultPositionMargins     = {
                                        top   : this.styles().top,
                                        right : this.styles().right,
                                        bottom: this.styles().bottom,
                                        left  : this.styles().left
                                      }
    window.addEventListener('scroll',this.update.bind(this))
    window.addEventListener('resize',()=>{
      this.reset()
      this.update()
    })
    this.update()
  }

  reset(){
    this.dom.removeAttribute('style')
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
      this.dom.classList.remove("fixed-element-inactive")
      this.dom.classList.add("fixed-element-active")
    }else{
      this.position(this.defaultPosition)
      this.positionMargins(this.defaultPositionMargins)
      this.dom.style.width = this.defaultWidth
      this.dom.classList.remove("fixed-element-active")
      this.dom.classList.add("fixed-element-inactive")
    }
  }


  update(ev){
    const rect        = this.rect()
    const landmarkR   = this.landmark.rect()
    const containerR  = this.container.rect()
    const offset      = this.offset()
    const isFixed     = landmarkR.top <= 0 + offset
    this.top          = offset
    this.left         = containerR.left
    if(containerR.bottom <= rect.height + offset){
      this.top += containerR.bottom - rect.height - offset
    }
    this.top  += 'px'
    this.left += 'px'
    if(this.landmark.isEnabled != isFixed) this.landmark.display(isFixed)
    this.fix(isFixed)
  }


}
