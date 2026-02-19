---
layout: default
title: Map Elements
nav_order: 6
---

# Map Elements
Map elements are an important part of any map! They help the viewer understand where the map is and what it is showing. All maps should have a legend, scale, and north arrow or some measure of direction. 
They should also include the name of the author or publisher, the date created, data attributions, and what projection the map is in. 

Let's add each of these to our map. 

## Map Elements: Legend
You may notice that some of our maps had legends and others did not. By default, a legend displays outside the map window and is present when there is more than one value per layer (e.g., you have specified fill to be some variable, not just a single colour). When you use a variable for fill, the legend is specified in the `tm_*()` after `tm_shape()` using `fill.legend = tm_legend()`. If you want to add a legend to a map with only constants, you must use `tm_add_legend()`

We can change the location of a legend using `tm_pos_out(` or `tm_pos_in()` (specified within tm_legend())to put the legend inside or outside the map. tm_pos_in/out can take two arguments, first the horizontal position ("left", "right", "center") and second the vertical positionn("top", "bottom", "centre")

```r
#These maps did not have legends
MapBounds = tm_shape(ShpNeighbours)+tm_polygons(fill='white', fill_alpha=0.6)
#fill_alpha specifies transparency
MapPtbo = MapBounds + tm_shape(Ptbo)+tm_polygons(fill='black',fill_alpha=0.6)
MapPtboCT = MapPtbo + tm_shape(CT)+tm_symbols(fill='red')

#Let's specify a legend 
MapPtboCTL = MapPtboCT +
  tm_add_legend(type = "polygons",
                labels = c("County Boundaries", "Peterborough", "Car Thefts"),
                fill = c("white", "black", "red"))

MapPtboCTL
```
![Map Ptbo CTL](../assets/images/MapPtboCTL)
```r
#A legend with fill=*variable
MapBoundsL = tm_shape(ShpNeighbours)+tm_polygons(fill="MUNICIPA_2", fill_alpha=0.6, fill.legend=tm_legend(position=tm_pos_in("left","top")))
MapBoundsL
```
![Map Bounds L](../assets/images/MapBoundsL)

That's not a great title (the column name is uninformative). We can manually reset this with 'title=...' in tm_legend(), and we can add some inner.margin to give the legend space
```r
MapBoundsL = tm_shape(ShpNeighbours)+
  tm_polygons(fill="MUNICIPA_2", fill_alpha=0.6, 
              fill.legend=tm_legend(position=tm_pos_in("left","top"), 
                                    title="Municipalities Bordering the City of Peterborough"))+
  tm_layout(asp=1, inner.margins=c(0.2,1,1,0.2))
MapBoundsL
```
![Map Bounds L2](../assets/images/MapBoundsL2)

## Labelling Features & Using a Bounding Box for Map Extent

Instead of a symbolizing by colour, sometimes it can look better to add labels on features in the map instead. In the above example, we don't really need to have each boundary represented by a different colour: a simple label will suffice. If we want to add some emphasis on Peterborough, we can add it as a separate layer with a fill.
One issue here is that Peterborough has a smaller extent than the surrounding municipalities. If we use ShpNeighbours to set the extent first, we will draw Peterborough over top of its label. If we use Peterborough first, the map is much too zoomed in. Instead, we can calculate the extent of ShpNeighbours using `st_bbox()` and setting tmap_options(bbox= X), where X is our bounding box

```r
tmap_mode("plot")
MapBoundsLabel = 
  tm_shape(ShpNeighbours)+
  tm_borders()+
  tm_text("MUNICIPA_2", size=0.5, col="black", remove.overlap=TRUE)+
  tm_shape(Ptbo)+
  tm_polygons(fill="red")

MapBoundsLabel
```
This results in a red City of Peterborough drawn over the label
![Map Bounds Label](../assets/images/MapBoundsLabel)

Instead, set a bounding box for the map from ShpNeighbours and draw in the correct order
```r
SNbbox = st_bbox(ShpNeighbours)
tmap_options(bbox = SNbbox)

#Now create map
MapBoundsLabel2 =
  tm_shape(Ptbo)+
  tm_polygons(fill="red")+
  tm_shape(ShpNeighbours)+
  tm_borders()+
  tm_text("MUNICIPA_2", size=0.5, col="black", remove.overlap=TRUE)

MapBoundsLabel2
```
![Map Bounds Label 2](../assets/images/MapBoundsLabel2)

## Map elements: scale bars, north arrows, and titles

There are a few additional map elements that should be present on every map, including a north arrow or compass rose, scale text or scale bars, title (if map document), and text. Each of these can be added in tmap with fairly simple additions. 

North arrows or compass roses are added via tm_compass. Check ?tm_compass to see all of the options available to you.

tm_scalerbar adds a scale bar to the map. You can specify the exact breaks on the scale bar by specifying breaks=(). As with many other map elements, you can adjust the  text size as well. 

Titles can be added with tm_title and will appear at the top centre above the map by default. 

Text uses `tm_credits()`, where the first argument is the text to be displayed. The text size can be changed as noted above, and fonts can be changed with fontface. 

```r
MapBoundsLNS = tm_shape(ShpNeighbours)+
  tm_polygons(fill="MUNICIPA_2", fill_alpha=0.6, 
              fill.legend=tm_legend(position=tm_pos_in("left","top"),title=""))+
  tm_compass(type = "arrow", position = c("right", "top")) +
  tm_scalebar(breaks = c(0, 10, 20), text.size = 1, position = c("left", "bottom")) +
  tm_title("City of Peterborough and Bordering Municipalities") +
  tm_credits("  Created by: James Marcaccio, 
  Created on: 12 October 2025, 
  NAD83 UTM Zone 17N 
  Data from MaDGIC Workshop", position = c("right", "bottom"), size=0.5)+
  tm_layout(asp=1, inner.margins=c(0.2,0.5,0.5,0.2))
MapBoundsLNS
```
![Map Bounds LNS](../assets/images/MapBoundsLNS)

## Giving your map additional context: graticules and inset maps

Sometimes, you need to give your map additional context with a wider view of the world. There are two main ways to do this: graticules and inset maps. 

Graticules are simply lines of longitude and latitude, which you can add to your map with `tm_graticules()`. You can leave most of the defaults to get a decent view, but you may want to change the number of lines on each axis by specifying n.x or n.y; you can also change the projection with crs but the default is EPSG:4326 which is what is commonly used, even on maps in alternate projections. The colour (col) and transparency (alpha) of the lines can also be changed. Some people prefer no lines and only 'tick marks' instead. 

You may instead wish to add an additional inset map that shows a view of a wider area (smaller scale). These are more difficult to code and require some calculation to determine the relative view and size of each map.

```r
#Check the viewer
MapWQPtbozG = MapWQPtboz + tm_graticules()

MapWQPtbozG
```
![Map WQPtbo zG](../assets/images/MapWQPtbozG)
```r
#for inset maps
MapWQPtbozG
print(MapPtbo+tm_title("Study Area"), vp = grid::viewport(0.75,0.25, width = 0.3, height = 0.3))
```
![Map WQPtbo zG2](../assets/images/MapWQPtbozG2)

## Multi-map panels (faceting)
Similar to ggplot2, you can make multi-panel figures with multiple maps using tm_facets(). 

```r
#Using facets
MultiPanelCT = MapBounds + tm_shape(CT) + tm_symbols(fill = "Make", col = "white") +
  tm_facets_wrap(by = "Year", nrow = 2)
MultiPanelCT
```
![MultiPanel](../assets/images/MultiPanelCT)

