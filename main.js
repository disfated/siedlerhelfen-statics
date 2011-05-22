!function($, window) { try {


var resources = {
	'Wood'           : { tab: 1 },
	'Plank'          : { },
	'Stone'          : { },
	'Fish'           : { },
	'EventResource'  : { name: 'Easter egg' },
	'Coal'           : { tab: 2 },
	'BronzeOre'      : { },
	'Bronze'         : { },
	'Tool'           : { },
	'Water'          : { },
	'Corn'           : { },
	'Beer'           : { },
	'Flour'          : { },
	'Bread'          : { },
	'BronzeSword'    : { },
	'Bow'            : { },
	'RealWood'       : { tab: 3 },
	'RealPlank'      : { },
	'IronOre'        : { },
	'Iron'           : { },
	'Steel'          : { },
	'GoldOre'        : { },
	'Gold'           : { },
	'Coin'           : { },
	'Marble'         : { },
	'Meat'           : { },
	'Sausage'        : { },
	'Horse'          : { },
	'IronSword'      : { },
	'SteelSword'     : { },
	'Longbow'        : { },
	'ExoticWood'     : { tab: 4 },
	'ExoticPlank'    : { },
	'TitaniumOre'    : { },
	'Titanium'       : { },
	'Salpeter'       : { },
	'Gunpowder'      : { },
	'Granite'        : { },
	'Wheel'          : { },
	'Carriage'       : { },
	'TitaniumSword'  : { },
	'Crossbow'       : { },
	'Cannon'         : { },
};

var id, res, tab;
for (id in resources) {
	res = resources[id];
	res.br = (tab && res.tab && res.tab !== tab);
	tab = res.tab || (res.tab = tab || 1);
	res.name || (res.name = id.replace(/([a-z])([A-Z]+)/g, function($0, $1, $2) { return $1 + ' ' + $2.toLowerCase() }));
	res.icon = '/images/' + id.toLowerCase() + '.png';
};



var proviantProducts = {
	'ProductivityBuffLvl1' : {
		name : 'Рыбная тарелка',
		icon : 'sushiplate.png',
		cost : {
			Fish: 10,
		},
	},
	'ProductivityBuffLvl2' : {
		name : 'Бутерброд',
		icon : 'buffcheesesandwich.png',
		cost : {
			Fish: 40,
			Bread: 20,
		},
	},
	'ProductivityBuffLvl3' : {
		name : 'Корзинка',
		icon : 'giftbasket.png',
		cost : {
			Fish: 120,
			Bread: 60,
			Sausage: 20,
		},
	},
	'AddResource_ConvertBeerToPopulation' : {
		name : 'Человеки',
		icon : 'settler.png',
		cost : {
			Bread: 60,
		},
	},
	'FillDeposit_Fishfood' : {
		name : 'Подкормка для рыб',
		icon : 'bufffishfood01.png',
		cost : {
			Bread: 10,
		},
	},
	'FillDeposit_Hunter' : {
		name : 'Подкормка для зверя',
		icon : 'meat.png',
		cost : {
			Water: 20,
			Fish: 30,
		},
	},
};

for (var id in proviantProducts) {
	var proviantProduct = proviantProducts[id];
	proviantProduct.id = id;
	proviantProduct.icon = '/images/' + proviantProduct.icon;
};



$['EventEmitter'] = (function(isArray) {
	
	
	function EventEmitter() {
		this._events = {};
	};
	
	EventEmitter.prototype.emit = function(type) {
		
		var handler = this._events[type];
		if (!handler) return this;
		
		if (typeof handler == 'function') {
			switch (arguments.length) {
				// fast cases
				case 1:
					handler.call(this);
					break;
				case 2:
					handler.call(this, arguments[1]);
					break;
				case 3:
					handler.call(this, arguments[1], arguments[2]);
					break;
				// slower
				default:
					var args = Array.prototype.slice.call(arguments, 1);
					handler.apply(this, args);
			};
		} else if (isArray(handler)) {
			var args = Array.prototype.slice.call(arguments, 1);
			var listeners = handler.slice();
			for (var i = 0, l = listeners.length; i < l; i++) {
				listeners[i].apply(this, args);
			};
		};
		return this;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
		if (typeof type != 'string') {
			throw new Error("addListener() expects 'type' to be String");
		};
		if (typeof listener != 'function') {
			throw new Error("addListener() expects 'listener' to be Function");
		};
		var list = this._events[type];
		if (!list) {
			this._events[type] = listener;
		} else if (isArray(list)) {
			list.push(listener);
		} else {
			this._events[type] = [list, listener];
		};
		return this;
	};
	
	EventEmitter.prototype.once = function(type, listener) {
		var self = this;
		function g() {
			self.removeListener(type, g);
			listener.apply(this, arguments);
		};
		g.listener = listener;
		return self.addListener(type, g);
	};
	
	EventEmitter.prototype.removeListener = function(type, listener) {
		if (typeof type != 'string') {
			throw new Error("removeListener() expects 'type' to be String");
		};
		if (typeof listener != 'function') {
			throw new Error("removeListener() expects 'listener' to be Function");
		};
		var list = this._events[type];
		if (list) {
			if (isArray(list)) {
				var position = -1;
				for (var i = 0, length = list.length; i < length; i++) {
					if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
						position = i;
						break;
					};
				};
				if (position >= 0) {
					list.splice(position, 1);
					if (list.length == 0) {
						delete this._events[type];
					};
				};
			} else if (list === listener || (list.listener && list.listener === listener)) {
				delete this._events[type];
			};
		};
		return this;
	};
	
	EventEmitter.prototype.removeListeners = function(type) {
		if (typeof type != 'string') {
			throw new Error("removeListeners() expects 'type' to be String");
		};
		if (type == '*') {
			this._events = {};
		} else if (this._events[type]) {
			delete this._events[type];
		};
		return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
		if (typeof type != 'string') {
			throw new Error("listeners() expects 'type' to be String");
		};
		var list = this._events[type];
		if (!list) {
			return [];
		} else if (isArray(list)) {
			return list;
		} else {
			return [list];
		};
	};
	
	// sugar
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	EventEmitter.prototype.ls = EventEmitter.prototype.listeners;
	EventEmitter.prototype.rm = function(type, listener) {
		return (typeof listener == 'undefined') ? this.removeListeners(type) : this.removeListener(type, listener);
	};
	
	return EventEmitter;


})(Array.isArray || jQuery.isArray);


var resourcesInfo = $.extend(new $.EventEmitter(), {
	
	_data: null,
	_date: null,
	
	storeName: 'resourcesInfo',
	expire: 3600000, // 1 hour
	url: '/siedler/info.json',
	
	_loading: false,
	
	_expired: function(date) {
		return (Date.now() - this._date) > this.expire;
	},
	
	_reset: function() {
		return this._set(null, null);
	},
	
	_set: function(data, date) {
		this._data = data;
		this._date = date || Date.now();
		return this;
	},
	
	_store: function() {
		if ($.browser.storage) {
			$.storage.set(this.storeName, {
				date : this._date,
				data : this._data
			});
		};
		return this;
	},
	
	_restore: function() {
		if ($.browser.storage) {
			var stored = $.storage.get(this.storeName);
			if (stored) {
				this._set(stored.data, stored.date);
				return true;
			};
		};
		return false;
	},
	
	_unstore: function() {
		$.browser.storage && $.storage.del(this.storeName);
		return this;
	},
	
	get: function() {
		var self = this;
		if (self._data != null) {
			self._expired() ? self._reset().get() : self.emit('get', self._data);
		} else if (self._restore()) {
			self._expired() ? self._unstore()._reset().get() : self.emit('get', self._data);
		} else {
			self.update();
		};
		return self;
	},
	
	update: function() {
		var self = this;
		if (!self._loading) {
			self._loading = true;
			$.getJSON(self.url)
				.success(function(data, status, request) {
					if (data == null) {
						self.emit('error', new Error('Null data'));
					} else {
						self._set(data)._store().emit('update', data);
					};
				})
				.error(function(request, status, error) {
					self.emit('error', error);
				})
				.complete(function() {
					self._loading = false;
				});
		};
		return self;
	}
	
});


Number.prototype.resources = function() {
	return this.valueOf() < 1000 ? this.toString() : this.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, '.');
};

