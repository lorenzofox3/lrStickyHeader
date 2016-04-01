# lrStickyHeader

make table headers sticky, example for [React CRM](http://reactcrm.com/)

![stStickeyHeader](http://i.imgur.com/ocN250H.gif)

[live demo](http://lorenzofox3.github.io/lrStickyHeader/example.html)

* (almost)no css to add 
* no dependency
* does not add any other element to the markup
* ~ 100 loc

## install 

``bower install lr-sticky-header``

``npm install lr-sticky-header``

## dependencies 

None

## usage

```Javascript
var tableElement = document.getElementById('table');

var stickyTable = lrStickyHeader(tableElement);
```

### style

You'll need your table element and its children to have the property ``box-sizing`` set to ``border-box`` (it is the default of many css framework such bootstrap

when the header is sticked the class name ``lr-sticky-header`` is added to the thead element if you want to add some more style

### api

*  **setWidth()** : if you want to call manually the resize of the column (within a resize event handler for example)
*  **clean()** ~: to detach the scroll event handler from the window

### example of a directive with [smart-table](http://lorenzofox3.github.io/smart-table-website/)

```javascript
  angular.directive('stStickyHeader', ['$window', function ($window) {
    return {
      require: '^?stTable',
      link: function (scope, element, attr, ctrl) {      
        //used settimeout such that it will support for mulitple smart tables it will wait until it finds element[0].
        //this is optional attributes which can be used for specific height and class{headerHeight: attr.stStickyHeaderTop,tBodyCls: attr.stStickyHeaderTbodyClass } 
        setTimeout(function () {
        var stickyHeader = lrStickyHeader(element[0], {headerHeight: attr.stStickyHeaderTop,tBodyCls: attr.stStickyHeaderTbodyClass });
            scope.$on('$destroy', function () {
            stickyHeader.clean();
            });
        },10);

        scope.$watch(function () {
          return ctrl.tableState();
        }, function () {
          $window.scrollTo(0, lrStickyHeader.treshold);
        }, true)
         
         // The below code is a fix for resize window in all browsers
         angular.element($window).on("resize", function(){
            //stickyHeader.clean();
            angular.element(element[0]).find('thead').removeAttr('style');
            angular.element(element[0]).find('thead').removeClass('lr-sticky-header');
            $window.scrollTo(0, lrStickyHeader.treshold);
              var stickyHeader = lrStickyHeader(element[0], {headerHeight: attr.stStickyHeaderTop,tBodyCls: attr.stStickyHeaderTbodyClass });
         });
      }
    }
  }]);
```




