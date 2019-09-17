class NewsSlider {
  constructor(params) {
    this.slider = params.slider || null;
    this.slides = [];
    this.sliderBody = this.slider.firstElementChild.firstElementChild;   
    this.numberOfCurrentCard = 0;

    this.controls = {
      prev: null,
      next: null,        
    };
    
    this.length = {
      cardLength:  0,        
      totalSliderLength: 0,
      minLeftLength: 0,
      transformLength: 0, 
      margin: 0,         
    }

    this.getSlideSises(); 
    this.prepareSlides();
    this.prepareControls();      
    this.reset();
  }

  getSlideSises() {      
    const slide = this.slider.querySelector('.slide')  
    this.length.minLeftLength = parseInt(getComputedStyle(this.sliderBody).width);
    let margin =  parseInt(getComputedStyle(slide)['margin-right']);
    this.length.cardLength = parseInt(getComputedStyle(slide).width) + margin; 
    this.length.margin = margin;
  }    
  
  getNumberOfCurrentCard() {
    this.numberOfCurrentCard = Math.floor(this.length.transformLength/this.length.cardLength +1);  
  }  

  prepareSlides() {        
    if (this.slider) {
      const slides = this.slider.querySelectorAll('.slide');        
      for (let i = 0; i < slides.length; i += 1) {
        this.slides.push(slides[i]);          
      }          
    }       
    this.length.totalSliderLength = this.length.cardLength * this.slides.length; 
    this.length.transformLength = 0;
  }
   
  prepareControls() {
    if (this.slider) {
      this.controls.next = this.slider.querySelector('.control.next');
      this.controls.prev = this.slider.querySelector('.control.prev');
      
      if (this.controls.next) {
        this.controls.next.addEventListener('click', () => {this.slideNext()});          
      }

      if (this.controls.prev) {
        this.controls.prev.addEventListener('click', () => this.slidePrev());        
      }
    }
  }

  reset() {
    this.length.transformLength = 0;
    this.sliderBody.style.transform=`translateX(0px)`; 
    this.sliderBody.style.transition="transform 1s";
    this.numberOfCurrentCard = 0;
  }

  slide(params, noAnimate) {      
    if(noAnimate === true) {    
      this.sliderBody.style.transition="transform 0s";
    }  else {
      this.sliderBody.style.transition="transform 1s";
    }
    this.sliderBody.style.transform=`translateX(${params}px)`;  
  }

  slideNext() {
    this.length.transformLength += this.length.cardLength;    
     
    if( this.length.minLeftLength <= (this.length.totalSliderLength - this.length.transformLength) ) {      
      this.slide(-this.length.transformLength, false);       
      this.numberOfCurrentCard = Math.floor(this.length.transformLength / this.length.cardLength);
    } else {     
      this.reset();
    }
  }

  slidePrev() {
    this.length.transformLength -= this.length.cardLength;     
    if(this.length.transformLength < 0) {  
      this.length.transformLength = 0;  
    } else {
      this.slide(-this.length.transformLength, false);    
      this.numberOfCurrentCard = Math.floor(this.length.transformLength / this.length.cardLength);   
    } 
  }   

  resizeSlides() {  
    this.getSlideSises();   
    
    this.length.totalSliderLength = this.length.cardLength * this.slides.length;
    this.length.transformLength = this.length.cardLength * this.numberOfCurrentCard;
    const noAnimate = true;
    this.slide(-this.length.transformLength, noAnimate);

    if (this.length.minLeftLength >= this.length.totalSliderLength - this.length.transformLength) { 
      this.length.transformLength = this.length.totalSliderLength - this.length.minLeftLength - this.length.margin;
      this.slide(-this.length.transformLength, noAnimate);
    }
  }
}


if (document.querySelector('#sliderNews')) {  
 
  const nn = new NewsSlider({ 
    slider: document.querySelector('#sliderNews')     
  });   

  const addEventResize = (object, type, callback) => {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
    } else {
      object["on"+type] = callback;
    }
  };       
  addEventResize(window, "resize", getNewSizes);  

  function getNewSizes() {       
    nn.resizeSlides();
  }
}