$.browser.storage = 'localStorage' in window && window['localStorage'] !== null;
if ($.browser.storage) {
	$.storage = {
		set : function(key, val) {
			window.localStorage.setItem(key, JSON.stringify(val));
			return this;
		},
		get : function(key, def) {
			var val = window.localStorage.getItem(key);
			return val == null ? def : JSON.parse(val);
		},
		del : function(key) {
			window.localStorage.removeItem(key);
			return this;
		}
	};
};

// Заменяет стандартный select удобной плюшкой с картинками ресурсов
function resourceSelector(elems) {
	
	return $(elems).each(function() {
		
		var $select = $(this), $wrap, $icon, $name, $pane;
		
		var $wrap = $(
			'<div class="select-wrap">' + 
				'<div class="select-selected">' +
					'<img src="" />' +
					'<span></span>' +
				'</div>' +
				'<div class="select-pane"></div>' +
			'</div>'
		);
		$icon = $wrap.find('.select-selected > img');
		$name = $wrap.find('.select-selected > span');
		$pane = $wrap.find('.select-pane');
		
		// заполняем всплывающую панельку картинками ресурсов
		$.each(resources, function(resourceId, resource) {
			if (resource.br) {
				$pane.append('<hr>'); // разделяем ресурсы с разных табов
			};
			$('<img />').prop({
				src: resource.icon,
				title: resource.name
			}).appendTo($pane).click(function() {
				$select.val(resourceId).trigger('change'); // меняем значение в стандартном элементе и дёргаем onchange (см. ниже)
				$pane.hide();
			});
		});
		
		$select.after($wrap).hide().bind('change', function() { // это чтобы из других плюшек можно было делать trigger('change')
			var resource = resources[this.value];
			$icon.prop('src', resource.icon); // меняем иконку на иконку выбранного ресурса
			$name.text(resource.name); // и имя
		}).trigger('change'); // обновляем плюшку текущим значением
		
		$wrap.hover(
			function() { $pane.show(); },
			function() { $pane.hide(); }
		);
	});
	
};

