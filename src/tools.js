/**
 * Created by ayou on 18/2/6.
 */

var handlerCache

exports.addHandler = function(element, type, handler) {
  handlerCache = handler
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + type, handler);
  } else {
    element["on" + type] = handler;
  }
}

exports.removeHandler = function (element, type) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handlerCache, false);
  } else if (element.detachEvent) {
    element.detachEvent("on" + type, handlerCache);
  } else {
    element["on" + type] = null;
  }
}

// exports.fireFocusEvent = function (ele) {
//   var event = new FocusEvent()
//   ele.dispatch(event)
// }