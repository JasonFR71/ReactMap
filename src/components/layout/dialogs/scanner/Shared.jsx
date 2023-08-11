/* eslint-disable react/no-array-index-key */
// @ts-check
import * as React from 'react'
import {
  ListItemText,
  ListItem,
  ListItemIcon,
  styled,
  ListItemButton,
  Divider,
} from '@mui/material'
import { Circle } from 'react-leaflet'
import PermScanWifiIcon from '@mui/icons-material/PermScanWifi'
import ClearIcon from '@mui/icons-material/Clear'
import { useScanStore, useStore } from '@hooks/useStore'

import { Trans, useTranslation } from 'react-i18next'

const StyledListItem = styled(ListItem)(() => ({
  padding: '2px 16px',
}))

export const StyledListItemText = styled(ListItemText)(() => ({
  textAlign: 'center',
}))

const StyledListButton = styled(ListItemButton)(() => ({
  padding: '2px 16px',
}))

export const StyledDivider = styled(Divider)(() => ({
  margin: '10px 0',
}))

const { setScanMode } = useScanStore.getState()

export const COLORS = /** @type {const} */ ({
  blue: 'rgb(90, 145, 255)',
  orange: 'rgb(255, 165, 0)',
  red: 'rgb(255, 100, 90)',
})

export function ScanRequests() {
  const { t } = useTranslation()
  const amount = useScanStore((s) => s.scanCoords.length)
  return (
    <StyledListItem style={{ margin: 0 }} className="no-leaflet-margin">
      <ListItemText secondary={`${t('scan_requests')}:`} />
      <StyledListItemText secondary={amount} />
    </StyledListItem>
  )
}

export function ScanQueue() {
  const { t } = useTranslation()
  const queue = useScanStore((s) => s.queue)
  return (
    <StyledListItem className="no-leaflet-margin">
      <ListItemText secondary={`${t('scan_queue')}:`} />
      <StyledListItemText secondary={queue} />
    </StyledListItem>
  )
}

/**
 *
 * @param {{ mode: import('@hooks/useStore').ScanMode }} props
 * @returns
 */
export function ScanConfirm({ mode }) {
  const { t } = useTranslation()
  const scannerCooldown = useStore((s) => s.scannerCooldown)
  const valid = useScanStore((s) => s.valid)

  return (
    <StyledListButton
      color="secondary"
      disabled={!valid || !!scannerCooldown}
      onClick={() => setScanMode(`${mode}Mode`, 'sendCoords')}
    >
      <ListItemIcon>
        <PermScanWifiIcon color="secondary" />
      </ListItemIcon>
      <ListItemText
        primary={
          scannerCooldown ? (
            <Trans
              i18nKey="scanner_countdown"
              values={{ time: scannerCooldown }}
            />
          ) : (
            t('click_to_scan')
          )
        }
      />
    </StyledListButton>
  )
}

export function InAllowedArea() {
  const { t } = useTranslation()
  const valid = useScanStore((s) => s.valid)
  return valid ? null : <ListItemText secondary={t('scan_outside_area')} />
}

/**
 *
 * @param {{ mode: import('@hooks/useStore').ScanMode}} props
 * @returns
 */
export function ScanCancel({ mode }) {
  const { t } = useTranslation()
  return (
    <StyledListButton onClick={() => setScanMode(`${mode}Mode`, '')}>
      <ListItemIcon>
        <ClearIcon color="primary" />
      </ListItemIcon>
      <ListItemText primary={t('cancel')} />
    </StyledListButton>
  )
}

/**
 *
 * @param {{ radius: number, lat: number, lon: number, color?: string }} props
 * @returns
 */
export function ScanCircle({ radius, lat, lon, color = COLORS.blue }) {
  return (
    <Circle
      radius={radius}
      center={[lat, lon]}
      fillOpacity={0.1}
      color={color}
      fillColor={color}
    />
  )
}

/**
 *
 * @param {{ radius?: number, color?: string }} props
 * @returns
 */
export function ScanCircles({ radius, color }) {
  const scanCoords = useScanStore((s) => s.scanCoords)
  const userRadius = useScanStore((s) => s.userRadius)

  return scanCoords.map((coords) => (
    <ScanCircle
      key={`${coords.join('')}${radius}`}
      radius={radius || userRadius}
      lat={coords[0]}
      lon={coords[1]}
      color={color}
    />
  ))
}