// добавляет на страницу торговли шаблоны
function tradeTemplates() {
	
	if (!$.browser.storage) return false;
	var $form = $('form:first'), form = $form.get(0);
	if (!$form.length) return false;
	var $fields = $form.find('*[name]');
	if (!$fields.length) return false;
	var storeName = 'tradeTemplates';
	var lastUsedName = 'Последний использованный';
	var templates = $.storage.get(storeName, {});
	
	var $select, select, $options = {}, $saveButton, $removeButton, $submitButton, $lastUsed = null;

	var $table = $form.find('table:first');
	if (!$table.length) return false;
	
	var $row = $('<tr />');
	
	$row.append('<td>Шаблон:</td>');
	
	var $select = $('<select />'), select = $select.get(0), $option;
	for (var name in templates) {
		$option = addOption(name, name == lastUsedName);
		if (name == lastUsedName) {
			$lastUsed = $option;
		};
	};
	if ($lastUsed) {
		select.selectedIndex = $lastUsed.prop('index');
	};
	$row.append($('<td />').append($select));
	$select.bind('change', function() {
		if (select.selectedIndex > -1) {
			setTemplate(templates[select.value]);
		};
		availability();
	});
	
	var $td = $('<td />');
	$saveButton = $('<input type="button" value="Сохранить" />').click(function() {
		var name = $form.find('[name=recepient] :selected').text() + ': ' + $form.find('[name=offer_c]').val() + ' ' + resources[$form.find('[name=offer_s]').val()].name + ' / ' + $form.find('[name=cost_c]').val() + ' ' + resources[$form.find('[name=cost_s]').val()].name;
		name = prompt('Наименование шаблона', name);
		if (!name) return;
		templates[name] = getTemplate();
		var $option = $options[name] || addOption(name);
		select.selectedIndex = $option.prop('index');
		update();
		availability();
	}).appendTo($td);
	
	$removeButton = $('<input type="button" value="Удалить" />').click(function() {
		if (select.selectedIndex < 0) return;
		if (!confirm('Подтверждаете удаление "' + select.value + '"?')) return;
		delete templates[select.value];
		removeOption(select.value);
		update();
		availability();
	}).appendTo($td);
	$td.appendTo($row);
	
	$form.bind('submit', function() {
		templates[lastUsedName] = getTemplate();
		update();
		resourcesInfo._reset()._unstore();
	});
	
	$select.trigger('change');
	$table.prepend($row);
	
	return true;


	function addOption(name, prepend) {
		return $options[name] = $('<option>' + name + '</option>')[prepend ? 'prependTo' : 'appendTo']($select);
	};
	
	function removeOption(name) {
		$options[name].remove();
		delete $options[name];
	};
	
	// получает текущие значения полей формы как шаблон { field_name : field_value, ... }
	function getTemplate() {
		var temp = {};
		$fields.each(function() {
			temp[this.name] = this.value;
		});
		return temp;
	};
	
	// устанавливает шаблон в значения полей формы
	function setTemplate(temp) {
		$fields.each(function() {
			if (temp.hasOwnProperty(this.name)) {
				this.value = temp[this.name];
				$(this).trigger('change');
			};
		});
	};
	
	// сохранить текущие шаблоны в хранилище
	function update() {
		$.storage.set(storeName, templates);
	};
	
	// доступность элементов управления
	function availability() {
		$removeButton.prop('disabled', select.selectedIndex == -1);
	};

};


