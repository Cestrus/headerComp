define({ 
  onInit: function() {
    this.view.cmpHeader.onBackClicked = function () {
      alert('On Back clicked.\nI\'m going to use default implementation.\nReturning true');
      return true;
    };
  }
});