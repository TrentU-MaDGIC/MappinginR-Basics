---
layout: default
title: Getting Started
nav_order: 2
---

# Getting Started

## Essential Packages
Please use install.packages() or the Packages window in RStudio to download these. 
While **tmap** will be our package of choice for map making, we need some other packages to help use import and parse through our data.


```r
#| label: Load_Packages
library(sf)
library(terra)
library(sp)
library(raster)
library(tmap)
#library(leaflet)
library(dplyr)
```

### Example Install:
```r
#| label: Install_Packages
install.packages("terra")
```
