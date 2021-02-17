define({ 
  onInit: function () {
	this.view.btnSwitchBack.onClick = function () {
      this.view.cmpHeader.isBackVisible = !this.view.cmpHeader.isBackVisible;
    }.bind(this);
    
	this.view.btnSwitchDrop.onClick = function () {
      this.view.cmpHeader.isDropVisible = !this.view.cmpHeader.isDropVisible;
    }.bind(this);
    
    this.view.txtHeader.onTextChange = function () {
      this.view.cmpHeader.text = this.view.txtHeader.text;
    }.bind(this);
    
	this.view.btnShowNewForm.onClick = function () {
      (new kony.mvc.Navigation("Form2")).navigate();
    }.bind(this);
    
    this.view.cmpHeader.onBackClicked = function () {
      alert('On Back clicked.\nI\'m completely overriding default implementation.\nReturning nothing');
    }.bind(this);
    
    this.view.cmpHeader.onDropClicked = function () {
      try {
        this.view.cmpHeader.dropDownList = JSON.parse(this.view.txtListItems.text);
        return true;
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }.bind(this);
    
    this.view.cmpHeader.onListItemClicked = function (data) {
      alert("On item clicked: " + JSON.stringify(data));
    }.bind(this);
  }
});