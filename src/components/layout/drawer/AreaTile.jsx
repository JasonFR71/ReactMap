import * as React from 'react'
import { Grid, MenuItem, Typography, Checkbox } from '@mui/material'

import Utility from '@services/Utility'

export default function AreaTile({
  name,
  feature,
  childAreas,
  scanAreasZoom,
  allAreas,
  i,
  map,
  scanAreas,
  setAreas,
  backgroundColor,
}) {
  if (!scanAreas) return null

  const hasAll =
    childAreas &&
    childAreas.every(
      (c) =>
        c.properties.manual ||
        scanAreas.filter.areas.includes(c.properties.key),
    )
  const hasSome =
    childAreas &&
    childAreas.some((c) => scanAreas.filter.areas.includes(c.properties.key))
  const hasManual =
    feature?.properties?.manual || childAreas.every((c) => c.properties.manual)

  return (
    <Grid
      item
      xs={
        name || (childAreas.length % 2 === 1 && i === childAreas.length - 1)
          ? 12
          : 6
      }
      style={{
        border: `1px solid ${feature?.properties?.color || 'grey'}`,
        backgroundColor,
      }}
    >
      <MenuItem
        style={{ height: '100%' }}
        onClick={() => {
          if (feature?.properties?.center) {
            map.flyTo(
              feature.properties.center,
              feature.properties.zoom || scanAreasZoom,
            )
          }
        }}
      >
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={name ? 11 : 10} style={{ textAlign: 'center' }}>
            <Typography
              variant={name ? 'h6' : 'caption'}
              align="center"
              style={{ whiteSpace: 'pre-wrap', width: '100%' }}
            >
              {name || feature.properties.name ? (
                Utility.getProperName(
                  name ||
                    feature.properties.formattedName ||
                    feature.properties.name,
                )
              ) : (
                <>&nbsp;</>
              )}
            </Typography>
          </Grid>
          <Grid item xs={name ? 1 : 2} style={{ textAlign: 'right' }}>
            <Checkbox
              size="small"
              indeterminate={name ? hasSome && !hasAll : false}
              checked={
                name
                  ? hasAll
                  : scanAreas.filter.areas.includes(feature.properties.key)
              }
              onClick={(e) => e.stopPropagation()}
              onChange={() =>
                setAreas(
                  name
                    ? childAreas.map((c) => c.properties.key)
                    : feature.properties.key,
                  allAreas,
                  name ? hasSome : false,
                )
              }
              style={{
                color:
                  hasManual ||
                  (name ? !childAreas.length : !feature.properties.name)
                    ? backgroundColor
                    : 'none',
              }}
              disabled={
                (name ? !childAreas.length : !feature.properties.name) ||
                hasManual
              }
            />
          </Grid>
        </Grid>
      </MenuItem>
    </Grid>
  )
}
