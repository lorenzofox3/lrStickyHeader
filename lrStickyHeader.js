(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (global['lrStickyHeader'] = factory(global));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(global);
  } else {
    global['lrStickyHeader'] = factory(global);
  }
})(window, function factory (window) {
  'use strict';
  function getOffset (element, property) {
    var offset = element[property];
    var parent = element;
    while ((parent = parent.offsetParent) !== null) {
      offset += parent[property];
    }
    return offset;
  }

  var sticky = {
    //todo some memoize stuff
    setWidth: function setWidth () {
      var firstRow = this.tbody.getElementsByTagName('TR')[0];
      var trLength = this.thead.getElementsByTagName('TR').length;
      var trCollection=[];
      for(var i=0; i<trLength; i++){
        trCollection[i]=this.thead.getElementsByTagName('TR')[i];
      }
      var firstTds;

      function setCellWidth (cell) {
        cell.style.width = cell.offsetWidth + 'px';
      }

      if (firstRow) {
        firstTds = firstRow.getElementsByTagName('TD');
        var trTdCollection = [];
        for(var j=0; j<trCollection.length; j++){
          //to check the length of the TD and TH length 
          var elementByTD = trCollection[j].getElementsByTagName('TD'); 
          var elementByTH = trCollection[j].getElementsByTagName('TH');
          if(elementByTD.length>0){
            trTdCollection[j]=trCollection[j].getElementsByTagName('TD');
          }else if(elementByTH.length>0){
            trTdCollection[j]=trCollection[j].getElementsByTagName('TH');
          }
        }

        [].forEach.call(firstTds, setCellWidth);
        for(var k=0;k<trTdCollection.length;k++){
           [].forEach.call(trTdCollection[k], setCellWidth);
        }
      }
    },
    eventListener: function eventListener () {
      var offsetTop = getOffset(this.thead, 'offsetTop') - Number(this.headerHeight);
      var offsetLeft = getOffset(this.thead, 'offsetLeft');
      var classes = this.thead.className.split(' ');
      //below line will support for multiple browsers
      var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      
      if (this.stick !== true && (offsetTop - scrollPosition < 0)) {
        this.stick = true;
        this.treshold = offsetTop;
        this.setWidth();
        this.thead.style.left = offsetLeft + 'px';
        this.thead.style.top = Number(this.headerHeight) + 'px';
        this.tbody.className = this.tBodyCls;
        setTimeout(function () {
          classes.push('lr-sticky-header');
          this.thead.style.position = 'fixed';
          this.thead.className = classes.join(' ');
        }.bind(this), 0);
      }

      if (this.stick === true && (this.treshold - scrollPosition > 0)) {
        this.stick = false;
        this.tbody.className = '';
        this.thead.style.position = 'static';
        classes.splice(classes.indexOf('lr-sticky-header'), 1);
        this.thead.className = (classes).join(' ');
      }
    }
  };

  return function lrStickyHeader (tableElement, options) {
    var headerHeight = 0;
    var tBodyCls = '';
    if (options&&options.headerHeight)
      headerHeight=options.headerHeight;
    
    if (options&&options.tBodyCls)
      tBodyCls = options.tBodyCls;

    var thead;
    var tbody;

    if (tableElement.tagName !== 'TABLE') {
      throw new Error('lrStickyHeader only works on table element');
    }
    tbody = tableElement.getElementsByTagName('TBODY');
    thead = tableElement.getElementsByTagName('THEAD');

    if (!thead.length) {
      throw new Error('could not find the thead group element');
    }

    if (!tbody.length) {
      throw new Error('could not find the tbody group element');
    }

    thead = thead[0];
    tbody = tbody[0];


    var stickyTable = Object.create(sticky, {
      element: {value: tableElement},
      headerHeight: {
        get: function () {
          return headerHeight;
        }
      },
      thead: {
        get: function () {
          return thead;
        }
      },
      tbody: {
        get: function () {
          return tbody;
        }
      },
      tBodyCls: {
        get: function() {
          return tBodyCls;
        }
      }
    });

    var listener = stickyTable.eventListener.bind(stickyTable);
    window.addEventListener('scroll', listener);
    stickyTable.clean = function clean () {
      window.removeEventListener('scroll', listener);
    };

    return stickyTable;
  };
});

