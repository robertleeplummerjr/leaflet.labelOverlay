(function(L, poly2tri) {
	L.LabelOverlay = L.Class.extend({
		/**
		 *
		 * @param {L.TileLayer} layer
		 * @param {String} label
		 * @param {Object} [options]
		 */
		initialize: function(layer, label, options) {
			this._layer = layer;
			this._latlng = null;
			this._setCentroidIsh();


			this._label = label;
			L.Util.setOptions(this, options);
			this.triangles = [];
			this.triangle = null;
		},

		options: {
			offset: null,
			cssClass: 'leaflet-label-overlay'
		},

		onAdd: function(map) {
			this._map = map;
			if (!this._container) {
				this._initLayout();
			}
			map.getPanes().overlayPane.appendChild(this._container);
			this._container.innerHTML = this._label;
			map.on('viewreset', this._reset, this);
			this._reset();
		},

		onRemove: function(map) {
			map.getPanes().overlayPane.removeChild(this._container);
			map.off('viewreset', this._reset, this);
		},

		_reset: function() {
			var pos = this._map.latLngToLayerPoint(this._latlng),
				op;

			if (this.options.offset === null) {
				op = new L.Point(pos.x, pos.y);
			}

			else {
				new L.Point(pos.x + this.options.offset.x, pos.y - this.options.offset.y);
			}

			L.DomUtil.setPosition(this._container, op);
		},

		_initLayout: function() {
			this._container = L.DomUtil.create('div', this.options.cssClass);
		},

		_centerOfTriangle: function () {
			var triangle = this.triangle,
				points = triangle.points_;

			return {
				x: (points[0].x + points[1].x + points[2].x) / 3,
				y: (points[0].y + points[1].y + points[2].y) / 3
			};
		},

		_areaOfTriangle: function (triangle) {
			var points = triangle.points_,
				point1 = points[0],
				point2 = points[1],
				point3 = points[2],
				x1 = point1.x,
				x2 = point2.x,
				x3 = point3.x,
				y1 = point1.y,
				y2 = point2.y,
				y3 = point3.y;

			return ((x1 * (y2 - y3)) + (x2 * (y3 - y1)) + (x3 * (y1 - y2))) / 2;
		},
		_largestTriangle: function () {
			var triangles = this.triangles,
				largest = null,
				triangle,
				i = 0;


			for(; i<triangles.length; i++) {
				triangle = triangles[i];
				triangle.area = this._areaOfTriangle(triangle);
				if (largest === null) {
					largest = triangle;
					continue;
				}

				if ( triangle.area > largest.area ) {
					largest = triangle;
				}
			}

			return largest;
		},
		_setCentroidIsh: function () {
			var layer = this._layer,
				latlngs = layer._latlngs,
				length = latlngs.length,
				contour = [],
				latlng,
				i = 0,
				swctx,
				center;

			for (; i < length; i++) {
				latlng = latlngs[i];
				contour.push(new poly2tri.Point(latlng.lat, latlng.lng));
			}

			swctx = new poly2tri.SweepContext(contour);
			swctx.triangulate();

			this.triangles = swctx.getTriangles();
			this.triangle = this._largestTriangle();
			center = this._centerOfTriangle();

			this._latlng = new L.LatLng(center.x, center.y);
		}
	});
})(L, poly2tri);