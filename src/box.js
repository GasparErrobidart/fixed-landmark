// =================================================================
/** Class abstracting DOM elements for its manipulation. */
// =================================================================

class Box{

  /**
   * Create a Box.
   * @param {DOMElement} element
   */

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