// добавляет на все страницы кнопку показа текущих ресурсов в всплывающем окошке
function globalMenu() {
	
	if (!$('body > h1').length) return;
	return $('<div id="global-menu" />')
		.append(resourcesLink())
		.insertBefore('body > h1');
	
	function resourcesLink() {
		
		var $wrap = $(
			'<span id="global-menu-resources">' +
				'<a href="#resources">Ресурсы</a>' +
				'<div class="res-info-pane">' +
					'<div class="res-info-actions">' +
						'<a href="#refresh">Обновить</a>' +
					'</div>' +
				'</div>' +
			'</span>'
		);
		
		var $pane = $wrap.find('.res-info-pane');
		var $error  = $('<span class="res-info-error" />').hide().appendTo($pane);
		var $loader = $('<span class="loading" />').appendTo($pane);
		var $data = $('<ul class="res-info-res" />').hide().appendTo($pane);
		var $resources = {};
		$.each(resources, function(resourceId, resource) {
			var elem = $((resource.br ? '<hr>' : '') + '<li title="' + resource.name + '"><img src="' + resource.icon + '" /><span>-</span></li>');
			$data.append(elem);
			$resources[resourceId] = elem.find('span');
		});
		var $visible = $loader;
		var loading = true;
		
		resourcesInfo.once('get', render);
		resourcesInfo.on('update', render);
		resourcesInfo.on('error', error);
		
		$wrap.find('a[href="#resources"]').click(function() {
			$pane.fadeToggle(250);
			return false;
		});
		$wrap.find('a[href="#refresh"]').click(function() {
			if (!loading) {
				loader();
				resourcesInfo.update();
			};
			return false;
		});
		
		resourcesInfo.get();
		
		return $wrap;
		
		function swap($elem) {
			$visible.hide();
			$visible = $elem.show();
		};
		
		function error(error) {
			if (loading) {
				swap($error.html('Ошибка:').append($('<pre>').text(error)));
				loading = false;
			};
		};
		
		function render(data) {
			for (var resourceId in $resources) {
				$resources[resourceId].text( (resourceId in data) ? data[resourceId].resources() : '-' );
			};
			swap($data);
			loading = false;
		};
		
		function loader() {
			swap($loader);
			loading = true;
		};
	
	};
	
};



function proviantSliders() {

	$.each(proviantProducts, function(id, product) {
		var $elem = $('[name="' + id + '"]');
		if (!$elem.length) return;
		var $slider = $('<div />').slider({
			disabled: true,
			min: 0,
			max: 0,
			range: 'min',
			value: $elem.val(),
			slide: function(e, ui) {
				$elem.val(ui.value);
			}
		});
		$elem.change(function() {
			$slider.slider('value', this.value);
		});
		$('<td class="proviant-slider-cell" />').insertAfter($elem.closest('td')).append($slider);
		
		function update(res) {
			var max = Infinity;
			$.each(product.cost, function(id, cost) {
				if (res[id] == null) {
					max = null;
					disabled = true;
					return false;
				};
				max = Math.min(max, ~~(res[id] / cost));
			});
			$slider.slider('option', {
				max: max || 0,
				disabled: !!max
			});
		};
		
		resourcesInfo.once('get', update);
		resourcesInfo.on('update', update);
		resourcesInfo.get();
		
	});
	
	$('form').submit(function() {
		resourcesInfo._unstore();
	});
	
};


$(document).ready(function() {
	if (/\/trade$/.test(window.location)) { // we better use <body id="trade-page"> or smth and test it instead
		resourceSelector('#offer_s, #cost_s');
		tradeTemplates();
	} else if (/\/proviant$/.test(window.location)) { // we better use <body id="trade-page"> or smth and test it instead
		proviantSliders();
	};
	globalMenu();
});



} catch (err) {

	if ('console' in window && window.console != null) {
		console.error(err);
	};

};

}(jQuery, window);
