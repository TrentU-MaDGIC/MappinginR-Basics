---
layout: default
title: Mapping
nav_order: 5
---

# Mapping
Using the built-in `plot()` function is ok, but we can do more with the package tmap. It is similar syntax to `ggplot2`.
The core of tmap is `tm_shape()`, followed by some specification for the `tm_shape()`
Once again, you can use `?tmshape` to open the R documentation in the “Help” pane.
```r
?tm_shape
```
Like ggplot, we can add multiple layers to single input.

```r
#Add City of Peterborough boundary and fill() it in
tm_shape(Ptbo) +
  tm_fill()

#Line data use tm_lines(), and point data can use tm_symbols() or tm_dots()
roads = read_sf("Road.shp")
tm_shape(Ptbo) +
  tm_fill() +
  tm_shape(roads)+
  tm_lines()
```
![Peterborough Road Lines](../assets/images/ptbo_lines)
```
#Add Hamilton boundaries with fill() and borders()
tm_shape(Hamilton) +
  tm_fill() +
  tm_borders()

#Alternatively, this works the same
tm_shape(Hamilton)+
  tm_polygons()
```
![Hamilton Boundaries](../assets/images/hamilton_bound)
```r
#We showed a raster using plotRGB quite simply:
#plotRGB(trent, r='red',g='green',b='blue',stretch='lin')
#Note the stretch argument. These data (trent) are min:0, max:6066
#but tm expects integers (0-255)
#We can stretch the data with terra:
trent_s <- terra::stretch(trent, minv = 0, maxv = 255, minq = 0.2, maxq = 0.98)

#Add raster data
tm_shape(trent_s)+
  tm_rgb()
```
![Trent Raster](../assets/images/trent_raster)

While you can specify multiple `tm_shapes()` in a single map, maps can be stored as objects with tmap. This would allow you to 'save' a particular map view for later display or as part of another map or figure. 
When you add layers together, you add them on top of the previous layer (so the drawing order goes: `tm_shape(bottom) + tm_shape(top)`. Remember this when you are adding multiple layers as overlapping layers can hide data!
The first `tm_shape()` dictates the area that the map will focus on (and zoom and pan to).

```r
Map1 = tm_shape(Ptbo)+tm_polygons()
Map2 = Map1 + tm_shape(CT)+tm_symbols()
Map3 = Map2 + tm_shape(WQgeo)+tm_dots()
Map3
#This is functionally the same as
Map4 = tm_shape(Ptbo)+tm_polygons() + tm_shape(CT)+tm_symbols() + tm_shape(WQgeo)+tm_dots()
Map4
```
![Tm Shape 1](../assets/images/tm_shape1)
```r
#but not the same as
Map5 = tm_shape(CT)+tm_symbols() + tm_shape(WQgeo)+tm_dots() + tm_shape(Ptbo)+tm_polygons()
Map5
```
![Tm Shape 2](../assets/images/tm_shape2)

Similar to ggplot, we have to specify different colours, fill types, and symbols than the defaults. Unlike ggplot, there is not an `aes()` function for this. Symbolizing is contained within the `tm_*()` object after `tm_shape()`. 

```r
MapBounds = tm_shape(ShpNeighbours)+tm_polygons(fill='white', fill_alpha=0.6)
#fill_alpha specifies transparency
MapPtbo = MapBounds + tm_shape(Ptbo)+tm_polygons(fill='black',fill_alpha=0.6)
MapPtboCT = MapPtbo + tm_shape(CT)+tm_symbols(fill='red')
MapPtboWQ = MapPtbo + tm_shape(WQgeo)+tm_symbols(col='blue',shape=2)
#tmap_arrange allows us to display multiple maps in one viewer in R:
tmap_arrange(MapPtbo,MapPtboCT,MapPtboWQ)
```
![Tm Arranged](../assets/images/tm_arrange)

You may notice that the 'zoom' level of the last map isn't great. If you want to focus on a particular subject, you can specify that layer first, or use an expanded inner margin.
There is also the option to use an interactive 'view' mode. Note that some tmap functions do not work in 'view' and only work in 'plot' mode. For this reason, it is best to use this option for data exploration and not map outputs.

```r
tmap_mode("plot")
MapWQ = tm_shape(WQgeo)+tm_symbols(col='blue',shape=2)
MapWQPtbo = MapWQ +  tm_shape(Ptbo)+tm_polygons(fill='black',fill_alpha=0.6)
MapWQPtbo
#Still too zoomed in

#You can change to an interactive map with 'view' mode
tmap_mode("view")
MapWQPtbo
```
Check the viewer and look at the basemap.
Back to the plotting mode - setting `tmap_design_mode()` to **TRUE** enables you to see how the map layout is being interpreted by tmap. This can be useful to see where certain objects will be and how much you may want to move certain map elements. 

Most elements of the map that don't have to do with the data are handled by `tm_layout()`. It is here that we can set a zoom by enhancing the margin around our data and changing the dimensions of the map output

```r
#Back to plot mode
tmap_mode("plot")
#Use design mode to see the 'innner workings' of tmap plot
tmap_design_mode(TRUE)

#asp changes aspect: 1 is a square. Default is minimum bounding box around data. 
#inner.margins() changes margins inside map. outer.margins() is for elements outside map area.
MapWQPtboz = tm_shape(WQgeo)+tm_symbols(fill='DOp')+
  tm_shape(Ptbo)+tm_borders()+
  tm_layout(asp=1, inner.margins=c(2,2,2,2))
#Check the viewer
MapWQPtboz
tmap_design_mode(FALSE)
MapWQPtboz
```
![Map WQ](../assets/images/MapWQPtboz)

You can add a basemap if you want to visualize some extra data. Many options are available (see help)

```r
MapPtboCTb = MapPtboCT + tm_basemap('OpenStreetMap') 
MapPtboCTb
```

![Map PtboCTb](../assets/images/MapPtboCTb)


