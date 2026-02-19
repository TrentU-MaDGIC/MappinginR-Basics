---
layout: default
title: Filtering?
nav_order: 4
---

# Filtering through shapefiles and gpkg

Often you will find data that contains multitudes of products, but you may only want a particular part of it. We can filter through this data directly with geopackages and read_sf(), or with additional packages like dplyr for shapefiles and other data types. 
Spatial data should look similar to other tables of data you have encountered, they just have some spatial or geographic identifiers as part of the data. When you look inside a gpkg or shp, you will see rows and columns of data that you can query. Since they also have a spatial component, you can also query and compare by geometry.
```r
#You can also filter by geometry, with WKT data

#Use st_buffer to add a small buffer around Ptbo
PtboBuff = st_buffer(Ptbo, 0.01)
#Make that a geometry
PtboBuffGeom = st_geometry(PtboBuff)
#Make that WKT
PtboBuffWkt = st_as_text(PtboBuffGeom)

#Now filter the municipal boundaries with buffered Ptbo boundary
PtboNeighbours = read_sf(bounds, wkt_filter = PtboBuffWkt)
#This works for shapefiles too
ShpNeighbours = read_sf('Municipal_Boundary_-_Lower_and_Single_Tier.shp', wkt_filter = PtboBuffWkt)

#Filters for columns (non-spatial data) in shapefiles need to be loaded after import
BoundsShp = read_sf('Municipal_Boundary_-_Lower_and_Single_Tier.shp')
#Note we only specified filename, no filter

#to check all of the possible options 
#(might be a lot, so check 0-10 with head(,10))
head(unique(BoundsShp$MUNICIPA_2),10)

#Filtering
#This uses dplyr to filter out a particular input from shapefile,
#like we did with gpkg
Ptbo2 <- BoundsShp %>%
  filter(MUNICIPA_2 == "CITY OF PETERBOROUGH")
plot(Ptbo2)
```
This displays each of the municipalitices in Peterborough:
![PTBO Plot](../assets/images/Ptbo2)
```r
#Why are there so many maps? One plot per column
#You must specify what to 'plot' on the map
plot(Ptbo2["MUNICIPA_2"])
```
This displays only the specified municipality:
![PTBO Municipality 2 Plot](../assets/images/Ptbo_municipa2)
```r
#If you are not sure of the exact value to filter,
#can use grepl for partial text matching
Hamilton <- BoundsShp %>%
  filter(grepl("hamilton", MUNICIPA_2, ignore.case=TRUE))
plot(Hamilton["MUNICIPA_2"])
#Two areas generated because there is a 'City' and 'Township'
```
This shows us both the city and township of Hamilton:
![Hamilton Municipalities](../assets/images/hamilton)

## An Interjection on Projections

They're likely not anybodies favourite part of GIS, and may be the source of past and future problems. 
Coordinate reference systems, or CRS, define how spatial data relate to the surface (usually of Earth, but it can apply to any geoid). Think of it like the cartesian plane you see on most graphs, with an X and Y, except a lot more complicated. 

There are two types of CRS: Geographic and Projected. You will likely find both kinds of data. 
Geographic CRSs use units of degrees (or degrees, minutes, seconds) and are based on a large sphere or geoid that covers the entire system. These can use different datums which are either geocentric (work across the whole globe) or local (work best in a smaller area). The most common geographic CRS is WGS84 (World Geodetic System, 1984) which is geocentric and what most GPS units use for coordinates. CRSs can also be referred to by their EPSG number; in this case, WGS84 is represented by EPSG:4326
Projected CRSs use units of metres (or feet/miles) and use Cartesian coordinates (x,y). All projected CRSs have an underlying Geographic CRS that they reference. Projections are a necessity to move data from a three dimensional geoid to a flat display (like paper maps or your phone screen). It's impossible for a flat object to perfectly represent a curved one without some kind of distortion in its area, shape, and/or distance. You can maintain one or two of these properties, but not all three. For this reason these projected CRSs are usually smaller in geographic scope to maintain higher accuracy for a reasonable area; many Projected CRSs are part of a group that use multiple CRSs to cover a large area. The most common of these is the UTM Zone system (Universal Transverse Mercator) which divides the world by latitude bands (like time zones), and in North America we use the most recent datum (NAD83). Commons projected coordinate systems in our area are NAD83 UTM Zone 17N (EPSG:26917) and the Ontario Lambert Conformal Conic for the entire province of Ontario (EPSG:3161)
Why is this all important? Each CRS is only accurate to a certain degree and may prioritize particular distortions. In addition, transferring data between CRSs requires a mathematical transformation to take place. If we don't know what CRS is used, we cannot accurately place the data on the Earth. This is especially important when you have data with two different projections and need to display them together or perform analyses between them.  

**TL;DR:** Geospatial data have a coordinate reference system they use to place data on the Earth. Global data often use geographic coordinate systems like WGS84 with units of degrees (minutes, seconds) that exist between -180 and +180 and often have several values after the decimal (e.g. 44.4845). Local data will often use projected coordinate systems like NAD83 UTM Zone 17N and have units of metres that are often in the hundreds of thousands to millions with no or few points after the decimal. 
Please be aware of your projections!

Finally we can start map making!
