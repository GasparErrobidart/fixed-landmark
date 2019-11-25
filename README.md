# Fixed Landmark
A library for fixing elements within a container.

[LIVE DEMO](https://codepen.io/gasparerr/pen/GRRLYwp?editors=1010)

## Example initialization
```javascript
window.addEventListener("load",function(){

  // EXAMPLE 1 - FIX AN ELEMENT TO A CONTAINER
  new FixedElement({
    element   : "#fixed-element-1",
    container : "#container-1"
  });

  // EXAMPLE 2 - FIX ELEMENT TO BODY
  new FixedElement({
    element   : 'nav',
    container : 'body'
  });


  new FixedElement({
    // AVAILABLE OPTIONS

    // element : String selector | DOMElement
    // container : String selector | DOMElement
    // offsetElement : String selector | DOMElement
    // offsetValue : int
    // offsetFunction : function
    // - Parameter: this
    // - Parameter: int offset
    // - Expected return value: int

  });

});
```
