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
      var trh = this.thead.getElementsByTagName('TR')[0];
      var firstTds;
      var firstThs;

      if (firstRow && trh) {
        firstTds = firstRow.getElementsByTagName('TD');
        firstThs = trh.getElementsByTagName('TH');

        [].forEach.call(firstTds, function (td) {
          td.style.width = td.offsetWidth + 'px';
        });

        [].forEach.call(firstThs, function (th) {
          th.style.width = th.offsetWidth + 'px';
        });
      }
    },
    eventListener: function eventListener () {
      var offsetTop = getOffset(this.thead, 'offsetTop');
      var offsetLeft = getOffset(this.thead, 'offsetLeft');
      var classes = this.thead.className.split(' ');

      if (this.stick !== true) {
        if (offsetTop - window.scrollY < 0) {
          this.stick = true;
          this.treshold = offsetTop;
          this.setWidth();
          this.thead.style.left = offsetLeft + 'px';
          this.thead.style.top = 0;
          setTimeout(function () {
            classes.push('lr-sticky-header');
            this.thead.style.position = 'fixed';
            this.thead.className = classes.join(' ');
          }.bind(this), 0)
        }
      }

      if (this.stick === true) {
        if (this.treshold - window.scrollY > 0) {
          this.stick = false;
          this.thead.style.position = 'initial';
          classes.splice(classes.indexOf('lr-sticky-header'), 1);
          this.thead.className = (classes).join(' ');
        }
      }
    }
  };

  return function lrStickyHeader (tableElement) {
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
      thead: {
        get: function () {
          return thead;
        }
      },
      tbody: {
        get: function () {
          return tbody;
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

