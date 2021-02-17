/*
 1. Cyrus add size value validation function: shoud accept numbers (0-9) + (dp, %, px)
 
 2. Cyrus add "separatorSize" property, should affect top of the list item (button)
    and should use validation function implemented in step 1
    
 3. Hannibal change validation in dropDownWidth setter to use validation function implemented in step 1
 
 4. Alexander add "defaultUnits" property with only following values allowed: (dp, %, px)
 
 5. Alexander create function that will convert _dropDownWidth to appropriate value if _dropDownWidth has Number value
    This function has to take into consideration "defaultUnits" property value during Number -> Size value conversion
    
 6. Hannibal add "listItemSkin" property and use it for list items (buttons)
 
 7. Hannibal if there is nothing to show - then skip showing menu (backdrop...)
 
 8. Hannibal Integrate changes into component made by Alexander and Cyrus and
    share final component with all team members
*/

define(function() {
  var _isBackVisible = true;
  var _isDropVisible = true;
  var _destroyPreviousFormOnBack = true;
  var _dropDownList = [];
  var _dropDownWidth = "350dp";
  var _flexBackdrop = null;
  
  var DEFAULT_OFFSET = "20dp";
  var BACKDROP_ZINDEX = 1000;
  
  var updateHeaderPosition = function () {
    var leftOffset = this.view.btnBack.isVisible ? this.view.btnBack.width : DEFAULT_OFFSET;
    var rightOffset = this.view.btnDrop.isVisible ? this.view.btnDrop.width : DEFAULT_OFFSET;
    
    this.view.lblCaption.left = leftOffset;
    this.view.lblCaption.right = rightOffset;
  }
  
  var showPreviousForm = function() {
    if (this.onBackClicked) {
      if (!this.onBackClicked()) {
        return;
      }
    }
    
    var currentForm = kony.application.getCurrentForm();
    var previousForm = kony.application.getPreviousForm();

    if (currentForm && previousForm) {
      (new kony.mvc.Navigation(previousForm.id)).navigate();

      if (_destroyPreviousFormOnBack) {
        kony.application.destroyForm(currentForm.id);
      }
    }
  };
  
  var showDropDown = function () {
    var form = kony.application.getCurrentForm();
    
    hideDropDown();

    _flexBackdrop = new kony.ui.FlexContainer({
      id: "flxHeaderControlBackdrop",
      top: "0dp",
      left: "0dp",
      right: "0dp",
      bottom: "0dp",
      zIndex: BACKDROP_ZINDEX,
      isVisible: true,
      onClick: hideDropDown,
      layoutType: kony.flex.FREE_FORM
    });

    var flexScroll = new kony.ui.FlexScrollContainer({
      id: "flxHeaderControlScrollList",
      top: this.view.height,
      width: _dropDownWidth,
      right: "0dp",
      bottom: "0dp",
      isVisible: true,
      enableScrolling: true,
      scrollDirection: kony.flex.SCROLL_VERTICAL,
      bounces: false,
      onClick: hideDropDown,
      layoutType: kony.flex.FLOW_VERTICAL
    }, {
      padding: [0, 0, 0, 0],
      margin: [0, 0, 0, 0]
    });


    for (var i = 0; i < _dropDownList.length; i++) {
      var button = new kony.ui.Button({
        id: "flxHeaderControlListItem" + i,
        top: "1dp",
        left: "0dp",
        width: "100%",
        height: kony.flex.USE_PREFERRED_SIZE,
        isVisible: true,
        text: _dropDownList[i].name,
        onClick: function(data){ 
          if (this.onListItemClicked) {
            this.onListItemClicked(data);
          }
          hideDropDown();
        }.bind(this, _dropDownList[i])
      }, {
        padding: [0, 0, 0, 0],
        margin: [0, 0, 0, 0]
      });

      flexScroll.add(button);
    }

    _flexBackdrop.add(flexScroll);
    form.add(_flexBackdrop);
  };
  
  var hideDropDown = function () {
    var form = kony.application.getCurrentForm();
    
    if (_flexBackdrop) {
      form.remove(_flexBackdrop);
      _flexBackdrop = null;
    }
  };
  
  var toggleDropdown = function() {
    if (this.onDropClicked) {
      if (!this.onDropClicked()) {
        return;
      }
    }
    
    if (_flexBackdrop) {
      hideDropDown();
    } else {
      showDropDown();
    }
  };
  
  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      updateHeaderPosition = updateHeaderPosition.bind(this);
      hideDropDown = hideDropDown.bind(this);
      showDropDown = showDropDown.bind(this);
      
      this.view.btnBack.onClick = showPreviousForm.bind(this);
      this.view.btnDrop.onClick = toggleDropdown.bind(this);
    },
    
    initGettersSetters: function() {
      defineGetter(this, "isBackVisible", function() {
        return _isBackVisible;
      });

      defineSetter(this, "isBackVisible", function(val) {
        _isBackVisible = !!val;
        
        this.view.btnBack.isVisible = _isBackVisible;
        updateHeaderPosition();
      });
      
      defineGetter(this, "isDropVisible", function() {
        return _isDropVisible;
      });

      defineSetter(this, "isDropVisible", function(val) {
        _isDropVisible = !!val;
        
        this.view.btnDrop.isVisible = _isDropVisible;
        updateHeaderPosition();
      });
      
      defineGetter(this, "destroyPreviousFormOnBack", function() {
        return _destroyPreviousFormOnBack;
      });

      defineSetter(this, "destroyPreviousFormOnBack", function(val) {
        _destroyPreviousFormOnBack = !!val;
      });
      
      defineGetter(this, "dropDownList", function() {
        return _dropDownList;
      });

      defineSetter(this, "dropDownList", function(val) {
        if (!val || !Array.isArray(val)) {
          throw new Error("dropDownList property has to be of Array type.");
        }
        
        for (var i = 0; i < val.length; i++) {
          if (typeof val[i].id === "undefined"
              || typeof val[i].name === "undefined"
              || val[i].id === null
              || val[i].name === null) {
            throw new Error("Each dropDownList item has to have at least 'id' and 'name' properties set.");
          }
        }
        
        _dropDownList = val;
      });
      
      defineGetter(this, "dropDownWidth", function() {
        return _dropDownWidth;
      });
      
      defineSetter(this, "dropDownWidth", function(val) {
        //0-9, 0-9dp, 0-100%, 0-9px
        if (!(typeof val === "string" && val.trim().length > 0 || Number.isSafeInteger(val))) {
			throw new Error("dropDownWidth has to be of valid size value.");
        }
        
        _dropDownWidth = val;
      });
    }
  };
});