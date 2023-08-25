/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
// @ts-check
import * as React from 'react'
import { Marker, Polyline, useMapEvents } from 'react-leaflet'
import { darken } from '@mui/material'

import RoutePopup from '@components/popups/Route'

import routeMarker from '../markers/route'

const POSITIONS = /** @type {const} */ (['start', 'end'])

const LINE_OPACITY = 0.33
const MARKER_OPACITY = LINE_OPACITY * 2

/**
 *
 * @param {import("@rm/types").Route} route
 * @returns
 */
const RouteTile = (route) => {
  const [clicked, setClicked] = React.useState(false)
  const [hover, setHover] = React.useState('')

  /** @type {React.MutableRefObject<import("leaflet").Polyline>} */
  const lineRef = React.useRef()

  const waypoints = React.useMemo(
    () => [
      {
        lat_degrees: route.start_lat,
        lng_degrees: route.start_lon,
        elevation_in_meters: 0,
      },
      ...route.waypoints,
      {
        lat_degrees: route.end_lat,
        lng_degrees: route.end_lon,
        elevation_in_meters: 1,
      },
    ],
    [route],
  )

  const [color, darkened] = React.useMemo(
    () => [
      `#${route.image_border_color}`,
      darken(`#${route.image_border_color}`, 0.2),
    ],
    [route.image_border_color],
  )

  useMapEvents({
    click: ({ originalEvent }) => {
      if (!originalEvent.defaultPrevented) {
        setClicked(false)
        setHover('')
      }
    },
  })

  return (
    <>
      {POSITIONS.map((position) => (
        <Marker
          key={position}
          opacity={hover || clicked ? 1 : MARKER_OPACITY}
          zIndexOffset={hover === position ? 2000 : hover || clicked ? 1000 : 0}
          position={[route[`${position}_lat`], route[`${position}_lon`]]}
          icon={routeMarker(position)}
          eventHandlers={{
            popupopen: () => setClicked(true),
            popupclose: () => setClicked(false),
            mouseover: () => {
              if (lineRef.current) {
                lineRef.current.setStyle({ color: darkened, opacity: 1 })
              }
              setHover(position)
            },
            mouseout: () => {
              if (lineRef.current && !clicked) {
                lineRef.current.setStyle({ color, opacity: MARKER_OPACITY })
              }
              setHover('')
            },
          }}
        >
          <RoutePopup
            {...route}
            waypoints={waypoints}
            end={position === 'end'}
          />
        </Marker>
      ))}
      <Polyline
        ref={lineRef}
        eventHandlers={{
          click: ({ originalEvent }) => {
            originalEvent.preventDefault()
            setClicked((prev) => !prev)
          },
          mouseover: ({ target }) => {
            if (target && !clicked) {
              target.setStyle({ color: darkened, opacity: 1 })
            }
          },
          mouseout: ({ target }) => {
            if (target && !clicked) {
              target.setStyle({ color, opacity: LINE_OPACITY })
            }
          },
        }}
        dashArray={route.reversible ? undefined : '5, 5'}
        positions={waypoints.map((waypoint) => [
          waypoint.lat_degrees,
          waypoint.lng_degrees,
        ])}
        pathOptions={{
          color: clicked || hover ? darkened : color,
          opacity: clicked || hover ? 1 : LINE_OPACITY,
          weight: 4,
        }}
      />
    </>
  )
}

const RouteMemo = React.memo(RouteTile, () => true)

export default RouteMemo
