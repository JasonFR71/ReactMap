// @ts-check
import * as React from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { useMutation, useQuery } from '@apollo/client'
import { allProfiles, setHuman } from '@services/queries/webhook'

import { useWebhookStore } from '../store'

/** @type {React.CSSProperties} */
const STYLE = { minWidth: 100 }

/**
 * Convenient module for selecting a profile
 * @returns
 */
export function ProfileSelect() {
  const currentProfile = useWebhookStore((s) => s.human.current_profile_no || 0)

  /** @type {import('@apollo/client').ApolloQueryResult<{ webhook: { profile: import('types').PoracleProfile[] } }>} */
  const { data: profiles } = useQuery(allProfiles, {
    fetchPolicy: 'no-cache',
    variables: {
      category: 'profiles',
      status: 'GET',
    },
  })

  const [save] = useMutation(setHuman)

  const onChange = React.useCallback(
    (event) => {
      save({
        variables: {
          category: 'switchProfile',
          status: 'POST',
          data: +event.target.value || currentProfile,
        },
      }).then(({ data }) => {
        if (data.webhook.human) {
          useWebhookStore.setState({ human: data.webhook.human })
        }
      })
    },
    [currentProfile],
  )

  return (
    <Select value={currentProfile || ''} onChange={onChange} style={STYLE}>
      {(profiles?.webhook?.profile || []).map((profile) => (
        <MenuItem key={profile.profile_no} value={profile.profile_no}>
          {profile.name}
        </MenuItem>
      ))}
    </Select>
  )
}
