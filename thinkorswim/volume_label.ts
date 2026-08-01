#
# Volume Label (chart overlay)
# Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

def volM = volume / 1000000;

AddLabel(yes, "Volume: " + Round(volM, 2) + "M", Color.WHITE);
