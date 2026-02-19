---
layout: default
title: Saving Outputs
nav_order: 7
---

# Saving Outputs to a File
At the end of your map-making journey, you will likely want to save your outputs. This can be conveniently done with tmap_save(). This will save your object(first argument) with the filename (second argument). Supported file types are read from the filename (as shown below, png works as well as jpg, tiff, pdf, bmp). You can also specify dpi (the default is 300).

```r
tmap_save(MapBoundsLNS, filename = "PtboAndBorders.png",dpi=600)
```
That's all! Remember to use the help window or ? to remind yourself and understand what all of these functions mean!
And don't forget to check your projections!
