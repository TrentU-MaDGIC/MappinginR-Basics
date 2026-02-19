---
layout: default
title: Importing Vector Data
nav_order: 3
---

# Importing Vector Data with `read_sf()`
The primary way to read most vector data like shapefiles is with read_sf(). This will create an sfc data type that can be used in other geospatial packages. You can use `?read_sf` to open the R documentation in the "Help" pane.

```r
?read_sf
```
We can see the required arguments are:
- **dsn**: A text string
- **file**: The file name (with directory)
- **layer**: The specific layer in a package (e.g. gpkg)

Importing shapefiles and geopackages is fairly simple, where the main argument is the source data file. If you are using shapefiles, you can point to the .shp file (instead of the main other files associated with it). Geopackages are an open source alternative (shapefiles are semi-closed) that can collate many different layers at once, similar to an Esri geodatabase. Those .gdb files are unfortunately closed and cannot be read outside of ArcGIS products. Because geopackages are open source, they are a bit easier to manipulate in programs like R. 

```r
#Shapefiles have many parts (>=3)
#Point to the .shp
parking = read_sf('Trent_newParking.shp')
#Note that parking is a simple feature collection, sfc
parking
#simple map with plot()
plot(parking)

#Can query/filter before loading data, so you do not import too much data
bounds = ('MuniBoundsLS.gpkg')
#This is too much to plot at once
#plot(bounds)

#Query using SQL. Similar to ArcGIS and QGIS
Ptbo = read_sf(bounds, query = 'SELECT * FROM municipal_boundary__lower_and_single_tier WHERE  MUNICIPA_2 = "CITY OF PETERBOROUGH"')
#plot(Ptbo)

#how do we know layer name? Either a priori or use st_layers()
st_layers(bounds)
#What else is here? Foreshadowing...
```
Great, now let's move on to filtering!
