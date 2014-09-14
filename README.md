leaflet.labelOverlay
====================

Static labels on features

Finding the center to place a label on a polygon, as it turns out, is hard, not just hard, but really really hard, as in it is only theorized, and not yet solved.
"Why?" you may ask.
A polygon can be whatever shape the creator of it wants.
leaflet.labelOverlay tries to lesson the burden by putting the label in it's most "centroid-ish" area.


Example:
```javascript
var options = {},
	labelOverlay = new L.LabelOverlay(layer, "Hello, I'm a label overlay", options);
map.addLayer(labelOverlay);
```

Options:
```
{
	offset: null,
	cssClass: 'leaflet-label-overlay'
}
```