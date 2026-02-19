---
layout: default
title: Importing Data
nav_order: 3
---

# Importing Data
There are various ways to import data. Generally, the method you use will depend on what type of data you are trying to load in.

## Importing Vector Data with `read_sf()`
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
```
### plot(parking)
You should now see the following plot:

![parking plot](../assets/images/plot-parking)

```r
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

## Importing text files/df
Once you read in a text file like a csv, the resulting dataframe can be read by sf_read(). Because these data types are not explicitly spatial, we do need to specify how they will get there geography. We do this by specifying the x and y values using options. As mentioned above, there are different projections that your data can exist in, and plotting them in the wrong projection will result in some odd looking maps!
If you have numbers that are in the tens to hundreds with multiple values after the decimal and labelled latitude and longitude, it is likely the geographic coordinate system WGS84 (EPSG:4326). In Peterborough and the surrounding area, coordinates with hundreds of thousands and millions are likely UTM projected, which are covered in NAD83 UTM Zone 17N here (EPSG:26917). The values are also called easting and northing. 

```r
#best to use .csv files for geospatial data
csv = read.csv('simulated_road_network_points_20km_v2.csv')
#This is now a dataframe (df), not 'spatial' yet
plot(csv)
```
![csv dataframe](../assets/images/csvdf)
```r
#To read it spatially, must indicate x/y columns
carThefts = read_sf('simulated_road_network_points_20km_v2.csv', options = c('X_POSSIBLE_NAMES=Longitude','Y_POSSIBLE_NAMES=Latitude'))
plot(carThefts["Year"])
```
![Theft by year](../assets/images/theft_year)
```r
#These data use Longitude & Latitude X,Y
#Near Ptbo, ~ 44.35, -78.30
#If numbers are much larger (e.g. hundred thousands/millions)
#likely UTM projection
csvUTM = read.csv('waterQualityUTM.csv')
WQ = read_sf('waterQualityUTM.csv', options = c('X_POSSIBLE_NAMES=Easting', 'Y_POSSIBLE_NAMES=Northing'))
WQgeo = st_set_crs(WQ, 'EPSG:26917')
#st_set_crs does not change coordinates, just specifies projection
#check CRS with st_crs:
st_crs(carThefts)
st_crs(WQgeo)
plot(WQgeo["DOp"])
```
![DOp](../assets/images/DOp)
```r
#st_set_crs defines the projection. 
#st_transform changes the projection.
CT = st_set_crs(carThefts, 'EPSG:4326')
CTUTM = st_transform(CT, 'EPSG:26917')
st_crs(CT)
st_crs(CTUTM)
#Note the difference between CT, CTUTM
plot(CT['Year'])
plot(CTUTM['Year'])
```

<div style="display:flex; justify-content:center; gap:12px;">
  <img src="../assets/images/CT" alt="CT" style="max-width:48%; height:auto;">
  <img src="../assets/images/CTUTM" alt="CT UTM" style="max-width:48%; height:auto;">
</div>

## Importing Raster Data
In some ways, this is a bit easier. Just remember to use the correct package! Just like before, you can use `?rast` to open the R documentation in the "Help" pane.

```r
?rast
```

```r
trent = rast("C:/Users/ddesai/OneDrive - Trent University/Desktop/RStudio/RMapping/20250919_Trent.tif")
trent
#Note that console shows resolution, size, extent, CRS
plot(trent)
#This is a multi-band raster (red, green, blue) so it is displayed individually.
```
![Trent Multiband](../assets/images/trent_multiband)
```r
#Must use terra to see as a single colour composite
plotRGB(trent, r='red',g='green',b='blue',stretch='lin')
```
![Trent Terra](../assets/images/trent_terra)

Great, now let's move on to filtering!
