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

      function setCellWidth (cell) {
        cell.style.width = cell.offsetWidth + 'px';
      }

      if (firstRow && trh) {
        firstTds = firstRow.getElementsByTagName('TD');
        firstThs = trh.getElementsByTagName('TH');

        [].forEach.call(firstTds, setCellWidth);
        [].forEach.call(firstThs, setCellWidth);
      }
    },
    eventListener: function eventListener () {
      var offsetTop = getOffset(this.thead, 'offsetTop') - Number(this.headerHeight);
      var offsetLeft = getOffset(this.thead, 'offsetLeft');
      var parentOffsetTop = this.parentIsWindow ? 0 : getOffset(this.parent, 'offsetTop');
      var parentScrollTop = this.parentIsWindow ? parent.scrollY : this.parent.scrollTop;
      var classes = this.thead.className.split(' ');

      if (this.stick !== true && (offsetTop - (parentOffsetTop + parentScrollTop) < 0) &&
          (offsetTop + this.tbody.offsetHeight - (parentOffsetTop + parentScrollTop) > 0)) {
        this.stick = true;
        this.treshold = offsetTop;
        this.windowScrollY = this.parentIsWindow ? 0 : window.scrollY;
        this.setWidth();
        this.thead.style.left = offsetLeft + 'px';
        this.thead.style.top = Number(this.headerHeight + parentOffsetTop - this.windowScrollY) + 'px';
        setTimeout(function () {
          classes.push('lr-sticky-header');
          this.thead.style.position = 'fixed';
          this.thead.className = classes.join(' ');
          this.element.style.marginTop = Number(this.thead.offsetHeight) + 'px';
        }.bind(this), 0);
      }

      if (this.stick === true && !this.parentIsWindow && this.windowScrollY !== window.scrollY) {
        this.windowScrollY = window.scrollY;
        this.thead.style.top = Number(this.headerHeight + parentOffsetTop - this.windowScrollY) + 'px';
      }

      if (this.stick === true && (
                 (this.parentIsWindow && (this.treshold - parentScrollTop > 0)) ||
                 (parentScrollTop <= 0))) {
        this.stick = false;
        this.thead.style.position = 'initial';
        classes.splice(classes.indexOf('lr-sticky-header'), 1);
        this.thead.className = (classes).join(' ');
        this.element.style.marginTop = '0';
      }
    }
  };

  return function lrStickyHeader (tableElement, options) {
    var headerHeight = 0;
    if (options&&options.headerHeight)
      headerHeight=options.headerHeight;
    var parent = window;
    if (options && options.parent) {
      parent = options.parent;
    }

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
      parent: {
        get: function () {
          return parent;
        }
      },
      parentIsWindow: {value: parent === window},
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
      }
    });

    var listener = stickyTable.eventListener.bind(stickyTable);
    parent.addEventListener('scroll', listener);
    if (parent !== window) {
      window.addEventListener('scroll', listener);
    }
    stickyTable.clean = function clean () {
      parent.removeEventListener('scroll', listener);
      if (parent !== window) {
        window.removeEventListener('scroll', listener);
      }
    };

    return stickyTable;
  };
});

