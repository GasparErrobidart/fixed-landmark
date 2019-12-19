// =================================================================
/** Class abstracting DOM elements for its manipulation. */
// =================================================================



class Container extends Box{

  constructor(element){
    super(element)
    this.dom.style.position = 'relative'
  }

}
