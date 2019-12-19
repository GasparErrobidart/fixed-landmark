// =================================================================
/** Class that adds a placeholder for fixed elements */
// =================================================================


class Landmark extends Box{

  constructor(target){
    super(document.createElement('div'))
    this.target = target
    this.parent = target.dom.parentNode
    this.update()
    this.dom.classList.add('fixed-landmark')
    // INSERT BEFORE
    this.parent.insertBefore(this.dom, this.target.dom)
    // INSERT AFTER
    // this.parent.insertBefore(this.dom, this.target.dom.nextSibling)
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
