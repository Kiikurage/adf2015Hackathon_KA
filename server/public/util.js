function inherit(child, parent) {
	var __ = function() {};
	__.prototype = parent.prototype;
	child.prototype = new __();
}

function extend(target, srces) {
	Array.prototype.slice.call(src, 1).forEach(function(src) {
		if (!src) return;
		Object.keys(src).forEach(function(key) {
			target[key] = src[key];
		});
	});
	return target;
}

function noop() {}
